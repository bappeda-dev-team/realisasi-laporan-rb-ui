"use client"

import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { Upload, X, Loader2 } from "lucide-react"

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
import { Textarea } from "@/components/ui/textarea"
import { useFilter } from "@/components/filter-context"

type ModalRbGeneralProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  kegiatanUtama: string
  indikator: string
  realisasiValue: string
  onRealisasiChange: (value: string) => void
  onSave: (data?: RealisasiRbGeneralResponse) => void
  idRbGeneral: string
  idIndikatorRbGeneral: string
  idTargetRbGeneral: string
  kodeOpd: string
  nip: string
  initialBuktiPendukung?: string
}

type RealisasiRbGeneralResponse = {
  id: number
  kode_opd: string
  nip: string
  tahun: string
  bulan: string
  id_rb_general: string
  id_indikator_rb_general: string
  id_target_rb_general: string
  realisasi: number
  jenis_realisasi: string
  faktor_penunjang: string
  faktor_penghambat: string
  bukti_pendukung: string
  created_by: string
  last_modified_by: string
  created_date: string
  last_modified_date: string
  target: number
  capaian: number
  keterangan_capaian: string
  keterangan_bukti_pendukung: string
}

const BULAN_MAP: Record<string, string> = {
  Januari: "1",
  Februari: "2",
  Maret: "3",
  April: "4",
  Mei: "5",
  Juni: "6",
  Juli: "7",
  Agustus: "8",
  September: "9",
  Oktober: "10",
  November: "11",
  Desember: "12",
}

function bulanKeAngka(bulan: string | number | null | undefined): string {
  if (bulan === null || bulan === undefined) return ""
  if (typeof bulan === "number") return String(bulan)
  const trimmed = String(bulan).trim()
  if (/^\d+$/.test(trimmed)) return trimmed
  return BULAN_MAP[trimmed] ?? ""
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "https://api-mahulu.kertaskerja.cc"

function resolveFileUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) return url
  if (url.startsWith("/")) return `${API_BASE}${url}`
  return `${API_BASE}/${url}`
}

function extractFileNameFromUrl(url: string): string {
  try {
    const clean = url.split("?")[0].split("#")[0]
    const segments = clean.split("/")
    const last = segments[segments.length - 1]
    return decodeURIComponent(last) || "File"
  } catch {
    return "File"
  }
}

export function ModalRbGeneral({
  open,
  onOpenChange,
  kegiatanUtama,
  indikator,
  realisasiValue,
  onRealisasiChange,
  onSave,
  idRbGeneral,
  idIndikatorRbGeneral,
  idTargetRbGeneral,
  kodeOpd,
  nip,
  initialBuktiPendukung = "",
}: ModalRbGeneralProps) {
  const { tahun, bulan } = useFilter()

  const [buktiPendukung, setBuktiPendukung] = useState(initialBuktiPendukung)
  const [keteranganBuktiPendukung, setKeteranganBuktiPendukung] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [isUploading, setIsUploading] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // sinkron kalau modal dibuka / prop berubah
  useEffect(() => {
    if (open) {
      setBuktiPendukung(initialBuktiPendukung)
      setFileName(
        initialBuktiPendukung
          ? extractFileNameFromUrl(initialBuktiPendukung)
          : null
      )
      setKeteranganBuktiPendukung("")
    }
  }, [open, initialBuktiPendukung])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // reset input agar bisa pilih file yang sama lagi
    e.target.value = ""

    const MAX_SIZE = 10 * 1024 * 1024 // 10 MB
    if (file.size > MAX_SIZE) {
      toast.error("Ukuran file maksimal 10 MB")
      return
    }

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch(
        "/api/realisasi/laporanrbgeneral/upload/file",
        {
          method: "POST",
          body: formData,
          // JANGAN set Content-Type; browser yang atur multipart + boundary
        }
      )

      if (!res.ok) {
        let message = `Gagal upload (HTTP ${res.status})`
        try {
          const errText = await res.text()
          if (errText) message = errText
        } catch {
          // biarkan pesan default
        }
        throw new Error(message)
      }

      const rawUrl = (await res.text()).trim()
      if (!rawUrl) {
        throw new Error("Response upload tidak memuat URL file")
      }

      const finalUrl = resolveFileUrl(rawUrl)
      setBuktiPendukung(finalUrl)
      setFileName(file.name)
      toast.success("File berhasil diupload")
    } catch (error) {
      console.error(error)
      toast.error(
        error instanceof Error ? error.message : "Gagal upload file"
      )
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveFile = () => {
    setBuktiPendukung("")
    setFileName(null)
  }

  const handleSave = async () => {
    if (!realisasiValue.trim()) {
      toast.error("Nilai realisasi wajib diisi")
      return
    }

    const realisasiNumber = Number(realisasiValue)
    if (Number.isNaN(realisasiNumber)) {
      toast.error("Nilai realisasi harus berupa angka")
      return
    }

    const bulanAngka = bulanKeAngka(bulan)
    if (!bulanAngka) {
      toast.error("Bulan tidak valid")
      return
    }

    if (!kodeOpd || !nip) {
      toast.error("Data user tidak lengkap, silakan login ulang")
      return
    }

    if (!idRbGeneral || !idIndikatorRbGeneral || !idTargetRbGeneral) {
      toast.error("Data RB tidak lengkap")
      return
    }

    const payload = {
      kodeOpd,
      nip,
      tahun: String(tahun),
      bulan: bulanAngka,
      idRbGeneral,
      idIndikatorRbGeneral,
      idTargetRbGeneral,
      realisasi: realisasiNumber,
      buktiPendukung,
      keteranganBuktiPendukung,
    }

    console.log("payload realisasi:", payload)

    setIsSubmitting(true)

    try {
      const res = await fetch("/api/realisasi/laporanrbgeneral", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        let message = `Gagal menyimpan (HTTP ${res.status})`
        try {
          const errJson = await res.json()
          message = errJson.message ?? errJson.error ?? message
        } catch {
          // biarkan pesan default
        }
        throw new Error(message)
      }

      const data: RealisasiRbGeneralResponse = await res.json()
      console.log("response realisasi:", data)

      toast.success("Realisasi berhasil disimpan")
      onSave(data)
      onOpenChange(false)
    } catch (error) {
      console.error(error)
      toast.error(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menyimpan"
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Realisasi Tahun {tahun} Bulan {bulan}
          </DialogTitle>
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
              type="number"
              value={realisasiValue}
              onChange={(e) => onRealisasiChange(e.target.value)}
              placeholder="Nilai realisasi"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="bukti-pendukung">Bukti Pendukung</Label>

            <input
              ref={fileInputRef}
              id="bukti-pendukung"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
            />

            {!buktiPendukung ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Mengupload...
                  </>
                ) : (
                  <>
                    <Upload className="size-4 mr-2" />
                    Pilih File
                  </>
                )}
              </Button>
            ) : (
              <div className="flex items-center justify-between gap-2 rounded-md border px-3 py-2">
                <span className="text-sm truncate">
                  {fileName ?? "File terupload"}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveFile}
                >
                  <X className="size-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="keterangan-bukti">
              Keterangan Bukti Pendukung
            </Label>
            <Textarea
              id="keterangan-bukti"
              value={keteranganBuktiPendukung}
              onChange={(e) => setKeteranganBuktiPendukung(e.target.value)}
              placeholder="Dokumen pendukung"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting || isUploading}
          >
            Batal
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSubmitting || isUploading}
          >
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}