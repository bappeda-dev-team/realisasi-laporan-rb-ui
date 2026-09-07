import { OpdTable } from "./opd-table";

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
      <OpdTable />
    </div>
  );
}
