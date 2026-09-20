"use client"

import { createContext, useContext, useEffect, useState } from "react"

type FilterContextValue = {
  opd: string
  setOpd: (opd: string) => void
  periode: string
  setPeriode: (periode: string) => void
  tahun: string
  setTahun: (tahun: string) => void
  bulan: string
  setBulan: (bulan: string) => void
}

const FilterContext = createContext<FilterContextValue | null>(null)

const STORAGE_KEY = "rb-filter"

const DEFAULT_OPD = "Semua OPD"
const DEFAULT_PERIODE = "Tahun Penuh"
const DEFAULT_TAHUN = "2026"
const DEFAULT_BULAN = "Januari"

export function FilterProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [opd, setOpd] = useState(DEFAULT_OPD)
  const [periode, setPeriode] = useState(DEFAULT_PERIODE)
  const [tahun, setTahun] = useState(DEFAULT_TAHUN)
  const [bulan, setBulan] = useState(DEFAULT_BULAN)

  // Flag agar penulisan ke localStorage tidak menimpa nilai tersimpan
  // dengan nilai default saat pertama kali mount.
  const [hydrated, setHydrated] = useState(false)

  // Baca filter tersimpan setelah mount (client-only).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const saved = JSON.parse(raw) as Partial<{
          opd: string
          periode: string
          tahun: string
          bulan: string
        }>
        if (saved.opd) setOpd(saved.opd)
        if (saved.periode) setPeriode(saved.periode)
        if (saved.tahun) setTahun(saved.tahun)
        if (saved.bulan) setBulan(saved.bulan)
      }
    } catch (err) {
      console.error("Gagal membaca filter tersimpan:", err)
    } finally {
      setHydrated(true)
    }
  }, [])

  // Simpan setiap perubahan, tunggu hydrate selesai.
  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ opd, periode, tahun, bulan })
      )
    } catch (err) {
      console.error("Gagal menyimpan filter:", err)
    }
  }, [hydrated, opd, periode, tahun, bulan])

  return (
    <FilterContext.Provider
      value={{
        opd,
        setOpd,
        periode,
        setPeriode,
        tahun,
        setTahun,
        bulan,
        setBulan,
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}

export function useFilter() {
  const context = useContext(FilterContext)
  if (!context) {
    throw new Error("useFilter must be used within a FilterProvider")
  }
  return context
}