import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = {
  title: "Realisasi RB Tematik",
};

export default function RealisasiRbTematikPage() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold">Realisasi RB Tematik</h1>
        <p className="text-sm text-muted-foreground">
          Data realisasi reformasi birokrasi kategori tematik.
        </p>
      </div>
      <Card className="min-h-64">
        <CardHeader>
          <CardTitle className="text-base">Belum ada data</CardTitle>
          <CardDescription>
            Halaman ini akan diisi dengan tabel realisasi RB tematik.
          </CardDescription>
        </CardHeader>
        <CardContent />
      </Card>
    </div>
  );
}