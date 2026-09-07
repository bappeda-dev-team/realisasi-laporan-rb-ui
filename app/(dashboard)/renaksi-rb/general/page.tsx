import { RenakSiRbTable } from "./renaksi-rb-table";

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
      <RenakSiRbTable />
    </div>
  );
}