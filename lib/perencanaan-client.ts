const API_BASE = process.env.NEXT_PUBLIC_API_PERENCANAAN || ""
const API_ORIGIN = new URL(API_BASE).origin
const AUTH_URL = `${API_ORIGIN}/auth/login`

let cachedSessionId: string | null = null

async function login(): Promise<void> {
  const username = process.env.API_KEPEGAWAIAN_USERNAME
  const password = process.env.API_KEPEGAWAIAN_PASSWORD
  if (!username || !password) {
    throw new Error("API_KEPEGAWAIAN_USERNAME/PASSWORD belum dikonfigurasi.")
  }

  const res = await fetch(AUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  })

  if (!res.ok) {
    throw new Error(`Login gagal (status ${res.status})`)
  }

  const data = (await res.json()) as { sessionId?: string }
  if (!data.sessionId) {
    throw new Error("Respons login tidak memuat sessionId.")
  }

  cachedSessionId = data.sessionId
}

async function getSessionId(): Promise<string> {
  if (!cachedSessionId) {
    await login()
  }
  return cachedSessionId as string
}

async function doFetch(
  url: string,
  sessionId: string,
  init?: RequestInit
): Promise<Response> {
  const headers = new Headers(init?.headers)
  headers.set("X-Session-Id", sessionId)
  return fetch(url, { ...init, headers })
}

export async function fetchPerencanaan(
  path: string,
  init?: RequestInit
): Promise<Response> {
  const url = `${API_BASE}/${path}`
  const sessionId = await getSessionId()
  let res = await doFetch(url, sessionId, init)

  if (res.status === 401) {
    cachedSessionId = null
    const newSessionId = await getSessionId()
    res = await doFetch(url, newSessionId, init)
  }

  return res
}