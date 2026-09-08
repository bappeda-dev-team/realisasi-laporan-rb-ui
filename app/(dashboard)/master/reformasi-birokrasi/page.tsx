import { RbTable } from "./rb-table";

export const metadata = {
  title: "Reformasi Birokrasi",
};

export default function ReformasiBirokrasiPage() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold">Reformasi Birokrasi</h1>
        <p className="text-sm text-muted-foreground">
          Data reformasi birokrasi.
        </p>
      </div>
      <RbTable />
    </div>
  );
}