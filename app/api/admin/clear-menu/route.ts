import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyToken } from '@/lib/auth/jwt';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_session')?.value;
    if (!token || !(await verifyToken(token))) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();

    // Delete all menu items
    const { error: menuError } = await supabase
      .from('menu_items')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows

    if (menuError) {
      console.error('Error clearing menu items:', menuError);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to clear menu items', 
        details: menuError 
      }, { status: 500 });
    }

    // Delete all daily specials
    const { error: specialsError } = await supabase
      .from('daily_specials')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows

    if (specialsError) {
      console.error('Error clearing daily specials:', specialsError);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to clear daily specials', 
        details: specialsError 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'All menu items and daily specials cleared'
    });
  } catch (error) {
    console.error('Clear error:', error);
    return NextResponse.json({ success: false, error: 'Failed to clear database' }, { status: 500 });
  }
}
