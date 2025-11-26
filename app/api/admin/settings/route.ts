import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/db/store';

export async function GET() {
  try {
    const settings = dataStore.getAdminSettings();
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const updatedSettings = dataStore.updateAdminSettings(body);

    return NextResponse.json({ success: true, data: updatedSettings });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
