import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export const SESSION_COOKIE = "rb_session"
const SESSION_MAX_AGE = 60 * 60 * 8 // 8 jam dalam detik

export async function getSession(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(SESSION_COOKIE)?.value ?? null
}

export async function createSession(sessionId: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  })
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

export async function requireSession(): Promise<string> {
  const sessionId = await getSession()
  if (!sessionId) {
    redirect("/login")
  }
  return sessionId
}