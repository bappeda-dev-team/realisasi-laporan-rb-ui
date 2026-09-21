"use client"

import { useEffect, useState } from "react"
import { FileText, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useFilter } from "@/components/filter-context"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type RealisasiLaporan = {
  id: number
  bulan: string
  nilai: number
  capaian: number | null
  jenis_realisasi: string
  faktor_penunjang: string | null
  faktor_penghambat: string | null
  bukti_pendukung: string | null
  keterangan_bukti_pendukung: string | null
}

type BarisLaporanRb = {
  id_rb: number
  id_indikator: string
  id_target: string
  kegiatan_utama: string
  indikator: string
  keterangan: string
  baseline: {
    tahun: number
    target: string
    satuan: string
  }
  berjalan: {
    tahun: number
    target: string
    satuan: string
  }
  realisasi: RealisasiLaporan | null
}

type ApiLaporanResponse = {
  code?: number
  status?: string
  message?: string
  data?: BarisLaporanRb[]
}

type JenisRb = "GENERAL" | "TEMATIK"

const BULAN_MAP: Record<string, string> = {
  Januari: "1",
  Februari: "2",
  Maret: "3",
  April: "4",
  Mei: "5",
  Juni: "6",
  Juli: "7",
  Agustus: "8",
  September: "9",
  Oktober: "10",
  November: "11",
  Desember: "12",
}

function formatCapaian(capaian: number | null): string {
  if (capaian === null || capaian === undefined) return "-"
  return `${capaian.toFixed(2).replace(/\.?0+$/, "")}%`
}

type LaporanRbTableProps = {
  jenisRb: JenisRb
}

export function LaporanRbTable({ jenisRb }: LaporanRbTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [data, setData] = useState<BarisLaporanRb[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userInfo, setUserInfo] = useState<{
    kodeOpd: string
    nip: string
  } | null>(null)

  const { tahun, bulan } = useFilter()

  // fetch user info (kodeOpd & nip)
  useEffect(() => {
    let cancelled = false

    async function loadUser() {
      try {
        const res = await fetch("/api/auth/user-info", { cache: "no-store" })
        if (!res.ok) return
        const json = await res.json()
        if (!cancelled) {
          setUserInfo({
            kodeOpd: json.kode_opd ?? json.kodeOpd ?? "",
            nip: json.nip ?? "",
          })
        }
      } catch {
        // diamkan saja
      }
    }

    loadUser()
    return () => {
      cancelled = true
    }
  }, [])

  // fetch laporan per target
  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        if (!userInfo?.nip || !userInfo?.kodeOpd) {
          if (!cancelled) {
            setData([])
            setLoading(false)
          }
          return
        }

        const endpoint =
          jenisRb === "GENERAL" ? "laporanrbgeneral" : "laporanrbtematik"
        const bulanAngka = BULAN_MAP[bulan] ?? ""

        const params = new URLSearchParams()
        if (bulanAngka) params.set("bulan", bulanAngka)

        const res = await fetch(
          `/api/realisasi/${endpoint}/nip/${userInfo.nip}/kodeOpd/${userInfo.kodeOpd}/tahun/${tahun}/laporan?${params.toString()}`,
          { cache: "no-store" }
        )
        if (!res.ok) throw new Error(`HTTP ${res.status}`)

        const json: ApiLaporanResponse = await res.json()
        if (!cancelled) {
          setData(Array.isArray(json.data) ? json.data : [])
        }
      } catch (e) {
        if (!cancelled) {
          setError(
            e instanceof Error ? e.message : `Gagal memuat laporan RB ${jenisRb}`
          )
          setData([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [jenisRb, tahun, bulan, userInfo?.nip, userInfo?.kodeOpd])

  const filteredData = data.filter(
    (d) =>
      d.kegiatan_utama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.indikator.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const kolomCount = 13

  return (
    <div className="flex flex-col gap-4">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Cari kegiatan atau indikator..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table className="[&_th]:border-r [&_td]:border-r [&_th:last-child]:border-r-0 [&_td:last-child]:border-r-0 [&_th]:text-center [&_td]:text-center">
          <TableHeader>
            <TableRow>
              <TableHead rowSpan={2} className="w-12">
                No
              </TableHead>
              <TableHead rowSpan={2}>Kegiatan Utama</TableHead>
              <TableHead rowSpan={2}>Indikator</TableHead>
              <TableHead colSpan={2}>
                BaseLine {data[0]?.baseline.tahun ?? Number(tahun) - 1}
              </TableHead>
              <TableHead colSpan={4}>
                {data[0]?.berjalan.tahun ?? tahun}
              </TableHead>
              <TableHead rowSpan={2}>Keterangan</TableHead>
              <TableHead rowSpan={2}>Faktor Penunjang</TableHead>
              <TableHead rowSpan={2}>Faktor Penghambat</TableHead>
              <TableHead rowSpan={2}>Bukti Pendukung</TableHead>
            </TableRow>
            <TableRow>
              <TableHead>Target</TableHead>
              <TableHead>Satuan</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Realisasi</TableHead>
              <TableHead>Satuan</TableHead>
              <TableHead>Capaian</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={kolomCount}
                  className="h-24 text-center text-muted-foreground"
                >
                  Memuat data...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={kolomCount}
                  className="h-24 text-center text-destructive"
                >
                  {error}
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={kolomCount}
                  className="h-24 text-center text-muted-foreground"
                >
                  Tidak ada data ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item, index) => (
                <TableRow key={item.id_target || `${item.id_rb}-${index}`}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="text-left!">
                    {item.kegiatan_utama}
                  </TableCell>
                  <TableCell className="text-left!">{item.indikator}</TableCell>

                  {/* Baseline */}
                  <TableCell>{item.baseline.target}</TableCell>
                  <TableCell>{item.baseline.satuan}</TableCell>

                  {/* Tahun berjalan */}
                  <TableCell>{item.berjalan.target}</TableCell>
                  <TableCell>
                    {item.realisasi ? String(item.realisasi.nilai) : "-"}
                  </TableCell>
                  <TableCell>{item.berjalan.satuan}</TableCell>
                  <TableCell>
                    {item.realisasi
                      ? formatCapaian(item.realisasi.capaian)
                      : "-"}
                  </TableCell>

                  {/* Info */}
                  <TableCell className="text-left">{item.keterangan}</TableCell>
                  <TableCell className="text-left">
                    {item.realisasi?.faktor_penunjang || "-"}
                  </TableCell>
                  <TableCell className="text-left">
                    {item.realisasi?.faktor_penghambat || "-"}
                  </TableCell>

                  {/* Bukti Pendukung */}
                  <TableCell className="text-left">
                    {item.realisasi?.bukti_pendukung ? (
                      <a
                        href={item.realisasi.bukti_pendukung}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-600 underline hover:text-blue-800"
                      >
                        <FileText className="size-3" />
                        Lihat Bukti
                      </a>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        Belum ada
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
