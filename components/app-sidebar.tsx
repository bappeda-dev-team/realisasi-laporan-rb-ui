"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Collapsible as CollapsiblePrimitive } from "radix-ui";
import {
  Building2,
  ChevronDown,
  CircleDollarSign,
  ClipboardList,
  FileText,
  Landmark,
  LayoutDashboard,
  Settings,
  UserRound,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const navGroups = [
  {
    label: "Utama",
    items: [{ title: "Dashboard", href: "/", icon: LayoutDashboard }],
  },
  {
    label: "Data Master",
    items: [
      {
        title: "Nama OPD (Organisasi Perangkat Daerah)",
        href: "/master/opd",
        icon: Building2,
      },
      {
        title: "User OPD (Admin Organisasi Perangkat Daerah)",
        href: "/master/user-opd",
        icon: UserRound,
      },
    ],
  },
  {
    label: "Rencana Aksi Reformasi Birokrasi",
    items: [
      {
        title: "General",
        href: "/rencana-aksi/general",
        icon: ClipboardList,
      },
      {
        title: "Tematik",
        href: "/rencana-aksi/tematik",
        icon: ClipboardList,
      },
    ],
  },
  {
    label: "Realisasi Reformasi Birokrasi",
    items: [
      {
        title: "General",
        href: "/realisasi-rb/general",
        icon: CircleDollarSign,
      },
      {
        title: "Tematik",
        href: "/realisasi-rb/tematik",
        icon: CircleDollarSign,
      },
    ],
  },
  {
    label: "Lainnya",
    items: [
      { title: "Laporan", href: "/laporan", icon: FileText },
      { title: "Pengaturan", href: "/pengaturan", icon: Settings },
    ],
  },
] as const;

export function AppSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Landmark className="size-4" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="truncate font-semibold">Realisasi RB</span>
                  <span className="truncate text-xs text-sidebar-foreground/70">
                    Bappeda
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((group) => (
          <CollapsiblePrimitive.Root
            key={group.label}
            defaultOpen={group.items.some((item) => isActive(item.href))}
            className="group/collapsible"
          >
            <SidebarGroup>
              <SidebarGroupLabel asChild>
                <CollapsiblePrimitive.Trigger className="flex w-full items-center gap-2">
                  {group.label}
                  <ChevronDown className="ms-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </CollapsiblePrimitive.Trigger>
              </SidebarGroupLabel>
              <CollapsiblePrimitive.Content>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive(item.href)}
                          tooltip={item.title}
                        >
                          <Link href={item.href}>
                            <item.icon />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsiblePrimitive.Content>
            </SidebarGroup>
          </CollapsiblePrimitive.Root>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div className="flex flex-col leading-tight">
                <span className="truncate font-medium">Admin Bappeda</span>
                <span className="truncate text-xs text-muted-foreground">
                  admin@bappeda.go.id
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}