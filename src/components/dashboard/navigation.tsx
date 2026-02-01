"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Settings,
  FileText,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Sales Pipeline",
    href: "/dashboard/sales",
    icon: BarChart3,
  },
  {
    label: "Courses",
    href: "/dashboard/courses",
    icon: BookOpen,
  },
  {
    label: "Projects",
    href: "/dashboard/projects",
    icon: FileText,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function DashboardNavigation() {
  const pathname = usePathname();

  return (
    <div className="space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link key={item.href} href={item.href}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 text-base transition-all",
                isActive
                  ? "bg-cyber-cyan/20 text-cyan-400 border-l-2 border-cyber-cyan hover:bg-cyber-cyan/30"
                  : "hover:bg-card/50 text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Button>
          </Link>
        );
      })}
    </div>
  );
}
