import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Cambiado para leer la cookie 'masala-admin-token' en vez de 'session'
  const session = request.cookies.get('masala-admin-token');
  const isAuthPage = request.nextUrl.pathname === '/login';

  if (!session && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (session && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Excluye rutas de API, archivos estáticos, imágenes, favicon y login
    '/((?!api|_next/static|_next/image|favicon.ico|login).*)',
  ],
};