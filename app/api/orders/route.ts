import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { CartItem } from '@/types';

export async function GET() {
  try {
    const supabase = await createClient();
    
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
    const supabase = await createClient();
    const body = await request.json();
    
    // Validate required fields
    if (!body.customerName || !body.customerPhone || !body.items || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
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
      return NextResponse.json(
        { success: false, error: 'Failed to create order' },
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
      // Try to delete the order if items creation failed
      await supabase.from('orders').delete().eq('id', order.id);
      return NextResponse.json(
        { success: false, error: 'Failed to create order items' },
        { status: 500 }
      );
    }

    // Send WhatsApp notification
    await sendWhatsAppNotification(order, items);

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

async function sendWhatsAppNotification(order: any, items: CartItem[]) {
  try {
    const whatsappNumber = process.env.WHATSAPP_PHONE_NUMBER;
    
    if (!whatsappNumber) {
      console.log('WhatsApp number not configured');
      return;
    }

    const itemsList = items
      .map((item) => `- ${item.name} x${item.quantity} (${item.price} FCFA)`)
      .join('\n');

    const message = `🔔 Nouvelle commande #${order.id.slice(0, 8)}\n\n` +
      `👤 Client: ${order.customer_name}\n` +
      `📞 Téléphone: ${order.customer_phone}\n` +
      `📦 Type: ${order.order_type === 'delivery' ? 'Livraison' : 'À emporter'}\n` +
      `${order.delivery_address ? `📍 Adresse: ${order.delivery_address}\n` : ''}` +
      `\n📋 Articles:\n${itemsList}\n\n` +
      `💰 Total: ${order.total_amount} FCFA\n` +
      `${order.notes ? `\n📝 Notes: ${order.notes}` : ''}`;

    console.log('WhatsApp notification:', message);
    console.log('Send to:', whatsappNumber);
    
    // Implement WhatsApp API integration here
    
  } catch (error) {
    console.error('Failed to send WhatsApp notification:', error);
    // Don't fail the order if notification fails
  }
}
