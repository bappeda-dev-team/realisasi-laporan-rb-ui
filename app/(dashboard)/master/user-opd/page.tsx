import { UserTable } from "./user-table";

export const metadata = {
  title: "Master User OPD",
};

export default function MasterUserOpdPage() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold">User OPD</h1>
        <p className="text-sm text-muted-foreground">
          Kelola data admin Organisasi Perangkat Daerah (OPD).
        </p>
      </div>
      <UserTable />
    </div>
  );
}
