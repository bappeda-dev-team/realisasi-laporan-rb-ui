import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { AppSidebar } from "@/components/app-sidebar";
import { FilterNavbar } from "@/components/filter-navbar";
import { FilterProvider } from "@/components/filter-context";

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
          <FilterProvider>
            <FilterNavbar />
            <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
          </FilterProvider>
        </SidebarInset>
        <Toaster position="top-right" />
      </SidebarProvider>
    </TooltipProvider>
  );
}