import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Dashboard",
};


export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold">Dashboard Realisasi</h1>
          <p className="text-sm text-muted-foreground">
            Ringkasan realisasi rencana belanja tahun anggaran 2026.
          </p>
        </div>
        <Badge variant="outline">TA 2026</Badge>
      </div>
    </div>
  );
}