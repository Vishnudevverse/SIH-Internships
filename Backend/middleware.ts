import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req: NextRequest) {
  const token = req.headers.get('authorization')?.split(' ')[1]

  if (!token) {
    return new NextResponse(
      JSON.stringify({ success: false, message: 'Authentication token not provided' }),
      { status: 401, headers: { 'content-type': 'application/json' } }
    )
  }

  try {
    await jwtVerify(token, secret)
    return NextResponse.next()
  } catch (err) {
    return new NextResponse(
      JSON.stringify({ success: false, message: 'Invalid or expired token' }),
      { status: 401, headers: { 'content-type': 'application/json' } }
    )
  }
}

export const config = {
  matcher: ['/api/user/:path*', '/api/recommendations/:path*', '/api/wishlist/:path*'],
}
