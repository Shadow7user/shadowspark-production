import { UserManagementClient } from "@/components/admin/user-management";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUsers } from "@/lib/actions/admin";
import { auth } from "@/lib/auth";
import {
  ArrowLeft,
  Briefcase,
  GraduationCap,
  Shield,
  Users,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminUsersPage() {
  const session = await auth();

  if (!session?.user?.email) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const users = await getUsers();

  // Calculate role counts
  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const customerCount = users.filter((u) => u.role === "CUSTOMER").length;
  const studentCount = users.filter((u) => u.role === "STUDENT").length;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground">{users.length} users total</p>
          </div>
        </div>

        {/* Role Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Users
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{users.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Admins
              </CardTitle>
              <Shield className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{adminCount}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Customers
              </CardTitle>
              <Briefcase className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{customerCount}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Students
              </CardTitle>
              <GraduationCap className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{studentCount}</p>
            </CardContent>
          </Card>
        </div>

        {/* Client Component for Interactive Features */}
        <UserManagementClient
          initialUsers={users}
          currentUserId={session.user.id ?? ""}
        />
      </div>
    </div>
  );
}
