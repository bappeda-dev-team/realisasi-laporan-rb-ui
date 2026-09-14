"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type ModalFaktorPenghambatProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  kegiatanUtama: string
  indikator: string
  fieldValue: string
  onFieldChange: (value: string) => void
  onSave: () => void
}

export function ModalFaktorPenghambat({
  open,
  onOpenChange,
  kegiatanUtama,
  indikator,
  fieldValue,
  onFieldChange,
  onSave,
}: ModalFaktorPenghambatProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Faktor Penghambat</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="kegiatan-utama">Kegiatan Utama</Label>
            <Input id="kegiatan-utama" value={kegiatanUtama} disabled />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="indikator">Indikator</Label>
            <Input id="indikator" value={indikator} disabled />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="field-value">Faktor Penghambat</Label>
            <Input
              id="field-value"
              value={fieldValue}
              onChange={(e) => onFieldChange(e.target.value)}
              placeholder="Masukkan faktor penghambat"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button onClick={onSave}>
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}