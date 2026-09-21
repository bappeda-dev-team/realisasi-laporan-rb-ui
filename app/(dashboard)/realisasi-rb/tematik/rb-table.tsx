"use client"

import { useEffect, useState } from "react"
import { FileText, Lock, Pencil, RefreshCw, Search, Upload } from "lucide-react"
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

type ApiRealisasi = {
  id: number
  kode_opd: string
  nip: string
  tahun: string
  bulan: string
  id_rb_tematik: string
  id_indikator_rb_tematik: string
  id_target_rb_tematik: string
  realisasi: number
  jenis_realisasi: string
  faktor_penunjang: string
  faktor_penghambat: string
  bukti_pendukung: string
  keterangan_bukti_pendukung: string
  target: number | null
  capaian: number | null
}

type RealisasiRb = {
  id: string
  idRb: number
  idTarget: string
  kegiatanUtama: string
  indikator: string
  baseline: {
    target: string
    satuan: string
  }
  berjalan: {
    target: string
    realisasi: string
    satuan: string
    capaian: string
  }
  keterangan: string
  faktorPenunjang: string
  faktorPenghambat: string
  buktiPendukung: string
  keteranganBuktiPendukung: string
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
        idRb: ind.id_rb,
        idTarget: next?.id ?? baseline?.id ?? "",
        kegiatanUtama: item.kegiatan_utama,
        indikator: ind.indikator,
        baseline: {
          target: baseline?.target_baseline ?? "",
          satuan: baseline?.satuan_baseline ?? "",
        },
        berjalan: {
          target: next?.target_next ?? "",
          realisasi: "",
          satuan: next?.satuan_next ?? "",
          capaian: "",
        },
        keterangan: item.keterangan ?? "",
        faktorPenunjang: "",
        faktorPenghambat: "",
        buktiPendukung: "",
        keteranganBuktiPendukung: "",
      })
    })
  })

  return rows
}

function mergeRealisasi(
  rows: RealisasiRb[],
  realisasiList: ApiRealisasi[]
): RealisasiRb[] {
  const map = new Map<string, ApiRealisasi>()
  realisasiList.forEach((r) => {
    const key = r.id_indikator_rb_tematik
    const existing = map.get(key)
    if (!existing || r.id > existing.id) {
      map.set(key, r)
    }
  })

  return rows.map((row) => {
    const r = map.get(row.id)
    if (!r) return row
    return {
      ...row,
      berjalan: {
        ...row.berjalan,
        realisasi: r.realisasi !== undefined ? String(r.realisasi) : "",
        capaian:
          r.capaian !== null && r.capaian !== undefined
            ? String(r.capaian)
            : "",
      },
      faktorPenunjang: r.faktor_penunjang ?? "",
      faktorPenghambat: r.faktor_penghambat ?? "",
      buktiPendukung: r.bukti_pendukung ?? "",
      keteranganBuktiPendukung: r.keterangan_bukti_pendukung ?? "",
    }
  })
}

