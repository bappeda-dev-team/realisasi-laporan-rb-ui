"use client"

import { useState } from "react"
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

type RealisasiRb = {
  id: number
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

const initialData: RealisasiRb[] = [
  {
    id: 1,
    kegiatanUtama: "Penyusunan Dokumen Reformasi Birokrasi",
    indikator: "Terbitnya dokumen RB tingkat kabupaten",
    baseline: {
      target: "1",
      realisasi: "1",
      satuan: "Dokumen",
      capaian: "100%",
    },
    berjalan: {
      target: "1",
      satuan: "Dokumen",
    },
    keterangan: "Dokumen RB tingkat kabupaten",
    faktorPenunjang: "Komitmen pimpinan yang tinggi",
    faktorPenghambat: "Terbatasnya SDM",
  },
  {
    id: 2,
    kegiatanUtama: "Sosialisasi Reformasi Birokrasi",
    indikator: "Jumlah kegiatan sosialisasi yang dilaksanakan",
    baseline: {
      target: "12",
      realisasi: "10",
      satuan: "Kegiatan",
      capaian: "83%",
    },
    berjalan: {
      target: "12",
      satuan: "Kegiatan",
    },
    keterangan: "Sosialisasi kepada seluruh OPD",
    faktorPenunjang: "Dukungan anggaran yang memadai",
    faktorPenghambat: "Rendahnya partisipasi OPD",
  },
  {
    id: 3,
    kegiatanUtama: "Penguatan Organisasi dan Tata Laksana",
    indikator: "Terbitnya SK Tim Reformasi Birokrasi",
    baseline: {
      target: "1",
      realisasi: "1",
      satuan: "Dokumen",
      capaian: "100%",
    },
    berjalan: {
      target: "1",
      satuan: "Dokumen",
    },
    keterangan: "Penataan organisasi dan tata laksana",
    faktorPenunjang: "Peraturan yang sudah jelas",
    faktorPenghambat: "Birokrasi yang berbelit",
  },
  {
    id: 4,
    kegiatanUtama: "Pengembangan Sistem Kerja Digital",
    indikator: "OPD yang menerapkan e-Office",
    baseline: {
      target: "25",
      realisasi: "18",
      satuan: "OPD",
      capaian: "72%",
    },
    berjalan: {
      target: "30",
      satuan: "OPD",
    },
    keterangan: "Penerapan e-Office di seluruh OPD",
    faktorPenunjang: "Infrastruktur yang memadai",
    faktorPenghambat: "Keterbatasan kompetensi SDM",
  },
  {
    id: 5,
    kegiatanUtama: "Penguatan Akuntabilitas Kinerja",
    indikator: "Tercapainya nilai SAKIP",
    baseline: {
      target: "80",
      realisasi: "62",
      satuan: "Persen",
      capaian: "77%",
    },
    berjalan: {
      target: "85",
      satuan: "Persen",
    },
    keterangan: "Peningkatan nilai SAKIP kabupaten",
    faktorPenunjang: "Sistem monitoring yang baik",
    faktorPenghambat: "Data yang tidak konsisten",
  },
]

export function RbTable() {
  const [searchQuery, setSearchQuery] = useState("")
  const [dialogAction, setDialogAction] = useState<"sinkronisasi" | "kunci" | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [kegiatanUtamaValue, setKegiatanUtamaValue] = useState("")
  const [indikatorValue, setIndikatorValue] = useState("")
  const [realisasiValue, setRealisasiValue] = useState("")
  const [data, setData] = useState(initialData)
  const [editingFaktorId, setEditingFaktorId] = useState<number | null>(null)
  const [faktorValue, setFaktorValue] = useState("")
  const [editingPenghambatId, setEditingPenghambatId] = useState<number | null>(null)
  const [penghambatValue, setPenghambatValue] = useState("")
  const { tahun } = useFilter()
  const baselineTahun = Number(tahun) - 1

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
            {filteredData.length === 0 ? (
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
                  <TableCell className="text-left">
                    {item.kegiatanUtama}
                  </TableCell>
                  <TableCell className="text-left">{item.indikator}</TableCell>
                  <TableCell>{item.baseline.target}</TableCell>
                  <TableCell>
                    <div className="flex flex-col items-center gap-1">
                      {item.baseline.realisasi}
                      <span
                        className="inline-flex items-center justify-center size-5 rounded-full border border-muted-foreground cursor-pointer hover:bg-muted"
                        onClick={() => { setEditingId(item.id); setKegiatanUtamaValue(item.kegiatanUtama); setIndikatorValue(item.indikator); setRealisasiValue(item.baseline.realisasi); }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === "Enter") { setEditingId(item.id); setKegiatanUtamaValue(item.kegiatanUtama); setIndikatorValue(item.indikator); setRealisasiValue(item.baseline.realisasi); } }}
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