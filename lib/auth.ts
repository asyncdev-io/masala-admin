import { cookies } from 'next/headers';
import { type NextRequest } from 'next/server';

export async function getSession() {
  const cookieStore = cookies();
  const session = cookieStore.get('session');
  return session?.value;
}

export async function setSession(userId: string) {
  const cookieStore = cookies();
  cookieStore.set('session', userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
}

export async function clearSession() {
  const cookieStore = cookies();
  cookieStore.delete('session');
}