import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { verifyToken } from '@/lib/auth/jwt';

// Get all menu items (admin view - includes unavailable items)
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_session')?.value;
    if (!token || !(await verifyToken(token))) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServiceClient();
    const { data: menuItems, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching menu items:', error);
      return NextResponse.json({ success: false, error: 'Failed to fetch menu items' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: menuItems });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch menu items' }, { status: 500 });
  }
}

// Create new menu item
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_session')?.value;
    if (!token || !(await verifyToken(token))) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, price, category, image_url, is_available, stock_quantity } = body;

    if (!name || !price || !category) {
      return NextResponse.json({ success: false, error: 'Name, price, and category are required' }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { data: menuItem, error } = await supabase
      .from('menu_items')
      .insert({
        name,
        description: description || null,
        price: parseFloat(price),
        category,
        image_url: image_url || null,
        is_available: is_available !== undefined ? is_available : true,
        stock_quantity: stock_quantity || 999,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating menu item:', error);
      return NextResponse.json({ success: false, error: 'Failed to create menu item' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: menuItem });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create menu item' }, { status: 500 });
  }
}

// Update menu item
export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_session')?.value;
    if (!token || !(await verifyToken(token))) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, description, price, category, image_url, is_available, stock_quantity } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Item ID is required' }, { status: 400 });
    }

    const updateData: any = { updated_at: new Date().toISOString() };
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (category !== undefined) updateData.category = category;
    if (image_url !== undefined) updateData.image_url = image_url;
    if (is_available !== undefined) updateData.is_available = is_available;
    if (stock_quantity !== undefined) updateData.stock_quantity = stock_quantity;

    const supabase = createServiceClient();
    const { data: menuItem, error } = await supabase
      .from('menu_items')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating menu item:', error);
      return NextResponse.json({ success: false, error: 'Failed to update menu item' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: menuItem });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update menu item' }, { status: 500 });
  }
}

// Delete menu item
export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_session')?.value;
    if (!token || !(await verifyToken(token))) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Item ID is required' }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting menu item:', error);
      return NextResponse.json({ success: false, error: 'Failed to delete menu item' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete menu item' }, { status: 500 });
  }
}
