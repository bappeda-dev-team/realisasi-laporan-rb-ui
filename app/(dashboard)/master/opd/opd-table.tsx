"use client"

import { useState } from "react"
import { Pencil, Plus, Search, Trash2 } from "lucide-react"
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
  const [data, setData] = useState<Opd[]>(initialData)
  const [searchQuery, setSearchQuery] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingOpd, setEditingOpd] = useState<Opd | null>(null)
  const [deletingOpd, setDeletingOpd] = useState<Opd | null>(null)

  const [formNamaOpd, setFormNamaOpd] = useState("")
  const [formNamaKepala, setFormNamaKepala] = useState("")
  const [formNipKepala, setFormNipKepala] = useState("")
  const [formPangkatKepala, setFormPangkatKepala] = useState("")
  const [formKodeLembaga, setFormKodeLembaga] = useState("")

  const filteredData = data.filter(
    (d) =>
      d.namaOpd.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.namaKepala.toLowerCase().includes(searchQuery.toLowerCase())
  )

  function resetForm() {
    setFormNamaOpd("")
    setFormNamaKepala("")
    setFormNipKepala("")
    setFormPangkatKepala("")
    setFormKodeLembaga("")
  }

  function handleAdd() {
    resetForm()
    setEditingOpd(null)
    setDialogOpen(true)
  }

  function handleEdit(opd: Opd) {
    setEditingOpd(opd)
    setFormNamaOpd(opd.namaOpd)
    setFormNamaKepala(opd.namaKepala)
    setFormNipKepala(opd.nipKepala)
    setFormPangkatKepala(opd.pangkatKepala)
    setFormKodeLembaga(opd.kodeLembaga)
    setDialogOpen(true)
  }

  function handleDeleteClick(opd: Opd) {
    setDeletingOpd(opd)
    setDeleteDialogOpen(true)
  }

  function handleDeleteConfirm() {
    if (!deletingOpd) return
    setData(data.filter((d) => d.id !== deletingOpd.id))
    setDeleteDialogOpen(false)
    setDeletingOpd(null)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (editingOpd) {
      setData(
        data.map((d) =>
          d.id === editingOpd.id
            ? {
                ...d,
                namaOpd: formNamaOpd,
                namaKepala: formNamaKepala,
                nipKepala: formNipKepala,
                pangkatKepala: formPangkatKepala,
                kodeLembaga: formKodeLembaga,
              }
            : d
        )
      )
    } else {
      const newOpd: Opd = {
        id: Date.now(),
        namaOpd: formNamaOpd,
        namaKepala: formNamaKepala,
        nipKepala: formNipKepala,
        pangkatKepala: formPangkatKepala,
        kodeLembaga: formKodeLembaga,
      }
      setData([...data, newOpd])
    }

    setDialogOpen(false)
    resetForm()
    setEditingOpd(null)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama OPD..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button size="sm" onClick={handleAdd}>
          <Plus className="size-4 mr-1" />
          Tambah OPD
        </Button>
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
              <TableHead className="w-36">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
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
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(opd)}
                      >
                        <Pencil className="size-3.5 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteClick(opd)}
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
            <DialogTitle>{editingOpd ? "Edit OPD" : "Tambah OPD"}</DialogTitle>
            <DialogDescription>
              {editingOpd
                ? "Ubah data Perangkat Daerah di bawah ini."
                : "Isi data Perangkat Daerah baru di bawah ini."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="namaOpd">Nama Perangkat Daerah</Label>
              <Input
                id="namaOpd"
                value={formNamaOpd}
                onChange={(e) => setFormNamaOpd(e.target.value)}
                placeholder="Masukkan nama OPD"
                required
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="namaKepala">Nama Kepala Perangkat Daerah</Label>
              <Input
                id="namaKepala"
                value={formNamaKepala}
                onChange={(e) => setFormNamaKepala(e.target.value)}
                placeholder="Masukkan nama kepala OPD"
                required
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="nipKepala">NIP Kepala Perangkat Daerah</Label>
              <Input
                id="nipKepala"
                value={formNipKepala}
                onChange={(e) => setFormNipKepala(e.target.value)}
                placeholder="Masukkan NIP"
                required
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="pangkatKepala">Pangkat Kepala Daerah</Label>
              <Input
                id="pangkatKepala"
                value={formPangkatKepala}
                onChange={(e) => setFormPangkatKepala(e.target.value)}
                placeholder="Masukkan pangkat"
                required
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="kodeLembaga">Kode Lembaga</Label>
              <Input
                id="kodeLembaga"
                value={formKodeLembaga}
                onChange={(e) => setFormKodeLembaga(e.target.value)}
                placeholder="Masukkan kode lembaga"
                required
              />
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
            <DialogTitle>Hapus OPD</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus{" "}
              <span className="font-medium text-foreground">{deletingOpd?.namaOpd}</span>?
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