export function RbTable() {
  const [searchQuery, setSearchQuery] = useState("")
  const [dialogAction, setDialogAction] = useState<
    "sinkronisasi" | "kunci" | null
  >(null)
  const [data, setData] = useState<RealisasiRb[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userInfo, setUserInfo] = useState<{
    kodeOpd: string
    nip: string
  } | null>(null)

  // State edit realisasi
  const [editingId, setEditingId] = useState<string | null>(null)
  const [kegiatanUtamaValue, setKegiatanUtamaValue] = useState("")
  const [indikatorValue, setIndikatorValue] = useState("")
  const [realisasiValue, setRealisasiValue] = useState("")
  const [buktiPendukungValue, setBuktiPendukungValue] = useState("")

  const editingRow = editingId
    ? data.find((d) => d.id === editingId) ?? null
    : null

  // State edit faktor penunjang
  const [editingFaktorId, setEditingFaktorId] = useState<string | null>(null)
  const [faktorValue, setFaktorValue] = useState("")

  // State edit faktor penghambat
  const [editingPenghambatId, setEditingPenghambatId] = useState<string | null>(
    null
  )
  const [penghambatValue, setPenghambatValue] = useState("")

  const { tahun } = useFilter()
  const baselineTahun = Number(tahun) - 1

  // fetch user info
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

  // fetch master + realisasi
  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        // 1. master tematik
        const masterRes = await fetch(
          `/api/perencanaan/datamaster/rb/laporanByTahun/${tahun}/TEMATIK`,
          { cache: "no-store" }
        )
        if (!masterRes.ok) throw new Error(`HTTP ${masterRes.status}`)
        const masterJson = await masterRes.json()

        let rows = mapApiToRows(
          masterJson.data ?? [],
          baselineTahun,
          Number(tahun)
        )

        // 2. realisasi tematik
        if (userInfo?.nip && userInfo?.kodeOpd) {
          try {
            const realisasiRes = await fetch(
              `/api/realisasi/laporanrbtematik/nip/${userInfo.nip}/kodeOpd/${userInfo.kodeOpd}/tahun/${tahun}/perencanaan`,
              { cache: "no-store" }
            )
            if (realisasiRes.ok) {
              const realisasiJson = await realisasiRes.json()
              const list: ApiRealisasi[] = Array.isArray(realisasiJson)
                ? realisasiJson
                : realisasiJson.data ?? []
              rows = mergeRealisasi(rows, list)
            }
          } catch {
            // diamkan saja
          }
        }

        if (!cancelled) setData(rows)
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
  }, [tahun, baselineTahun, userInfo?.nip, userInfo?.kodeOpd])

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
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={() => setDialogAction("sinkronisasi")}
          >
            <RefreshCw className="size-3.5 mr-1" />
            Sinkronisasi
          </Button>
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={() => setDialogAction("kunci")}
          >
            <Lock className="size-3.5 mr-1" />
            Kunci
          </Button>
        </div>
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
              <TableHead colSpan={2}>BaseLine {baselineTahun}</TableHead>
              <TableHead colSpan={4}>{tahun}</TableHead>
              <TableHead rowSpan={2}>Keterangan</TableHead>
              <TableHead rowSpan={2}>Faktor Penunjang</TableHead>
              <TableHead rowSpan={2}>Faktor Penghambat</TableHead>
              <TableHead rowSpan={2}>Bukti Pendukung</TableHead>
              <TableHead rowSpan={2} className="w-24">
                Aksi
              </TableHead>
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
                  colSpan={14}
                  className="h-24 text-center text-muted-foreground"
                >
                  Memuat data...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={14}
                  className="h-24 text-center text-destructive"
                >
                  {error}
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={14}
                  className="h-24 text-center text-muted-foreground"
                >
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

                  {/* Baseline */}
                  <TableCell>{item.baseline.target}</TableCell>
                  <TableCell>{item.baseline.satuan}</TableCell>

                  {/* Tahun berjalan */}
                  <TableCell>{item.berjalan.target}</TableCell>
                  <TableCell>
                    <div className="flex flex-col items-center gap-1">
                      {item.berjalan.realisasi}
                      <span
                        className="inline-flex items-center justify-center size-5 rounded-full border border-muted-foreground cursor-pointer hover:bg-muted"
                        onClick={() => {
                          setEditingId(item.id)
                          setKegiatanUtamaValue(item.kegiatanUtama)
                          setIndikatorValue(item.indikator)
                          setRealisasiValue(item.berjalan.realisasi)
                          setBuktiPendukungValue(item.buktiPendukung)
                        }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            setEditingId(item.id)
                            setKegiatanUtamaValue(item.kegiatanUtama)
                            setIndikatorValue(item.indikator)
                            setRealisasiValue(item.berjalan.realisasi)
                            setBuktiPendukungValue(item.buktiPendukung)
                          }
                        }}
                      >
                        <Pencil className="size-3 text-muted-foreground" />
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{item.berjalan.satuan}</TableCell>
                  <TableCell>{item.berjalan.capaian}</TableCell>

                  {/* Info */}
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

                  {/* Bukti Pendukung */}
                  <TableCell className="text-left">
                    {item.buktiPendukung ? (
                      <a
                        href={item.buktiPendukung}
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

                  <TableCell>
                    <div className="flex items-center justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        type="button"
                        onClick={() => {
                          setEditingId(item.id)
                          setKegiatanUtamaValue(item.kegiatanUtama)
                          setIndikatorValue(item.indikator)
                          setRealisasiValue(item.berjalan.realisasi)
                          setBuktiPendukungValue(item.buktiPendukung)
                        }}
                      >
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

      {/* Dialog Sinkronisasi / Kunci */}
      <Dialog
        open={dialogAction !== null}
        onOpenChange={(open) => !open && setDialogAction(null)}
      >
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>
              {dialogAction === "sinkronisasi"
                ? "Konfirmasi Sinkronisasi"
                : "Konfirmasi Penguncian"}
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
            <Button onClick={() => setDialogAction(null)}>Ya</Button>
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
        initialBuktiPendukung={buktiPendukungValue}
        onSave={(updated) => {
          if (editingId !== null) {
            setData((prev) =>
              prev.map((item) =>
                item.id === editingId
                  ? {
                      ...item,
                      berjalan: {
                        ...item.berjalan,
                        realisasi:
                          updated?.realisasi !== undefined
                            ? String(updated.realisasi)
                            : realisasiValue,
                        capaian:
                          updated?.capaian !== undefined
                            ? String(updated.capaian)
                            : item.berjalan.capaian,
                      },
                      buktiPendukung:
                        updated?.bukti_pendukung ?? item.buktiPendukung,
                      keteranganBuktiPendukung:
                        updated?.keterangan_bukti_pendukung ??
                        item.keteranganBuktiPendukung,
                    }
                  : item
              )
            )
            setEditingId(null)
          }
        }}
        idRbTematik={editingRow ? String(editingRow.idRb) : ""}
        idIndikatorRbTematik={editingRow?.id ?? ""}
        idTargetRbTematik={editingRow?.idTarget ?? ""}
        kodeOpd={userInfo?.kodeOpd ?? ""}
        nip={userInfo?.nip ?? ""}
      />

      <ModalFaktorPenunjang
        open={editingFaktorId !== null}
        onOpenChange={(open) => {
          if (!open) setEditingFaktorId(null)
        }}
        title="Faktor Penunjang"
        kegiatanUtama={
          editingFaktorId !== null
            ? data.find((d) => d.id === editingFaktorId)?.kegiatanUtama ?? ""
            : ""
        }
        indikator={
          editingFaktorId !== null
            ? data.find((d) => d.id === editingFaktorId)?.indikator ?? ""
            : ""
        }
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
        onOpenChange={(open) => {
          if (!open) setEditingPenghambatId(null)
        }}
        kegiatanUtama={
          editingPenghambatId !== null
            ? data.find((d) => d.id === editingPenghambatId)?.kegiatanUtama ??
              ""
            : ""
        }
        indikator={
          editingPenghambatId !== null
            ? data.find((d) => d.id === editingPenghambatId)?.indikator ?? ""
            : ""
        }
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