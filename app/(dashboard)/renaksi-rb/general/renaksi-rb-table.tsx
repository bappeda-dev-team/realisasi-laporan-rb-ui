"use client"

import { useEffect, useState } from "react"
import { Pencil, Search, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ModalFaktorPenunjang } from "./modal-faktor-penunjang"
import { ModalFaktorPenghambat } from "./modal-faktor-penghambat"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type TargetRencanaAksi = {
  target: string
  realisasi: string
  satuan: string
  capaian: string
  tahun: string
}

type IndikatorRencanaAksi = {
  indikator: string
  targets: TargetRencanaAksi[]
}

type PelaksanaCrosscutting = {
  nip_pelaksana: string
  nama_pelaksana: string
}

type OpdCrosscutting = {
  id_pohon: number
  kode_opd: string
  nama_opd: string
  pelaksana_crosscuttings: PelaksanaCrosscutting[]
}

type RencanaAksi = {
  id_rencana_aksi: string
  rencana_aksi: string
  indikator_rencana_aksis: IndikatorRencanaAksi[]
  anggaran: string
  realisasi_anggaran: string
  capaian_anggaran: string
  opd_koordinator: string
  nip_pelaksana: string
  nama_pelaksana: string
  opd_crosscuttings: OpdCrosscutting[] | null
}

type LaporanRb = {
  id: number
  jenis_rb: string
  kegiatan_utama: string
  keterangan: string
  tahun_baseline: number
  tahun_next: number
  rencana_aksis: RencanaAksi[]
}

type ApiResponse = {
  code: number
  status: string
  message?: string
  data: LaporanRb[]
}

type RenakSiRb = {
  id: string
  kegiatanUtama: string
  rencanaAksi: string
  indikator: string
  target: string
  satuan: string
  capaian: string
  subKegiatan: string
  anggaran: string
  faktorPenunjang: string
  faktorPenghambat: string
  opdKoordinator: string
  pelaksana: string
  opdCrosscutting: string
  pelaksanaCross: string
  keterangan: string
}

const emptyCell = "-"

function formatAnggaran(anggaran: string, capaian: string): string {
  if (!anggaran && (capaian === "" || capaian === "0%")) {
    return `0 (0%)`
  }
  return `${anggaran || "0"} (${capaian || "0%"})`
}

function flatten(data: LaporanRb[]): RenakSiRb[] {
  const rows: RenakSiRb[] = []
  for (const rb of data) {
    for (const aksi of rb.rencana_aksis) {
      for (const ind of aksi.indikator_rencana_aksis) {
        const firstTarget = ind.targets[0]
        const crosscuttings = aksi.opd_crosscuttings ?? []
        rows.push({
          id: `${rb.id}-${aksi.id_rencana_aksi}-${ind.indikator}`,
          kegiatanUtama: rb.kegiatan_utama,
          rencanaAksi: aksi.rencana_aksi,
          indikator: ind.indikator || emptyCell,
          target: firstTarget?.target ?? emptyCell,
          satuan: firstTarget?.satuan ?? emptyCell,
          capaian: firstTarget?.capaian ?? emptyCell,
          subKegiatan: rb.kegiatan_utama || emptyCell,
          anggaran: formatAnggaran(aksi.anggaran, aksi.capaian_anggaran),
          faktorPenunjang: emptyCell,
          faktorPenghambat: emptyCell,
          opdKoordinator: aksi.opd_koordinator || emptyCell,
          pelaksana: aksi.nama_pelaksana || emptyCell,
          opdCrosscutting:
            crosscuttings
              .map((o) => o.nama_opd)
              .filter(Boolean)
              .join(", ") || emptyCell,
          pelaksanaCross:
            crosscuttings
              .flatMap((o) => o.pelaksana_crosscuttings)
              .map((p) => p.nama_pelaksana)
              .filter(Boolean)
              .join(", ") || emptyCell,
          keterangan: rb.keterangan || emptyCell,
        })
      }
    }
  }
  return rows
}

