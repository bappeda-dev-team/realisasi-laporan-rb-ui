import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const SESSION_COOKIE = "rb_session"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionId = request.cookies.get(SESSION_COOKIE)?.value

  const isPublicPath = pathname === "/login"

  if (!sessionId && !isPublicPath) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("next", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (sessionId && isPublicPath) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
}