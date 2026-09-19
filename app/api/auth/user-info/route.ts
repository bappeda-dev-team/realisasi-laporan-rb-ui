import { getSession } from "@/lib/auth"
import { cookies } from "next/headers"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api-mahulu.kertaskerja.cc"

export type UserInfo = {
  username?: string
  firstName?: string
  kode_opd?: string
  nip?: string
  roles?: string[]
}

export async function GET() {
  const sessionId = await getSession()
  const cookieStore = await cookies()

  if (!sessionId) {
    return Response.json({ message: "Otentikasi diperlukan." }, { status: 401 })
  }

  const res = await fetch(`${API_URL}/user-info`, {
    headers: {
      "Content-Type": "application/json",
      "X-Session-Id": sessionId,
      cookie: `sessionId=${sessionId}`,
    },
    cache: "no-store",
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    return Response.json(
      { message: errorData.message || "Sesi tidak valid." },
      { status: res.status }
    )
  }

  return Response.json(await res.json())
}