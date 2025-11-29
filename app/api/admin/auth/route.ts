import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/db/store';
import { signToken } from '@/lib/auth/jwt';
import { serialize } from 'cookie';

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let email: string, password: string;
    
    if (contentType.includes('application/json')) {
      const body = await request.json();
      email = body.email;
      password = body.password;
    } else {
      const formData = await request.formData();
      email = formData.get('email') as string;
      password = formData.get('password') as string;
    }

    if (!email || !password) {
      const errorResponse = NextResponse.json(
        { success: false, error: 'Email et mot de passe requis' },
        { status: 400 }
      );
      return errorResponse;
    }

    const isValid = dataStore.verifyAdmin(email, password);

    if (!isValid) {
      const errorResponse = NextResponse.json(
        { success: false, error: 'Identifiants invalides' },
        { status: 401 }
      );
      return errorResponse;
    }

    const user = dataStore.getAdminUser(email);
    if (!user) {
      const errorResponse = NextResponse.json(
        { success: false, error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
      return errorResponse;
    }

    // Create JWT token
    const token = await signToken({
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
