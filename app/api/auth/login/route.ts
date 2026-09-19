import { NextRequest } from "next/server"
import { createSession } from "@/lib/auth"

const AUTH_BASE = process.env.NEXT_PUBLIC_AUTH_URL || "https://api-mahulu.kertaskerja.cc"

export async function POST(request: NextRequest) {
  let body: { username?: string; password?: string }
  try {
    body = await request.json()
  } catch {
    return Response.json({ message: "Format request tidak valid." }, { status: 400 })
  }

  const username = body.username?.trim()
  const password = body.password

  if (!username || !password) {
    return Response.json(
      { message: "Username dan password wajib diisi." },
      { status: 400 }
    )
  }

  if (!AUTH_BASE) {
    return Response.json(
      { message: "AUTH_URL belum dikonfigurasi di server." },
      { status: 500 }
    )
  }

  const res = await fetch(`${AUTH_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    cache: "no-store",
  })

  if (!res.ok) {
    return Response.json(
      { message: "Username atau password salah." },
      { status: 401 }
    )
  }

  const data = (await res.json()) as { sessionId?: string }
  if (!data.sessionId) {
    return Response.json(
      { message: "Respons login tidak memuat sessionId." },
      { status: 500 }
    )
  }

  await createSession(data.sessionId)
  return Response.json({ success: true })
}