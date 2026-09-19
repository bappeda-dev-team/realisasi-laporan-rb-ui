"use client"

import { useEffect, useState } from "react"
import { Lock, Pencil, RefreshCw, Search, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useFilter } from "@/components/filter-context"
import { ModalRbTematik } from "./modal-rb-tematik"
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

type ApiTarget = {
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

type ApiIndikator = {
  id: string
  id_rb: number
  indikator: string
  target: ApiTarget[]
}

type ApiRb = {
  id: number
  jenis_rb: string
  kegiatan_utama: string
  keterangan: string
  tahun_baseline: number
  tahun_next: number
  indikator: ApiIndikator[]
  rencana_aksis: unknown[]
}

type RealisasiRb = {
  id: string
  kegiatanUtama: string
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
  keterangan: string
  faktorPenunjang: string
  faktorPenghambat: string
}

function mapApiToRows(
  items: ApiRb[],
  baselineTahun: number,
  tahunNext: number
): RealisasiRb[] {
  const rows: RealisasiRb[] = []

  items.forEach((item) => {
    item.indikator.forEach((ind) => {
      const baseline = ind.target.find(
        (t) => t.tahun_baseline === baselineTahun
      )
      const next = ind.target.find((t) => t.tahun_next === tahunNext)

      rows.push({
        id: ind.id,
        kegiatanUtama: item.kegiatan_utama,
        indikator: ind.indikator,
        baseline: {
          target: baseline?.target_baseline ?? "",
          realisasi: baseline?.realisasi_baseline ?? "",
          satuan: baseline?.satuan_baseline ?? "",
          capaian: "",
        },
        berjalan: {
          target: next?.target_next ?? "",
          satuan: next?.satuan_next ?? "",
        },
        keterangan: item.keterangan ?? "",
        faktorPenunjang: "",
        faktorPenghambat: "",
      })
    })
  })

  return rows
}

export function RbTable() {
  const [searchQuery, setSearchQuery] = useState("")
  const [dialogAction, setDialogAction] = useState<"sinkronisasi" | "kunci" | null>(null)
  const [data, setData] = useState<RealisasiRb[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // State edit realisasi baseline
  const [editingId, setEditingId] = useState<string | null>(null)
  const [kegiatanUtamaValue, setKegiatanUtamaValue] = useState("")
  const [indikatorValue, setIndikatorValue] = useState("")
  const [realisasiValue, setRealisasiValue] = useState("")

  // State edit faktor penunjang
  const [editingFaktorId, setEditingFaktorId] = useState<string | null>(null)
  const [faktorValue, setFaktorValue] = useState("")

  // State edit faktor penghambat
  const [editingPenghambatId, setEditingPenghambatId] = useState<string | null>(null)
  const [penghambatValue, setPenghambatValue] = useState("")

  const { tahun } = useFilter()
  const baselineTahun = Number(tahun) - 1

  // fetch data
  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(
          `/api/perencanaan/datamaster/rb/laporanByTahun/${tahun}/TEMATIK`,
          { cache: "no-store" }
        )
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()

        if (!cancelled) {
          const rows = mapApiToRows(
            json.data ?? [],
            baselineTahun,
            Number(tahun)
          )
          setData(rows)
        }
      } catch (e) {
        if (!cancelled) {
          setError(
            e instanceof Error ? e.message : "Gagal memuat data RB Tematik"
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
  }, [tahun, baselineTahun])

  const filteredData = data.filter(
    (d) =>
      d.kegiatanUtama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.indikator.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Cari kegiatan atau indikator..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" type="button" onClick={() => setDialogAction("sinkronisasi")}>
            <RefreshCw className="size-3.5 mr-1" />
            Sinkronisasi
          </Button>
          <Button variant="outline" size="sm" type="button" onClick={() => setDialogAction("kunci")}>
            <Lock className="size-3.5 mr-1" />
            Kunci
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table className="[&_th]:border-r [&_td]:border-r [&_th:last-child]:border-r-0 [&_td:last-child]:border-r-0 [&_th]:text-center [&_td]:text-center">
          <TableHeader>
            <TableRow>
              <TableHead rowSpan={2} className="w-12">
                No
              </TableHead>
              <TableHead rowSpan={2}>Kegiatan Utama</TableHead>
              <TableHead rowSpan={2}>Indikator</TableHead>
              <TableHead colSpan={4}>BaseLine {baselineTahun}</TableHead>
              <TableHead colSpan={2}>{tahun}</TableHead>
              <TableHead rowSpan={2}>Keterangan</TableHead>
              <TableHead rowSpan={2}>Faktor Penunjang</TableHead>
              <TableHead rowSpan={2}>Faktor Penghambat</TableHead>
              <TableHead rowSpan={2} className="w-28">
                Aksi
              </TableHead>
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
                <TableCell colSpan={14} className="h-24 text-center text-muted-foreground">
                  Memuat data...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={14} className="h-24 text-center text-destructive">
                  {error}
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={14} className="h-24 text-center text-muted-foreground">
                  Tidak ada data ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="text-left!">
                    {item.kegiatanUtama}
                  </TableCell>
                  <TableCell className="text-left!">{item.indikator}</TableCell>
                  <TableCell className="text-center">{item.baseline.target}</TableCell>
                  <TableCell>
                    <div className="flex flex-col items-center gap-1 text-center">
                      {item.baseline.realisasi}
                      <span
                        className="inline-flex items-center justify-center size-5 rounded-full border border-muted-foreground cursor-pointer hover:bg-muted"
                        onClick={() => {
                          setEditingId(item.id)
                          setKegiatanUtamaValue(item.kegiatanUtama)
                          setIndikatorValue(item.indikator)
                          setRealisasiValue(item.baseline.realisasi)
                        }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            setEditingId(item.id)
                            setKegiatanUtamaValue(item.kegiatanUtama)
                            setIndikatorValue(item.indikator)
                            setRealisasiValue(item.baseline.realisasi)
                          }
                        }}
                      >
                        <Pencil className="size-3 text-muted-foreground" />
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{item.baseline.satuan}</TableCell>
                  <TableCell>{item.baseline.capaian}</TableCell>
                  <TableCell>{item.berjalan.target}</TableCell>
                  <TableCell>{item.berjalan.satuan}</TableCell>
                  <TableCell className="text-left">{item.keterangan}</TableCell>
                  <TableCell className="text-left">
                    <div className="flex flex-col items-center gap-1">
                      <span>{item.faktorPenunjang}</span>
                      <span
                        className="inline-flex items-center justify-center size-5 rounded-full border border-muted-foreground cursor-pointer hover:bg-muted"
                        onClick={() => {
                          setEditingFaktorId(item.id)
                          setFaktorValue(item.faktorPenunjang)
                        }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            setEditingFaktorId(item.id)
                            setFaktorValue(item.faktorPenunjang)
                          }
                        }}
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
                        onClick={() => {
                          setEditingPenghambatId(item.id)
                          setPenghambatValue(item.faktorPenghambat)
                        }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            setEditingPenghambatId(item.id)
                            setPenghambatValue(item.faktorPenghambat)
                          }
                        }}
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

      <Dialog open={dialogAction !== null} onOpenChange={(open) => !open && setDialogAction(null)}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>
              {dialogAction === "sinkronisasi" ? "Konfirmasi Sinkronisasi" : "Konfirmasi Penguncian"}
            </DialogTitle>
            <DialogDescription>
              {dialogAction === "sinkronisasi"
                ? "Apakah Anda ingin melanjutkan proses sinkronisasi data?"
                : "Apakah Anda ingin melanjutkan proses penguncian data?"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogAction(null)}>
              Tidak
            </Button>
            <Button onClick={() => setDialogAction(null)}>
              Ya
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ModalRbTematik
        open={editingId !== null}
        onOpenChange={(open) => !open && setEditingId(null)}
        kegiatanUtama={kegiatanUtamaValue}
        indikator={indikatorValue}
        realisasiValue={realisasiValue}
        onRealisasiChange={setRealisasiValue}
        onSave={() => {
          if (editingId !== null) {
            setData((prev) =>
              prev.map((item) =>
                item.id === editingId
                  ? { ...item, baseline: { ...item.baseline, realisasi: realisasiValue } }
                  : item
              )
            )
            setEditingId(null)
          }
        }}
      />

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