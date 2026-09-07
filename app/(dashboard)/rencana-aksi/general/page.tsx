import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = {
  title: "Rencana Aksi General",
};

export default function RencanaAksiGeneralPage() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold">Rencana Aksi General</h1>
        <p className="text-sm text-muted-foreground">
          Data rencana aksi reformasi birokrasi kategori general.
        </p>
      </div>
      <Card className="min-h-64">
        <CardHeader>
          <CardTitle className="text-base">Belum ada data</CardTitle>
          <CardDescription>
            Halaman ini akan diisi dengan tabel rencana aksi general.
          </CardDescription>
        </CardHeader>
        <CardContent />
      </Card>
    </div>
  );
}