export function RenakSiRbTable() {
  const [searchQuery, setSearchQuery] = useState("")
  const [data, setData] = useState<RenakSiRb[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingFaktorId, setEditingFaktorId] = useState<string | null>(null)
  const [faktorValue, setFaktorValue] = useState("")
  const [editingPenghambatId, setEditingPenghambatId] = useState<string | null>(null)
  const [penghambatValue, setPenghambatValue] = useState("")

  useEffect(() => {
    let cancelled = false

    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(
          "/api/perencanaan/datamaster/rb/laporanByTahun/2025/GENERAL"
        )
        if (!res.ok) {
          throw new Error(`Gagal memuat data (status ${res.status})`)
        }
        const json: ApiResponse = await res.json()
        if (!cancelled) {
          setData(flatten(json.data ?? []))
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
  }, [])

  const filteredData = data.filter(
    (d) =>
      d.rencanaAksi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.indikator.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Cari rencana aksi atau indikator..."
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
              <TableHead rowSpan={2}>Rencana Aksi</TableHead>
              <TableHead rowSpan={2}>Indikator</TableHead>
              <TableHead>
                Periode Pelaksanaan
              </TableHead>
              <TableHead rowSpan={2}>Satuan Output</TableHead>
              <TableHead rowSpan={2}>Capaian</TableHead>
              <TableHead rowSpan={2}>Sub Kegiatan</TableHead>
              <TableHead>Biaya</TableHead>
              <TableHead rowSpan={2}>OPD Koordinator</TableHead>
              <TableHead rowSpan={2}>Pelaksana</TableHead>
              <TableHead rowSpan={2}>OPD Crosscutting</TableHead>
              <TableHead rowSpan={2}>Pelaksana Cross</TableHead>
              <TableHead rowSpan={2}>Keterangan</TableHead>
              <TableHead rowSpan={2}>Faktor Penunjang</TableHead>
              <TableHead rowSpan={2}>Faktor Penghambat</TableHead>
              <TableHead rowSpan={2} className="w-28">
                Aksi
              </TableHead>
            </TableRow>
            <TableRow>
              <TableHead>Target</TableHead>
              <TableHead>Anggaran</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={16}
                  className="h-24 text-center text-muted-foreground"
                >
                  Memuat data...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={16}
                  className="h-24 text-center text-destructive"
                >
                  {error}
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={16}
                  className="h-24 text-center text-muted-foreground"
                >
                  Tidak ada data ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="text-left">
                    {item.rencanaAksi}
                  </TableCell>
                  <TableCell className="text-left">
                    {item.indikator}
                  </TableCell>
                  <TableCell>{item.target}</TableCell>
                  <TableCell>{item.satuan}</TableCell>
                  <TableCell>{item.capaian}</TableCell>
                  <TableCell className="text-left">
                    {item.subKegiatan}
                  </TableCell>
                  <TableCell>{item.anggaran}</TableCell>
                  <TableCell className="text-left">
                    {item.opdKoordinator}
                  </TableCell>
                  <TableCell className="text-left">
                    {item.pelaksana}
                  </TableCell>
                  <TableCell className="text-left">
                    {item.opdCrosscutting}
                  </TableCell>
                  <TableCell className="text-left">
                    {item.pelaksanaCross}
                  </TableCell>
                  <TableCell className="text-left">
                    {item.keterangan}
                  </TableCell>
                  <TableCell className="text-left">
                    <div className="flex flex-col items-center gap-1">
                      <span>{item.faktorPenunjang}</span>
                      <span
                        className="inline-flex items-center justify-center size-5 rounded-full border border-muted-foreground cursor-pointer hover:bg-muted"
                        onClick={() => { setEditingFaktorId(item.id); setFaktorValue(item.faktorPenunjang); }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === "Enter") { setEditingFaktorId(item.id); setFaktorValue(item.faktorPenunjang); } }}
                      >
                        <Pencil className="size-3 text-muted-foreground" />
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-left">
                    <div className="flex flex-col items-center gap-1">
                      <span>{item.faktorPenghambat}</span>
                      <span
                        className="inline-flex items-center justify-center size-5 rounded-full border border-muted-foreground cursor-pointer hover:bg-muted"
                        onClick={() => { setEditingPenghambatId(item.id); setPenghambatValue(item.faktorPenghambat); }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === "Enter") { setEditingPenghambatId(item.id); setPenghambatValue(item.faktorPenghambat); } }}
                      >
                        <Pencil className="size-3 text-muted-foreground" />
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center">
                      <Button variant="outline" size="sm" type="button">
                        <Upload className="size-3.5 mr-1" />
                        Upload
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ModalFaktorPenunjang
        open={editingFaktorId !== null}
        onOpenChange={(open) => { if (!open) setEditingFaktorId(null); }}
        title="Faktor Penunjang"
        kegiatanUtama={editingFaktorId !== null ? data.find((d) => d.id === editingFaktorId)?.kegiatanUtama ?? "" : ""}
        indikator={editingFaktorId !== null ? data.find((d) => d.id === editingFaktorId)?.indikator ?? "" : ""}
        fieldValue={faktorValue}
        onFieldChange={setFaktorValue}
        onSave={() => {
          if (editingFaktorId !== null) {
            setData((prev) =>
              prev.map((item) =>
                item.id === editingFaktorId
                  ? { ...item, faktorPenunjang: faktorValue }
                  : item
              )
            )
            setEditingFaktorId(null)
          }
        }}
      />

      <ModalFaktorPenghambat
        open={editingPenghambatId !== null}
        onOpenChange={(open) => { if (!open) setEditingPenghambatId(null); }}
        kegiatanUtama={editingPenghambatId !== null ? data.find((d) => d.id === editingPenghambatId)?.kegiatanUtama ?? "" : ""}
        indikator={editingPenghambatId !== null ? data.find((d) => d.id === editingPenghambatId)?.indikator ?? "" : ""}
        fieldValue={penghambatValue}
        onFieldChange={setPenghambatValue}
        onSave={() => {
          if (editingPenghambatId !== null) {
            setData((prev) =>
              prev.map((item) =>
                item.id === editingPenghambatId
                  ? { ...item, faktorPenghambat: penghambatValue }
                  : item
              )
            )
            setEditingPenghambatId(null)
          }
        }}
      />
    </div>
  )
}