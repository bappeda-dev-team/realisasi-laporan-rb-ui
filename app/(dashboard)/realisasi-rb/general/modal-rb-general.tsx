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
import { useFilter } from "@/components/filter-context"

type ModalRbGeneralProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  kegiatanUtama: string
  indikator: string
  realisasiValue: string
  onRealisasiChange: (value: string) => void
  onSave: () => void
}

export function ModalRbGeneral({
  open,
  onOpenChange,
  kegiatanUtama,
  indikator,
  realisasiValue,
  onRealisasiChange,
  onSave,
}: ModalRbGeneralProps) {
  const { tahun, bulan } = useFilter()
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Realisasi Tahun {tahun} Bulan {bulan}</DialogTitle>
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
            <Label htmlFor="nilai-realisasi">Nilai Realisasi</Label>
            <Input
              id="nilai-realisasi"
              value={realisasiValue}
              onChange={(e) => onRealisasiChange(e.target.value)}
              placeholder="Nilai realisasi"
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