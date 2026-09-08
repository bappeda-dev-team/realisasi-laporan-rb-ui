"use client"

import { useState } from "react"
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

type ReformasiBirokrasi = {
  id: number
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

const initialData: ReformasiBirokrasi[] = [
  {
    id: 1,
    jenisRb: "Quick Wins",
    kegiatanUtama: "Penyusunan Dokumen Reformasi Birokrasi",
    keterangan: "Dokumen RB tingkat kabupaten",
    indikator: "Terbitnya dokumen RB",
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
  },
  {
    id: 2,
    jenisRb: "Area Perubahan",
    kegiatanUtama: "Penguatan Organisasi dan Tata Laksana",
    keterangan: "Penataan organisasi dan tata laksana",
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
  },
  {
    id: 3,
    jenisRb: "Quick Wins",
    kegiatanUtama: "Sosialisasi Reformasi Birokrasi",
    keterangan: "Sosialisasi kepada seluruh OPD",
    indikator: "Jumlah kegiatan sosialisasi",
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
  },
  {
    id: 4,
    jenisRb: "Program Unggulan",
    kegiatanUtama: "Pengembangan Sistem Kerja Digital",
    keterangan: "Penerapan e-Office di seluruh OPD",
    indikator: "Jumlah OPD penerapan e-Office",
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
  },
  {
    id: 5,
    jenisRb: "Area Perubahan",
    kegiatanUtama: "Penguatan Akuntabilitas Kinerja",
    keterangan: "Peningkatan nilai SAKIP kabupaten",
    indikator: "Nilai SAKIP kabupaten",
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
  },
]

export function RbTable() {
  const [data] = useState<ReformasiBirokrasi[]>(initialData)
  const [searchQuery, setSearchQuery] = useState("")
  const { tahun } = useFilter()
  const baselineTahun = Number(tahun) - 1

  const filteredData = data.filter(
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
            {filteredData.length === 0 ? (
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
                <TableRow key={item.id}>
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