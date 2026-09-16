"use client"

import { useEffect, useState } from "react"
import { Search } from "lucide-react"
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

type TargetRb = {
  id: string
  id_indikator: string
  tahun_baseline: number
  target_baseline: string
  realisasi_baseline: string
  satuan_baseline: string
  tahun_next: number
  target_next: string
  satuan_next: string
}

type IndikatorRb = {
  id: string
  id_rb: number
  indikator: string
  target: TargetRb[]
}

type ReformasiBirokrasi = {
  id: number
  jenis_rb: string
  kegiatan_utama: string
  keterangan: string
  indikator: IndikatorRb[]
  tahun_baseline: number
  tahun_next: number
  sudah_diambil: boolean
}

type ApiResponse = {
  code: number
  status: string
  message?: string
  data: ReformasiBirokrasi[]
}

type Row = {
  key: string
  jenisRb: string
  kegiatanUtama: string
  keterangan: string
  indikator: string
  baseline: {
    target: string
    realisasi: string
    satuan: string
    capaian: string
  }
  berjalan: {
    target: string
    satuan: string
  }
}

function formatCapaian(target: string, realisasi: string): string {
  const t = Number(target)
  const r = Number(realisasi)
  if (!Number.isFinite(t) || !Number.isFinite(r) || t <= 0) {
    return "-"
  }
  return `${((r / t) * 100).toFixed(2).replace(/\.?0+$/, "")}%`
}

function flatten(data: ReformasiBirokrasi[]): Row[] {
  const rows: Row[] = []
  for (const rb of data) {
    for (const ind of rb.indikator) {
      const baselineTarget =
        ind.target.find((t) => t.tahun_baseline !== 0) ?? ind.target[0]
      const baseline = baselineTarget
        ? {
            target: baselineTarget.target_baseline,
            realisasi: baselineTarget.realisasi_baseline,
            satuan: baselineTarget.satuan_baseline,
            capaian: formatCapaian(
              baselineTarget.target_baseline,
              baselineTarget.realisasi_baseline
            ),
          }
        : { target: "", realisasi: "", satuan: "", capaian: "" }

      const berjalanTarget =
        ind.target.find((t) => t.tahun_next !== 0) ?? ind.target[0]
      const berjalan = berjalanTarget
        ? {
            target: berjalanTarget.target_next,
            satuan: berjalanTarget.satuan_next,
          }
        : { target: "", satuan: "" }

      rows.push({
        key: `${rb.id}-${ind.id}`,
        jenisRb: rb.jenis_rb,
        kegiatanUtama: rb.kegiatan_utama,
        keterangan: rb.keterangan,
        indikator: ind.indikator,
        baseline,
        berjalan,
      })
    }
  }
  return rows
}

export function RbTable() {
  const [data, setData] = useState<ReformasiBirokrasi[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const { tahun } = useFilter()
  const baselineTahun = Number(tahun) - 1

  useEffect(() => {
    let cancelled = false

    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(
          `/api/perencanaan/datamaster/rb?tahun_next=${tahun}`
        )
        if (!res.ok) {
          throw new Error(`Gagal memuat data (status ${res.status})`)
        }
        const json: ApiResponse = await res.json()
        if (!cancelled) {
          setData(json.data ?? [])
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Terjadi kesalahan saat memuat data."
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchData()
    return () => {
      cancelled = true
    }
  }, [tahun])

  const rows = flatten(data)
  const filteredData = rows.filter(
    (d) =>
      d.jenisRb.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.kegiatanUtama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.indikator.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Cari jenis RB, kegiatan, atau indikator..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
      </div>

      <div className="rounded-md border">
        <Table className="[&_th]:border-r [&_td]:border-r [&_th:last-child]:border-r-0 [&_td:last-child]:border-r-0 [&_th]:text-center [&_td]:text-center">
          <TableHeader>
            <TableRow>
              <TableHead rowSpan={2} className="w-12">
                No
              </TableHead>
              <TableHead rowSpan={2}>Jenis RB</TableHead>
              <TableHead rowSpan={2}>Kegiatan Utama</TableHead>
              <TableHead rowSpan={2}>Keterangan</TableHead>
              <TableHead rowSpan={2}>Indikator</TableHead>
              <TableHead colSpan={4}>BaseLine {baselineTahun}</TableHead>
              <TableHead colSpan={2}>{tahun}</TableHead>
            </TableRow>
            <TableRow>
              <TableHead>Target</TableHead>
              <TableHead>Realisasi</TableHead>
              <TableHead>Satuan</TableHead>
              <TableHead>Capaian</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Satuan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={11}
                  className="h-24 text-center text-muted-foreground"
                >
                  Memuat data...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={11}
                  className="h-24 text-center text-destructive"
                >
                  {error}
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={11}
                  className="h-24 text-center text-muted-foreground"
                >
                  Tidak ada data ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item, index) => (
                <TableRow key={item.key}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="text-left">{item.jenisRb}</TableCell>
                  <TableCell className="text-left">
                    {item.kegiatanUtama}
                  </TableCell>
                  <TableCell className="text-left">{item.keterangan}</TableCell>
                  <TableCell className="text-left">{item.indikator}</TableCell>
                  <TableCell>{item.baseline.target}</TableCell>
                  <TableCell>{item.baseline.realisasi}</TableCell>
                  <TableCell>{item.baseline.satuan}</TableCell>
                  <TableCell>{item.baseline.capaian}</TableCell>
                  <TableCell>{item.berjalan.target}</TableCell>
                  <TableCell>{item.berjalan.satuan}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}