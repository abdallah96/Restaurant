import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date');
    
    let query = supabase
      .from('daily_specials')
      .select('*')
      .eq('is_active', true);
    
    if (date) {
      query = query.eq('active_date', date);
    } else {
      // Get today's special
      const today = new Date().toISOString().split('T')[0];
      query = query.eq('active_date', today);
    }
    
    const { data: dailySpecials, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching daily specials:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch daily menu' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true, data: dailySpecials });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch daily menu' },
      { status: 500 }
    );
  }
}
