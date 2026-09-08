"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Opd = {
  id: number
  namaOpd: string
  namaKepala: string
  nipKepala: string
  pangkatKepala: string
  kodeLembaga: string
}

const initialData: Opd[] = [
  {
    id: 1,
    namaOpd: "Dinas Pendidikan",
    namaKepala: "Budi Santoso, S.Pd, M.Pd",
    nipKepala: "196805151993011001",
    pangkatKepala: "Pembina Tk.I (IV-b)",
    kodeLembaga: "D090",
  },
  {
    id: 2,
    namaOpd: "Dinas Kesehatan",
    namaKepala: "dr. Siti Rahayu, M.Kes",
    nipKepala: "197203201998032002",
    pangkatKepala: "Pembina (IV-a)",
    kodeLembaga: "D091",
  },
  {
    id: 3,
    namaOpd: "Dinas Pekerjaan Umum",
    namaKepala: "Ir. Agus Widodo, M.T.",
    nipKepala: "196507101990031003",
    pangkatKepala: "Pembina Utama Muda (IV-c)",
    kodeLembaga: "D092",
  },
  {
    id: 4,
    namaOpd: "Dinas Sosial",
    namaKepala: "Dra. Kartini, M.Si",
    nipKepala: "197001251995012004",
    pangkatKepala: "Pembina Tk.I (IV-b)",
    kodeLembaga: "D093",
  },
  {
    id: 5,
    namaOpd: "Dinas Komunikasi dan Informatika",
    namaKepala: "Rizal Pratama, S.Kom, M.M.",
    nipKepala: "197508182003121005",
    pangkatKepala: "Penata Tk.I (III-d)",
    kodeLembaga: "D094",
  },
]

export function OpdTable() {
  const [data] = useState<Opd[]>(initialData)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredData = data.filter(
    (d) =>
      d.namaOpd.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.namaKepala.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Cari nama OPD..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
      </div>

      <div className="rounded-md border">
        <Table className="[&_th]:border-r [&_td]:border-r [&_th:last-child]:border-r-0 [&_td:last-child]:border-r-0 [&_th]:text-center [&_td]:text-center">
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">No</TableHead>
              <TableHead>Nama Perangkat Daerah</TableHead>
              <TableHead>Nama Kepala Perangkat Daerah</TableHead>
              <TableHead>NIP Kepala Perangkat Daerah</TableHead>
              <TableHead>Pangkat Kepala Daerah</TableHead>
              <TableHead>Kode Lembaga</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  Tidak ada data ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((opd, index) => (
                <TableRow key={opd.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{opd.namaOpd}</TableCell>
                  <TableCell>{opd.namaKepala}</TableCell>
                  <TableCell>{opd.nipKepala}</TableCell>
                  <TableCell>{opd.pangkatKepala}</TableCell>
                  <TableCell>{opd.kodeLembaga}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
