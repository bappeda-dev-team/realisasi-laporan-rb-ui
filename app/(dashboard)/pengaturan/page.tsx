import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = {
  title: "Pengaturan",
};

export default function PengaturanPage() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold">Pengaturan</h1>
        <p className="text-sm text-muted-foreground">
          Kelola pengaturan akun dan preferensi aplikasi.
        </p>
      </div>
      <Card className="min-h-64">
        <CardHeader>
          <CardTitle className="text-base">Belum ada data</CardTitle>
          <CardDescription>
            Halaman ini akan diisi dengan form pengaturan aplikasi.
          </CardDescription>
        </CardHeader>
        <CardContent />
      </Card>
    </div>
  );
}