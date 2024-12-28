import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const DEMO_USER = {
  id: '1',
  email: 'admin@restaurant.com',
  password: 'admin123',
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // In a real app, validate against database
    if (email === DEMO_USER.email && password === DEMO_USER.password) {
      // Set HTTP-only cookie
      cookies().set('session', DEMO_USER.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });

      return NextResponse.json(
        { success: true },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}