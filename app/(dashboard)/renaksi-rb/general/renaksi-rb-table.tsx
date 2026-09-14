"use client"

import { useState } from "react"
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

type RenakSiRb = {
  id: number
  kegiatanUtama: string
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

const initialData: RenakSiRb[] = [
  {
    id: 1,
    kegiatanUtama: "Penyusunan Dokumen Reformasi Birokrasi",
    indikator: "Terbitnya dokumen RB tingkat kabupaten",
    target: "1",
    satuan: "Dokumen",
    capaian: "100%",
    subKegiatan: "-",
    anggaran: "Rp 50.000.000",
    faktorPenunjang: "Komitmen pimpinan yang tinggi",
    faktorPenghambat: "Terbatasnya SDM",
    opdKoordinator: "Bagian Organisasi",
    pelaksana: "Inspektorat",
    opdCrosscutting: "Dinas Kominfo",
    pelaksanaCross: "Bagian Organisasi",
    keterangan: "-",
  },
  {
    id: 2,
    kegiatanUtama: "Sosialisasi Reformasi Birokrasi",
    indikator: "Jumlah kegiatan sosialisasi yang dilaksanakan",
    target: "12",
    satuan: "Kegiatan",
    capaian: "83%",
    subKegiatan: "-",
    anggaran: "Rp 100.000.000",
    faktorPenunjang: "Dukungan anggaran yang memadai",
    faktorPenghambat: "Rendahnya partisipasi OPD",
    opdKoordinator: "Bagian Organisasi",
    pelaksana: "Seluruh OPD",
    opdCrosscutting: "Inspektorat",
    pelaksanaCross: "Bagian Organisasi",
    keterangan: "-",
  },
  {
    id: 3,
    kegiatanUtama: "Penguatan Organisasi dan Tata Laksana",
    indikator: "Terbitnya SK Tim Reformasi Birokrasi",
    target: "1",
    satuan: "Dokumen",
    capaian: "100%",
    subKegiatan: "-",
    anggaran: "Rp 75.000.000",
    faktorPenunjang: "Peraturan yang sudah jelas",
    faktorPenghambat: "Birokrasi yang berbelit",
    opdKoordinator: "Bagian Organisasi",
    pelaksana: "BKPSDM",
    opdCrosscutting: "BKPSDM",
    pelaksanaCross: "Inspektorat",
    keterangan: "-",
  },
  {
    id: 4,
    kegiatanUtama: "Pengembangan Sistem Kerja Digital",
    indikator: "OPD yang menerapkan e-Office",
    target: "25",
    satuan: "OPD",
    capaian: "72%",
    subKegiatan: "-",
    anggaran: "Rp 150.000.000",
    faktorPenunjang: "Infrastruktur yang memadai",
    faktorPenghambat: "Keterbatasan kompetensi SDM",
    opdKoordinator: "Dinas Kominfo",
    pelaksana: "Seluruh OPD",
    opdCrosscutting: "Bagian Organisasi",
    pelaksanaCross: "Dinas Kominfo",
    keterangan: "-",
  },
  {
    id: 5,
    kegiatanUtama: "Penguatan Akuntabilitas Kinerja",
    indikator: "Tercapainya nilai SAKIP",
    target: "80",
    satuan: "Persen",
    capaian: "77%",
    subKegiatan: "-",
    anggaran: "Rp 120.000.000",
    faktorPenunjang: "Sistem monitoring yang baik",
    faktorPenghambat: "Data yang tidak konsisten",
    opdKoordinator: "Inspektorat",
    pelaksana: "Seluruh OPD",
    opdCrosscutting: "-",
    pelaksanaCross: "-",
    keterangan: "Perlu evaluasi berkala",
  },
]

export function RenakSiRbTable() {
  const [searchQuery, setSearchQuery] = useState("")
  const [data, setData] = useState(initialData)
  const [editingFaktorId, setEditingFaktorId] = useState<number | null>(null)
  const [faktorValue, setFaktorValue] = useState("")
  const [editingPenghambatId, setEditingPenghambatId] = useState<number | null>(null)
  const [penghambatValue, setPenghambatValue] = useState("")

  const filteredData = data.filter(
    (d) =>
      d.kegiatanUtama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.indikator.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
            {filteredData.length === 0 ? (
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
                    {item.kegiatanUtama}
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