"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Collapsible as CollapsiblePrimitive } from "radix-ui";
import { useFilter } from "@/components/filter-context";
import {
  Building2,
  ChevronDown,
  ClipboardList,
  FileText,
  Landmark,
  LayoutDashboard,
  LogOut,
  Scale,
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
        title: "Nama OPD",
        href: "/master/opd",
        icon: Building2,
      },
      {
        title: "User OPD",
        href: "/master/user-opd",
        icon: UserRound,
      },
      {
        title: "Reformasi Birokrasi",
        href: "/master/reformasi-birokrasi",
        icon: Scale,
      },
    ],
  },
  {
    label: "Rencana Aksi Reformasi Birokrasi",
    items: [
      {
        title: "General",
        href: "/renaksi-rb/general",
        icon: ClipboardList,
      },
      {
        title: "Tematik",
        href: "/renaksi-rb/tematik",
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
        icon: ClipboardList,
      },
      {
        title: "Tematik",
        href: "/realisasi-rb/tematik",
        icon: ClipboardList,
      },
    ],
  },
  {
    label: "Lainnya",
    items: [
      { title: "Laporan", href: "/laporan", icon: FileText },
    ],
  },
] as const;

type UserInfo = {
  username?: string;
  firstName?: string;
  kode_opd?: string;
  nip?: string;
  roles?: string[];
};

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { opd } = useFilter();
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    fetch("/api/auth/user-info")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: UserInfo | null) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  async function handleLogout(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

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
                    {opd}
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
                <span className="truncate font-medium">
                  {user?.firstName || "Admin Bappeda"}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {user ? user.username || "-" : "admin@bappeda.go.id"}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton size="sm" onClick={handleLogout} tooltip="Keluar">
              <LogOut />
              <span>Keluar</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}