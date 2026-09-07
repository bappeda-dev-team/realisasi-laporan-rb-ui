import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = {
  title: "Laporan",
};

export default function LaporanPage() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold">Laporan</h1>
        <p className="text-sm text-muted-foreground">
          Generate dan unduh laporan realisasi anggaran.
        </p>
      </div>
      <Card className="min-h-64">
        <CardHeader>
          <CardTitle className="text-base">Belum ada data</CardTitle>
          <CardDescription>
            Halaman ini akan diisi dengan daftar laporan yang tersedia.
          </CardDescription>
        </CardHeader>
        <CardContent />
      </Card>
    </div>
  );
}