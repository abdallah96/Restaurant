import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { verifyToken } from '@/lib/auth/jwt';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_session')?.value;
    if (!token || !(await verifyToken(token))) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServiceClient();
    
    // Get all order items from completed orders (delivered or ready)
    const { data: orderItems, error } = await supabase
      .from('order_items')
      .select(`
        item_name,
        item_id,
        item_type,
        quantity,
        price,
        subtotal,
        order_id,
        orders!inner(status, order_type, created_at)
      `)
      .in('orders.status', ['ready', 'delivered', 'confirmed', 'preparing'])
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching analytics:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch analytics' },
        { status: 500 }
      );
    }

    // Group by item name and calculate stats
    const itemStats: Record<string, {
      item_name: string;
      item_id: string;
      item_type: string;
      total_quantity: number;
      total_revenue: number;
      order_count: number;
      pickup_count: number;
      delivery_count: number;
      avg_price: number;
    }> = {};

    orderItems?.forEach((item: any) => {
      const order = item.orders;
      const key = item.item_name;
      
      if (!itemStats[key]) {
        itemStats[key] = {
          item_name: item.item_name,
          item_id: item.item_id,
          item_type: item.item_type,
          total_quantity: 0,
          total_revenue: 0,
          order_count: 0,
          pickup_count: 0,
          delivery_count: 0,
          avg_price: item.price,
        };
      }

      itemStats[key].total_quantity += item.quantity;
      itemStats[key].total_revenue += item.subtotal;
      itemStats[key].order_count += 1;
      
      if (order.order_type === 'pickup') {
        itemStats[key].pickup_count += 1;
      } else {
        itemStats[key].delivery_count += 1;
      }
    });

    // Convert to array and sort by total quantity (most popular first)
    const popularItems = Object.values(itemStats)
      .sort((a, b) => b.total_quantity - a.total_quantity);

    // Calculate totals
    const totals = {
      total_items_sold: popularItems.reduce((sum, item) => sum + item.total_quantity, 0),
      total_revenue: popularItems.reduce((sum, item) => sum + item.total_revenue, 0),
      unique_items: popularItems.length,
    };

    return NextResponse.json({
      success: true,
      data: {
        popularItems,
        totals,
      },
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

