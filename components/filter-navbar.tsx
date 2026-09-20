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

const daftarPeriode = ["Semester I", "Semester II", "Tahun Penuh"]

const daftarTahun = [
  "2020",
  "2021",
  "2022",
  "2023",
  "2024",
  "2025",
  "2026",
  "2027",
  "2028",
  "2029",
  "2030",
]

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

type OpdItem = { id: string | number; nama: string }

export function FilterNavbar() {
  const { opd, setOpd, periode, setPeriode, tahun, setTahun, bulan, setBulan } =
    useFilter()

  const [draftOpd, setDraftOpd] = useState(opd)
  const [draftPeriode, setDraftPeriode] = useState(periode)
  const [draftTahun, setDraftTahun] = useState(tahun)
  const [draftBulan, setDraftBulan] = useState(bulan)
  const [dialogOpen, setDialogOpen] = useState(false)

  const [daftarOpd, setDaftarOpd] = useState<string[]>(["Semua OPD"])
  const [loadingOpd, setLoadingOpd] = useState(true)

  // --- Sinkronisasi draft ketika Context berubah (setelah hydrate) ---
  useEffect(() => {
    setDraftOpd(opd)
  }, [opd])

  useEffect(() => {
    setDraftPeriode(periode)
  }, [periode])

  useEffect(() => {
    setDraftTahun(tahun)
  }, [tahun])

  useEffect(() => {
    setDraftBulan(bulan)
  }, [bulan])

  // --- Fetch daftar OPD ---
  useEffect(() => {
    let cancelled = false
    async function fetchOpd() {
      try {
        setLoadingOpd(true)
        const res = await fetch("/api/kepegawaian/opd/all", {
          method: "GET",
          headers: { Accept: "application/json" },
        })
        if (!res.ok) throw new Error(`Gagal memuat OPD (${res.status})`)
        const json = await res.json()

        const raw: unknown = Array.isArray(json) ? json : json?.data ?? []
        const list: OpdItem[] = (Array.isArray(raw) ? raw : [])
          .map((item) => {
            if (typeof item === "string") return { id: item, nama: item }
            if (item && typeof item === "object") {
              const obj = item as Record<string, unknown>
              const nama =
                (obj.nama as string) ??
                (obj.name as string) ??
                (obj.nama_opd as string) ??
                (obj.label as string) ??
                ""
              const id = (obj.id as string | number) ?? nama
              return { id, nama }
            }
            return null
          })
          .filter((v): v is OpdItem => !!v && !!v.nama)

        if (!cancelled) {
          setDaftarOpd(["Semua OPD", ...list.map((o) => o.nama)])
        }
      } catch (err) {
        console.error("Gagal mengambil daftar OPD:", err)
        if (!cancelled) setDaftarOpd(["Semua OPD"])
      } finally {
        if (!cancelled) setLoadingOpd(false)
      }
    }
    fetchOpd()
    return () => {
      cancelled = true
    }
  }, [])

  // --- Validasi: kalau OPD tersimpan sudah tidak ada di daftar, reset ke "Semua OPD" ---
  useEffect(() => {
    if (loadingOpd) return
    if (draftOpd && !daftarOpd.includes(draftOpd)) {
      setDraftOpd("Semua OPD")
      setOpd("Semua OPD")
    }
  }, [loadingOpd, daftarOpd, draftOpd, setOpd])

  // --- Auto close dialog ---
  useEffect(() => {
    if (!dialogOpen) return
    const timer = setTimeout(() => setDialogOpen(false), 2000)
    return () => clearTimeout(timer)
  }, [dialogOpen])

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-2">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground">OPD</span>
          <Select
            value={draftOpd}
            onValueChange={setDraftOpd}
            disabled={loadingOpd}
          >
            <SelectTrigger size="sm">
              <SelectValue
                placeholder={loadingOpd ? "Memuat..." : "Pilih OPD"}
              />
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