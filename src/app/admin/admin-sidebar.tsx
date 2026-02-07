"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  ChevronLeft,
  FileText,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  Menu,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface NavItem {
  href: string;
  label: string;
  icon: "LayoutDashboard" | "BookOpen" | "FileText" | "Users" | "FolderOpen";
}

interface AdminSidebarProps {
  navItems: readonly NavItem[];
  userName: string;
}

const iconMap = {
  LayoutDashboard,
  BookOpen,
  FileText,
  Users,
  FolderOpen,
} as const;

export function AdminSidebar({ navItems, userName }: AdminSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:relative inset-y-0 left-0 z-40 bg-card border-r transition-all duration-300 flex flex-col",
          collapsed ? "w-16" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Header */}
        <div
          className={cn(
            "p-4 border-b flex items-center justify-between",
            collapsed && "justify-center",
          )}
        >
          {!collapsed && (
            <Link href="/admin" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold text-sm">SS</span>
              </div>
              <span className="font-semibold text-lg">Admin</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex"
            onClick={() => setCollapsed(!collapsed)}
          >
            <ChevronLeft
              className={cn(
                "h-4 w-4 transition-transform",
                collapsed && "rotate-180",
              )}
            />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1">
          {navItems.map((item) => {
            const Icon = iconMap[item.icon];
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  collapsed && "justify-center px-2",
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={cn("p-4 border-t", collapsed && "flex justify-center")}>
          {!collapsed && (
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                <span className="text-xs font-medium">
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{userName}</p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
            </div>
          )}
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors",
              collapsed && "justify-center",
            )}
            title={collapsed ? "Exit Admin" : undefined}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span>Exit Admin</span>}
          </Link>
        </div>
      </aside>
    </>
  );
}
