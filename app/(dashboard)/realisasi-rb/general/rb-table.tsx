"use client"

import { useState } from "react"
import { Search, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
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
  const { tahun } = useFilter()
  const baselineTahun = Number(tahun) - 1

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
              <TableHead rowSpan={2}>Kegiatan Utama</TableHead>
              <TableHead rowSpan={2}>Indikator</TableHead>
              <TableHead colSpan={3}>BaseLine {baselineTahun}</TableHead>
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
                  colSpan={13}
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
                  <TableCell>{item.baseline.satuan}</TableCell>
                  <TableCell>{item.baseline.capaian}</TableCell>
                  <TableCell>{item.berjalan.target}</TableCell>
                  <TableCell>{item.berjalan.satuan}</TableCell>
                  <TableCell className="text-left">{item.keterangan}</TableCell>
                  <TableCell className="text-left">
                    {item.faktorPenunjang}
                  </TableCell>
                  <TableCell className="text-left">
                    {item.faktorPenghambat}
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
