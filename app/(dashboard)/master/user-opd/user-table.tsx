"use client"

import { useState } from "react"
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

type User = {
  id: number
  nama: string
  nip: string
  email: string
  status: "Aktif" | "Nonaktif"
}

const initialData: User[] = [
  {
    id: 1,
    nama: "Andi Prasetyo",
    nip: "198203051998031001",
    email: "andi.prasetyo@mail.com",
    status: "Aktif",
  },
  {
    id: 2,
    nama: "Sari Wulandari",
    nip: "198710122005012002",
    email: "sari.wulandari@mail.com",
    status: "Aktif",
  },
  {
    id: 3,
    nama: "Bambang Sutrisno",
    nip: "197512211999031003",
    email: "bambang.sutrisno@mail.com",
    status: "Nonaktif",
  },
  {
    id: 4,
    nama: "Dewi Lestari",
    nip: "199002182010012004",
    email: "dewi.lestari@mail.com",
    status: "Aktif",
  },
  {
    id: 5,
    nama: "Rian Hidayat",
    nip: "198806252011011005",
    email: "rian.hidayat@mail.com",
    status: "Nonaktif",
  },
]

export function UserTable() {
  const [data] = useState<User[]>(initialData)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredData = data.filter(
    (d) =>
      d.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Cari nama/email..."
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
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  Tidak ada data ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((user, index) => (
                <TableRow key={user.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{user.nama}</TableCell>
                  <TableCell>{user.nip}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.status === "Aktif" ? "default" : "destructive"}>
                      {user.status}
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
