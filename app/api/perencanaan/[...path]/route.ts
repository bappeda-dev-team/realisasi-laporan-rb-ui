import { NextRequest } from "next/server"
import { proxyUpstream } from "@/lib/api-proxy"

const API_BASE = process.env.NEXT_PUBLIC_API_PERENCANAAN || ""

type RouteContext = {
  params: Promise<{ path: string[] }>
}

export async function GET(request: NextRequest, context: RouteContext) {
  return handler(request, context)
}

export async function POST(request: NextRequest, context: RouteContext) {
  return handler(request, context)
}

export async function PUT(request: NextRequest, context: RouteContext) {
  return handler(request, context)
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return handler(request, context)
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return handler(request, context)
}

async function handler(request: NextRequest, context: RouteContext) {
  const { path } = await context.params
  return proxyUpstream(request, path, API_BASE)
}