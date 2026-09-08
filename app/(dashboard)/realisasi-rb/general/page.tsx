import { RbTable } from "./rb-table";

export const metadata = {
  title: "Realisasi RB General",
};

export default function RealisasiRbGeneralPage() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold">Realisasi RB General</h1>
        <p className="text-sm text-muted-foreground">
          Data realisasi reformasi birokrasi kategori general.
        </p>
      </div>
      <RbTable />
    </div>
  );
}