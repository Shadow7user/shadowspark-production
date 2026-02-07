import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "./admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.email) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: "LayoutDashboard" },
    { href: "/admin/courses", label: "Courses", icon: "BookOpen" },
    { href: "/admin/blog", label: "Blog Posts", icon: "FileText" },
    { href: "/admin/users", label: "Users", icon: "Users" },
    { href: "/admin/projects", label: "Projects", icon: "FolderOpen" },
  ] as const;

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <AdminSidebar
        navItems={navItems}
        userName={session.user.name ?? "Admin"}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
