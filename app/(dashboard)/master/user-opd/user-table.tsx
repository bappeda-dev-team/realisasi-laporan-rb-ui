"use client"

import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Pegawai = {
  id: number
  nip: string
  nama_pegawai: string
  status_pegawai: string
}

export function UserTable() {
  const [data, setData] = useState<Pegawai[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetch("/api/kepegawaian/pegawai")
      .then((r) => r.json())
      .then((res: { data: Pegawai[] }) => {
        setData(res.data ?? [])
        setLoading(false)
      })
      .catch(() => {
        setError("Gagal memuat data.")
        setLoading(false)
      })
  }, [])

  const filteredData = data.filter((d) =>
    d.nama_pegawai.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Cari nama..."
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
              <TableHead>Nama</TableHead>
              <TableHead>NIP</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  Memuat data...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-destructive">
                  {error}
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  Tidak ada data ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((pegawai, index) => (
                <TableRow key={pegawai.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{pegawai.nama_pegawai}</TableCell>
                  <TableCell>{pegawai.nip}</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>
                    <Badge
                      variant={pegawai.status_pegawai === "AKTIF" ? "default" : "destructive"}
                    >
                      {pegawai.status_pegawai}
                    </Badge>
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
