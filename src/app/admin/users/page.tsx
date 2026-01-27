import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default async function AdminUsersPage() {
  const session = await auth();

  if (!session?.user?.email) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: {
          enrollments: true,
          clientProjects: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const roleColors: Record<string, string> = {
    ADMIN: "bg-purple-100 text-purple-800",
    CUSTOMER: "bg-blue-100 text-blue-800",
    STUDENT: "bg-green-100 text-green-800",
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground">{users.length} users total</p>
          </div>
        </div>

        {/* Role Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {["ADMIN", "CUSTOMER", "STUDENT"].map((role) => (
            <Card key={role}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {role}s
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {users.filter((u) => u.role === role).length}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium">User</th>
                    <th className="text-left py-2 font-medium">Role</th>
                    <th className="text-left py-2 font-medium">Enrollments</th>
                    <th className="text-left py-2 font-medium">Projects</th>
                    <th className="text-left py-2 font-medium">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-3">
                        <p className="font-medium">{user.name || "No name"}</p>
                        <p className="text-muted-foreground text-xs">{user.email}</p>
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-1 text-xs rounded ${roleColors[user.role]}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3">{user._count.enrollments}</td>
                      <td className="py-3">{user._count.clientProjects}</td>
                      <td className="py-3 text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && (
                <p className="text-muted-foreground text-sm py-4 text-center">
                  No users yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6">
          <Link href="/admin" className="text-muted-foreground hover:underline text-sm">
            ← Back to Admin Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
