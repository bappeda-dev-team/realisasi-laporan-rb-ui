import { NextRequest } from "next/server"
import { fetchPerencanaan } from "@/lib/perencanaan-client"

type RouteContext = {
  params: Promise<{ path: string[] }>
}

export async function GET(request: NextRequest, context: RouteContext) {
  return proxy(request, context)
}

export async function POST(request: NextRequest, context: RouteContext) {
  return proxy(request, context)
}

export async function PUT(request: NextRequest, context: RouteContext) {
  return proxy(request, context)
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return proxy(request, context)
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return proxy(request, context)
}

async function proxy(request: NextRequest, context: RouteContext) {
  const { path } = await context.params
  const subpath = `${path.join("/")}${request.nextUrl.search}`

  const upstreamHeaders = new Headers()
  const contentType = request.headers.get("content-type")
  if (contentType) {
    upstreamHeaders.set("content-type", contentType)
  }

  const init: RequestInit = { method: request.method, headers: upstreamHeaders }
  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = request.body
  }

  const upstream = await fetchPerencanaan(subpath, init)
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