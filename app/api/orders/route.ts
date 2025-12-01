import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { CartItem } from '@/types';

// Delivery zone prices
const DELIVERY_ZONE_PRICES: Record<string, number> = {
  ouakam: 1000,
  yoff: 2000,
  ville: 2000,
  almadie: 1500,
};

function getDeliveryFee(zone: string): number {
  return DELIVERY_ZONE_PRICES[zone.toLowerCase()] || 0;
}

export async function GET() {
  try {
    const supabase = createServiceClient();
    
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching orders:', error);
      return NextResponse.json(
        { success: false, error: 'Erreur lors de la récupération des commandes' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des commandes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServiceClient();
    const body = await request.json();
    
    // Validate required fields with specific messages
    if (!body.customerName || !body.customerName.trim()) {
      return NextResponse.json(
        { success: false, error: 'Le nom est requis' },
        { status: 400 }
      );
    }
    
    if (body.customerName.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Le nom doit contenir au moins 2 caractères' },
        { status: 400 }
      );
    }

    if (!body.customerPhone || !body.customerPhone.trim()) {
      return NextResponse.json(
        { success: false, error: 'Le numéro de téléphone est requis' },
        { status: 400 }
      );
    }

    // Validate phone number format (basic validation)
    const cleanPhone = body.customerPhone.replace(/[\s\-\(\)]/g, '');
    if (!/^\+?[0-9]{8,15}$/.test(cleanPhone)) {
      console.error('Invalid phone number:', body.customerPhone);
      return NextResponse.json(
        { success: false, error: 'Numéro de téléphone invalide. Format attendu: 8-15 chiffres (ex: +221771234567)' },
        { status: 400 }
      );
    }

    // Validate email if provided
    if (body.customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.customerEmail)) {
      return NextResponse.json(
        { success: false, error: 'Format d\'email invalide' },
        { status: 400 }
      );
    }

    // Validate delivery address if delivery order
    if (body.orderType === 'delivery') {
      if (!body.deliveryAddress || !body.deliveryAddress.trim()) {
        return NextResponse.json(
          { success: false, error: 'L\'adresse de livraison est requise pour les commandes en livraison' },
          { status: 400 }
        );
      }
      
      if (body.deliveryAddress.trim().length < 10) {
        return NextResponse.json(
          { success: false, error: 'Veuillez fournir une adresse complète (au moins 10 caractères)' },
          { status: 400 }
        );
      }
      
      if (!body.deliveryZone) {
        return NextResponse.json(
          { success: false, error: 'Veuillez sélectionner une zone de livraison' },
          { status: 400 }
        );
      }
    }

    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Votre panier est vide. Ajoutez des articles avant de commander.' },
        { status: 400 }
      );
    }

    // Validate items array
    if (!Array.isArray(body.items) || body.items.length === 0 || body.items.length > 50) {
      console.error('Invalid items array:', body.items);
      return NextResponse.json(
        { success: false, error: 'Les articles de la commande sont invalides' },
        { status: 400 }
      );
    }

    // Calculate total amount (items + delivery fee)
    const items: CartItem[] = body.items;
    const itemsTotal = items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
    
    // Calculate delivery fee if delivery order
    const deliveryZone = body.deliveryZone || null;
    const deliveryFee = deliveryZone ? getDeliveryFee(deliveryZone) : 0;
    const totalAmount = itemsTotal + deliveryFee;

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: body.customerName,
        customer_phone: body.customerPhone,
        customer_email: body.customerEmail || null,
        delivery_address: body.deliveryAddress || null,
        delivery_zone: deliveryZone,
        order_type: body.orderType || 'pickup',
        payment_method: body.paymentMethod || 'pay_at_arrival',
        total_amount: totalAmount,
        notes: body.notes || null,
        status: 'pending',
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error('Error creating order:', orderError);
      console.error('Order error details:', JSON.stringify(orderError, null, 2));
      return NextResponse.json(
        { success: false, error: 'Erreur lors de la création de la commande. Veuillez réessayer.' },
        { status: 500 }
      );
    }

    // Create order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      item_type: item.type,
      item_id: item.id,
      item_name: item.name,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.price * item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      console.error('Items error details:', JSON.stringify(itemsError, null, 2));
      // Try to delete the order if items creation failed
      await supabase.from('orders').delete().eq('id', order.id);
      return NextResponse.json(
        { success: false, error: 'Erreur lors de l\'enregistrement des articles. Veuillez réessayer.' },
        { status: 500 }
      );
    }

    // Send WhatsApp notification to all staff
    await sendWhatsAppNotificationToStaff(order, items);

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error: any) {
    console.error('Unexpected error:', error);
    console.error('Error stack:', error?.stack);
    return NextResponse.json(
      { success: false, error: 'Une erreur inattendue s\'est produite. Veuillez réessayer plus tard.' },
      { status: 500 }
    );
  }
}

/**
 * Send WhatsApp notification to all staff members
 * Uses the notifyAllStaff function from Twilio client
 */
async function sendWhatsAppNotificationToStaff(order: any, items: CartItem[]) {
  try {
    // Dynamically import to avoid edge runtime issues
    const { notifyAllStaff } = await import('@/lib/twilio/client');
    
    const itemsList = items
      .map((item) => `- ${item.name} x${item.quantity} (${item.price.toLocaleString()} FCFA)`)
      .join('\n');

    const paymentInfo = order.payment_method === 'pay_now' 
      ? '💳 *Paiement:* Orange Money (Payé maintenant)'
      : '💵 *Paiement:* À la réception';
    
    const message = `🔔 *Nouvelle Commande* #${order.id.slice(0, 8)}\n\n` +
      `👤 *Client:* ${order.customer_name}\n` +
      `📞 *Téléphone:* ${order.customer_phone}\n` +
      `📦 *Type:* ${order.order_type === 'delivery' ? 'Livraison' : 'À emporter'}\n` +
      `${order.delivery_zone ? `🗺️ *Zone:* ${order.delivery_zone.charAt(0).toUpperCase() + order.delivery_zone.slice(1)} (${getDeliveryFee(order.delivery_zone).toLocaleString()} FCFA)\n` : ''}` +
      `${order.delivery_address ? `📍 *Adresse:* ${order.delivery_address}\n` : ''}` +
      `${paymentInfo}\n` +
      `\n📋 *Articles:*\n${itemsList}\n\n` +
      `💰 *Total:* ${order.total_amount.toLocaleString()} FCFA\n` +
      `${order.notes ? `\n📝 *Notes:* ${order.notes}` : ''}`;

    // Send to all configured staff members
    await notifyAllStaff(message);
    
  } catch (error) {
    console.error('Failed to send WhatsApp notifications:', error);
    // Don't fail the order if notification fails
  }
}
