"use client"

import { createContext, useContext, useState } from "react"

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

export function FilterProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [opd, setOpd] = useState("Semua OPD")
  const [periode, setPeriode] = useState("Tahun Penuh")
  const [tahun, setTahun] = useState("2026")
  const [bulan, setBulan] = useState("Januari")

  return (
    <FilterContext.Provider
      value={{ opd, setOpd, periode, setPeriode, tahun, setTahun, bulan, setBulan }}
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