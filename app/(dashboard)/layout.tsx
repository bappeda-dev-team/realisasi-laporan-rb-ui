import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { AppSidebar } from "@/components/app-sidebar";
import { FilterNavbar } from "@/components/filter-navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <FilterNavbar />
          <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
        </SidebarInset>
        <Toaster position="top-right" />
      </SidebarProvider>
    </TooltipProvider>
  );
}