"use client"

import { Badge } from "@/components/ui/badge"
import { useFilter } from "@/components/filter-context"

export default function DashboardPage() {
  const { tahun } = useFilter()
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold">Selamat Datang di Aplikasi Laporan Reformasi Birokrasi</h1>
        </div>
        <Badge variant="outline">TA {tahun}</Badge>
      </div>
    </div>
  )
}