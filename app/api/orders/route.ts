import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { CartItem } from '@/types';

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
        { success: false, error: 'Failed to fetch orders' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServiceClient();
    const body = await request.json();
    
    // Validate required fields
    if (!body.customerName || !body.customerPhone || !body.items || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate phone number format (basic validation)
    const cleanPhone = body.customerPhone.replace(/[\s\-\(\)]/g, '');
    if (!/^\+?[0-9]{8,15}$/.test(cleanPhone)) {
      console.error('Invalid phone number:', body.customerPhone);
      return NextResponse.json(
        { success: false, error: 'Numéro de téléphone invalide (8-15 chiffres requis)' },
        { status: 400 }
      );
    }

    // Validate items array
    if (!Array.isArray(body.items) || body.items.length === 0 || body.items.length > 50) {
      console.error('Invalid items array:', body.items);
      return NextResponse.json(
        { success: false, error: 'Articles invalides' },
        { status: 400 }
      );
    }

    // Calculate total amount
    const items: CartItem[] = body.items;
    const totalAmount = items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: body.customerName,
        customer_phone: body.customerPhone,
        customer_email: body.customerEmail || null,
        delivery_address: body.deliveryAddress || null,
        order_type: body.orderType || 'pickup',
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
        { success: false, error: 'Failed to create order', details: orderError },
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
        { success: false, error: 'Failed to create order items', details: itemsError },
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
      { success: false, error: 'Failed to create order', message: error?.message },
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

    const message = `🔔 *Nouvelle Commande* #${order.id.slice(0, 8)}\n\n` +
      `👤 *Client:* ${order.customer_name}\n` +
      `📞 *Téléphone:* ${order.customer_phone}\n` +
      `📦 *Type:* ${order.order_type === 'delivery' ? 'Livraison' : 'À emporter'}\n` +
      `${order.delivery_address ? `📍 *Adresse:* ${order.delivery_address}\n` : ''}` +
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
