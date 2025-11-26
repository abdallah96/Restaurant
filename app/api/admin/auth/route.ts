import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/db/store';
import { signToken } from '@/lib/auth/jwt';
import { serialize } from 'cookie';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    const isValid = dataStore.verifyAdmin(email, password);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Identifiants invalides' },
        { status: 401 }
      );
    }

    const user = dataStore.getAdminUser(email);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Create JWT token
    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Set session cookie
    const cookie = serialize('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    const response = NextResponse.json({
      success: true,
      data: { 
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        authenticated: true 
      },
    });

    response.headers.set('Set-Cookie', cookie);
    return response;
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur d\'authentification' },
      { status: 500 }
    );
  }
}

// Logout endpoint
export async function DELETE() {
  const cookie = serialize('admin_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });

  const response = NextResponse.json({ success: true });
  response.headers.set('Set-Cookie', cookie);
  return response;
}
