import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = {
  title: "Master Nama OPD",
};

export default function MasterOpdPage() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold">Nama OPD</h1>
        <p className="text-sm text-muted-foreground">
          Kelola data nama Organisasi Perangkat Daerah (OPD).
        </p>
      </div>
      <Card className="min-h-64">
        <CardHeader>
          <CardTitle className="text-base">Belum ada data</CardTitle>
          <CardDescription>
            Halaman ini akan diisi dengan tabel master nama OPD.
          </CardDescription>
        </CardHeader>
        <CardContent />
      </Card>
    </div>
  );
}