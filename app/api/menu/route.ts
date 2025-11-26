import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    
    let query = supabase
      .from('menu_items')
      .select('*')
      .eq('is_available', true)
      .order('category', { ascending: true })
      .order('name', { ascending: true });
    
    if (category) {
      query = query.eq('category', category);
    }
    
    const { data: menuItems, error } = await query;
    
    if (error) {
      console.error('Error fetching menu items:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch menu items' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true, data: menuItems });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch menu items' },
      { status: 500 }
    );
  }
}
