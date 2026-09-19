"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Landmark, Loader2, Lock, LogIn, User } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Toaster } from "@/components/ui/sonner"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")

    if (!username.trim() || !password) {
      setError("Username dan password wajib diisi.")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      })

      const data = (await res.json()) as { message?: string }

      if (!res.ok) {
        setError(data.message ?? "Login gagal. Silakan coba lagi.")
        return
      }

      toast.success("Anda berhasil masuk")
      const next = new URLSearchParams(window.location.search).get("next")
      router.push(next && next.startsWith("/") ? next : "/")
      router.refresh()
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(at_top_left,var(--muted),transparent_55%),radial-gradient(at_bottom_right,oklch(0.92_0_0),transparent_60%)]"
      />
      <Card className="relative w-full max-w-sm">
        <CardHeader className="items-center gap-3 text-center">
          <div className="flex aspect-square size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Landmark className="size-6" />
          </div>
          <div className="grid gap-1">
            <CardTitle className="text-xl font-semibold">Realisasi RB</CardTitle>
            <CardDescription>
              Masuk untuk mengakses laporan Reformasi Birokrasi
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} noValidate className="grid gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  placeholder="Masukkan username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-9 pl-8"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute top-1/2 right-1 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </Button>
              </div>
            </div>

            {error ? (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            ) : null}

            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : <LogIn />}
              Masuk
            </Button>
          </form>
        </CardContent>
      </Card>
      <Toaster position="top-right" />
    </main>
  )
}