import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { verifyToken } from '@/lib/auth/jwt';
import { sendWhatsAppMessage, formatOrderStatusMessage } from '@/lib/twilio/client';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_session')?.value;
    if (!token || !(await verifyToken(token))) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServiceClient();
    
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items:order_items(*)
      `)
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
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_session')?.value;
    if (!token || !(await verifyToken(token))) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServiceClient();
    const body = await request.json();
    const { orderId, status } = body;
    
    if (!orderId || !status) {
      return NextResponse.json(
        { success: false, error: 'Missing orderId or status' },
        { status: 400 }
      );
    }
    
    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating order:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update order' },
        { status: 500 }
      );
    }
    
    // Send WhatsApp notification if phone number exists
    if (data && data.customer_phone) {
      try {
        const message = formatOrderStatusMessage(
          data.id.slice(0, 8),
          status,
          data.customer_name,
          data.total_amount
        );
        
        await sendWhatsAppMessage(data.customer_phone, message);
      } catch (whatsappError) {
        // Log error but don't fail the request
        console.error('Failed to send WhatsApp notification:', whatsappError);
      }
    }
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
