"use client"

import { useState } from "react"
import { Pencil, Plus, Search, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
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
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  const [data, setData] = useState<User[]>(initialData)
  const [searchQuery, setSearchQuery] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)

  const [formNama, setFormNama] = useState("")
  const [formNip, setFormNip] = useState("")
  const [formEmail, setFormEmail] = useState("")
  const [formStatus, setFormStatus] = useState<User["status"]>("Aktif")

  const filteredData = data.filter(
    (d) =>
      d.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  function resetForm() {
    setFormNama("")
    setFormNip("")
    setFormEmail("")
    setFormStatus("Aktif")
  }

  function handleAdd() {
    resetForm()
    setEditingUser(null)
    setDialogOpen(true)
  }

  function handleEdit(user: User) {
    setEditingUser(user)
    setFormNama(user.nama)
    setFormNip(user.nip)
    setFormEmail(user.email)
    setFormStatus(user.status)
    setDialogOpen(true)
  }

  function handleDeleteClick(user: User) {
    setDeletingUser(user)
    setDeleteDialogOpen(true)
  }

  function handleDeleteConfirm() {
    if (!deletingUser) return
    setData(data.filter((d) => d.id !== deletingUser.id))
    setDeleteDialogOpen(false)
    setDeletingUser(null)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (editingUser) {
      setData(
        data.map((d) =>
          d.id === editingUser.id
            ? {
                ...d,
                nama: formNama,
                nip: formNip,
                email: formEmail,
                status: formStatus,
              }
            : d
        )
      )
    } else {
      const newUser: User = {
        id: Date.now(),
        nama: formNama,
        nip: formNip,
        email: formEmail,
        status: formStatus,
      }
      setData([...data, newUser])
    }

    setDialogOpen(false)
    resetForm()
    setEditingUser(null)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama/email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button size="sm" onClick={handleAdd}>
          <Plus className="size-4 mr-1" />
          Tambah User
        </Button>
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
              <TableHead className="w-36">Aksi</TableHead>
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
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(user)}
                      >
                        <Pencil className="size-3.5 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteClick(user)}
                      >
                        <Trash2 className="size-3.5 mr-1" />
                        Hapus
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog Tambah / Edit */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingUser ? "Edit User" : "Tambah User"}</DialogTitle>
            <DialogDescription>
              {editingUser
                ? "Ubah data user di bawah ini."
                : "Isi data user baru di bawah ini."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="nama">Nama</Label>
              <Input
                id="nama"
                value={formNama}
                onChange={(e) => setFormNama(e.target.value)}
                placeholder="Masukkan nama user"
                required
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="nip">NIP</Label>
              <Input
                id="nip"
                value={formNip}
                onChange={(e) => setFormNip(e.target.value)}
                placeholder="Masukkan NIP"
                required
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                placeholder="Masukkan email"
                required
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="status">Status</Label>
              <Select value={formStatus} onValueChange={(v) => setFormStatus(v as User["status"])}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Aktif">Aktif</SelectItem>
                  <SelectItem value="Nonaktif">Nonaktif</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Batal
              </Button>
              <Button type="submit">Simpan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog Konfirmasi Hapus */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Hapus User</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus{" "}
              <span className="font-medium text-foreground">{deletingUser?.nama}</span>?
              Data yang dihapus tidak dapat dikembalikan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
