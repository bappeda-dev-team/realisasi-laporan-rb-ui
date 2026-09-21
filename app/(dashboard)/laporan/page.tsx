import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LaporanRbTable } from "./laporan-rb-table"

export const metadata = {
  title: "Laporan",
}

export default function LaporanPage() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold">Laporan</h1>
        <p className="text-sm text-muted-foreground">
          Laporan realisasi reformasi birokrasi per target indikator.
        </p>
      </div>

      <Tabs defaultValue="general" className="gap-4">
        <TabsList>
          <TabsTrigger value="general">RB General</TabsTrigger>
          <TabsTrigger value="tematik">RB Tematik</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <LaporanRbTable jenisRb="GENERAL" />
        </TabsContent>

        <TabsContent value="tematik">
          <LaporanRbTable jenisRb="TEMATIK" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
