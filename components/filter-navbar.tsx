"use client"

import { useEffect, useState } from "react"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
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
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    if (!dialogOpen) return
    const timer = setTimeout(() => setDialogOpen(false), 2000)
    return () => clearTimeout(timer)
  }, [dialogOpen])

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
            setDialogOpen(true)
          }}
        >
          Aktifkan
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          showCloseButton={false}
          className="grid place-items-center gap-4 py-10 text-center"
        >
          <DialogTitle className="sr-only">Anda Berhasil Diaktifkan</DialogTitle>
          <svg
            viewBox="0 0 52 52"
            className="size-24 animate-success-pop"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="26"
              cy="26"
              r="23"
              fill="none"
              stroke="oklch(0.62 0.168 168.4)"
              strokeWidth="3"
              className="animate-draw-circle origin-center"
            />
            <path
              fill="none"
              stroke="oklch(0.62 0.168 168.4)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="48"
              strokeDashoffset="48"
              d="M14 27 l8 8 l16 -17"
              className="animate-draw-check"
            />
          </svg>
          <DialogTitle className="text-lg font-semibold">
            Anda Berhasil Diaktifkan
          </DialogTitle>
          <DialogDescription>
            Filter telah berhasil diterapkan pada tampilan data.
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  )
}
