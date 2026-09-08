"use client"

import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { useFilter } from "@/components/filter-context"

const daftarOpd = [
  "Semua OPD",
  "Bappeda",
  "Dinas Kesehatan",
  "Dinas Pendidikan",
  "Dinas PUPR",
  "Dinas Pertanian",
  "Dinas Sosial",
  "Dinas Tenaga Kerja",
  "Dinas Lingkungan Hidup",
  "Dinas Perhubungan",
]

const daftarPeriode = ["Semester I", "Semester II", "Tahun Penuh"]

const daftarTahun = ["2024", "2025", "2026"]

const daftarBulan = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
]

export function FilterNavbar() {
  const { opd, setOpd, periode, setPeriode, tahun, setTahun, bulan, setBulan } =
    useFilter()
  const [draftOpd, setDraftOpd] = useState(opd)
  const [draftPeriode, setDraftPeriode] = useState(periode)
  const [draftTahun, setDraftTahun] = useState(tahun)
  const [draftBulan, setDraftBulan] = useState(bulan)

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-2">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground">OPD</span>
          <Select value={draftOpd} onValueChange={setDraftOpd}>
            <SelectTrigger size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {daftarOpd.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground">Periode</span>
          <Select value={draftPeriode} onValueChange={setDraftPeriode}>
            <SelectTrigger size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {daftarPeriode.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground">Tahun</span>
          <Select value={draftTahun} onValueChange={setDraftTahun}>
            <SelectTrigger size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {daftarTahun.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground">Bulan</span>
          <Select value={draftBulan} onValueChange={setDraftBulan}>
            <SelectTrigger size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {daftarBulan.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          size="sm"
          type="button"
          onClick={() => {
            setOpd(draftOpd)
            setPeriode(draftPeriode)
            setTahun(draftTahun)
            setBulan(draftBulan)
          }}
        >
          Aktifkan
        </Button>
      </div>
    </div>
  )
}
