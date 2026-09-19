import { NextRequest } from "next/server"
import { SESSION_COOKIE } from "@/lib/auth"

export async function proxyUpstream(
  request: NextRequest,
  path: string[],
  baseUrl: string
): Promise<Response> {
  if (!baseUrl) {
    return Response.json(
      { message: "API_BASE belum dikonfigurasi di server." },
      { status: 500 }
    )
  }

  const sessionId = request.cookies.get(SESSION_COOKIE)?.value
  if (!sessionId) {
    return Response.json(
      { message: "Otentikasi diperlukan. Silakan masuk kembali." },
      { status: 401 }
    )
  }

  const subpath = `${path.join("/")}${request.nextUrl.search}`
  const url = `${baseUrl}/${subpath}`

  const upstreamHeaders = new Headers()
  upstreamHeaders.set("X-Session-Id", sessionId)
  upstreamHeaders.set("cookie", `sessionId=${sessionId}`)
  const contentType = request.headers.get("content-type")
  if (contentType) {
    upstreamHeaders.set("content-type", contentType)
  }

  const init: RequestInit = {
    method: request.method,
    headers: upstreamHeaders,
    cache: "no-store",
  }
  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = request.body
  }

  const upstream = await fetch(url, init)
  const body = await upstream.text()

  const responseHeaders = new Headers()
  const upstreamContentType = upstream.headers.get("content-type")
  if (upstreamContentType) {
    responseHeaders.set("content-type", upstreamContentType)
  }

  return new Response(body, {
    status: upstream.status,
    headers: responseHeaders,
  })
}