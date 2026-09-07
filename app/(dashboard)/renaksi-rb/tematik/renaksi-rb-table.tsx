"use client"

import { useState } from "react"
import { Search, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  realisasi: string
  satuan: string
  capaian: string
  anggaran: string
  realisasiAnggaran: string
  capaianAnggaran: string
  faktorPenunjang: string
  faktorPenghambat: string
  opdKoordinator: string
  pelaksana: string
}

const initialData: RenakSiRb[] = [
  {
    id: 1,
    kegiatanUtama: "Penyusunan Dokumen Reformasi Birokrasi",
    indikator: "Terbitnya dokumen RB tingkat kabupaten",
    target: "1",
    realisasi: "1",
    satuan: "Dokumen",
    capaian: "100%",
    anggaran: "Rp 50.000.000",
    realisasiAnggaran: "Rp 50.000.000",
    capaianAnggaran: "100%",
    faktorPenunjang: "Komitmen pimpinan yang tinggi",
    faktorPenghambat: "Terbatasnya SDM",
    opdKoordinator: "Bagian Organisasi",
    pelaksana: "Inspektorat",
  },
  {
    id: 2,
    kegiatanUtama: "Sosialisasi Reformasi Birokrasi",
    indikator: "Jumlah kegiatan sosialisasi yang dilaksanakan",
    target: "12",
    realisasi: "10",
    satuan: "Kegiatan",
    capaian: "83%",
    anggaran: "Rp 100.000.000",
    realisasiAnggaran: "Rp 80.000.000",
    capaianAnggaran: "80%",
    faktorPenunjang: "Dukungan anggaran yang memadai",
    faktorPenghambat: "Rendahnya partisipasi OPD",
    opdKoordinator: "Bagian Organisasi",
    pelaksana: "Seluruh OPD",
  },
  {
    id: 3,
    kegiatanUtama: "Penguatan Organisasi dan Tata Laksana",
    indikator: "Terbitnya SK Tim Reformasi Birokrasi",
    target: "1",
    realisasi: "1",
    satuan: "Dokumen",
    capaian: "100%",
    anggaran: "Rp 75.000.000",
    realisasiAnggaran: "Rp 65.000.000",
    capaianAnggaran: "87%",
    faktorPenunjang: "Peraturan yang sudah jelas",
    faktorPenghambat: "Birokrasi yang berbelit",
    opdKoordinator: "Bagian Organisasi",
    pelaksana: "BKPSDM",
  },
  {
    id: 4,
    kegiatanUtama: "Pengembangan Sistem Kerja Digital",
    indikator: "OPD yang menerapkan e-Office",
    target: "25",
    realisasi: "18",
    satuan: "OPD",
    capaian: "72%",
    anggaran: "Rp 150.000.000",
    realisasiAnggaran: "Rp 90.000.000",
    capaianAnggaran: "60%",
    faktorPenunjang: "Infrastruktur yang memadai",
    faktorPenghambat: "Keterbatasan kompetensi SDM",
    opdKoordinator: "Dinas Kominfo",
    pelaksana: "Seluruh OPD",
  },
  {
    id: 5,
    kegiatanUtama: "Penguatan Akuntabilitas Kinerja",
    indikator: "Tercapainya nilai SAKIP",
    target: "80",
    realisasi: "62",
    satuan: "Persen",
    capaian: "77%",
    anggaran: "Rp 120.000.000",
    realisasiAnggaran: "Rp 100.000.000",
    capaianAnggaran: "83%",
    faktorPenunjang: "Sistem monitoring yang baik",
    faktorPenghambat: "Data yang tidak konsisten",
    opdKoordinator: "Inspektorat",
    pelaksana: "Seluruh OPD",
  },
]

export function RenakSiRbTable() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredData = initialData.filter(
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
              <TableHead colSpan={7}>
                Tahun Anggaran 2025
              </TableHead>
              <TableHead rowSpan={2}>Faktor Penunjang</TableHead>
              <TableHead rowSpan={2}>Faktor Penghambat</TableHead>
              <TableHead rowSpan={2}>OPD Koordinator</TableHead>
              <TableHead rowSpan={2}>Pelaksana</TableHead>
              <TableHead rowSpan={2} className="w-28">
                Aksi
              </TableHead>
            </TableRow>
            <TableRow>
              <TableHead>Target</TableHead>
              <TableHead>Realisasi</TableHead>
              <TableHead>Satuan</TableHead>
              <TableHead>Capaian</TableHead>
              <TableHead>Anggaran</TableHead>
              <TableHead>Realisasi</TableHead>
              <TableHead>Capaian</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={15}
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
                  <TableCell>{item.realisasi}</TableCell>
                  <TableCell>{item.satuan}</TableCell>
                  <TableCell>{item.capaian}</TableCell>
                  <TableCell>{item.anggaran}</TableCell>
                  <TableCell>{item.realisasiAnggaran}</TableCell>
                  <TableCell>{item.capaianAnggaran}</TableCell>
                  <TableCell className="text-left">
                    {item.faktorPenunjang}
                  </TableCell>
                  <TableCell className="text-left">
                    {item.faktorPenghambat}
                  </TableCell>
                  <TableCell className="text-left">
                    {item.opdKoordinator}
                  </TableCell>
                  <TableCell className="text-left">
                    {item.pelaksana}
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
    </div>
  )
}
