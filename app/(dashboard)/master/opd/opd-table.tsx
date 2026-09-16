"use client"

import { useEffect, useState } from "react"
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
  kode_lembaga: string
  kode_opd: string
  nama_opd: string
  singkatan_opd: string
  status_opd: string
}

type ApiResponse = {
  code: number
  status: string
  message: string
  data: Opd[]
}

export function OpdTable() {
  const [data, setData] = useState<Opd[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    let cancelled = false

    async function fetchOpd() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch("/api/kepegawaian/opd/all")
        if (!res.ok) {
          throw new Error(`Gagal memuat data (status ${res.status})`)
        }
        const json: ApiResponse = await res.json()
        if (!cancelled) {
          setData(json.data ?? [])
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Terjadi kesalahan saat memuat data.")
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchOpd()
    return () => {
      cancelled = true
    }
  }, [])

  const filteredData = data.filter((d) =>
    d.nama_opd.toLowerCase().includes(searchQuery.toLowerCase())
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
        <Table className="[&_th]:border-r [&_td]:border-r [&_th:last-child]:border-r-0 [&_td:last-child]:border-r-0">
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">No</TableHead>
              <TableHead className="text-center whitespace-normal">Nama Perangkat Daerah</TableHead>
              <TableHead className="text-center whitespace-normal">Nama Kepala Perangkat Daerah</TableHead>
              <TableHead className="text-center whitespace-normal">NIP Kepala Perangkat Daerah</TableHead>
              <TableHead className="text-center whitespace-normal">Pangkat Kepala Daerah</TableHead>
              <TableHead className="text-center whitespace-normal">Kode Lembaga</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  Memuat data...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  {error}
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  Tidak ada data ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((opd, index) => (
                <TableRow key={opd.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="text-left whitespace-normal wrap-break-word">{opd.nama_opd}</TableCell>
                  <TableCell className="text-left whitespace-normal wrap-break-word">-</TableCell>
                  <TableCell className="text-left whitespace-normal wrap-break-word">-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell className="text-left whitespace-normal wrap-break-word">{opd.kode_lembaga}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}