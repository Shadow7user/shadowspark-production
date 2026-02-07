"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { deleteUser, updateUser } from "@/lib/actions/admin";
import {
  Loader2,
  Pencil,
  Search,
  Shield,
  Trash2,
  User as UserIcon,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

type UserRole = "ADMIN" | "CUSTOMER" | "STUDENT";

interface UserData {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  phone: string | null;
  company: string | null;
  location: string | null;
  createdAt: Date;
  _count: {
    enrollments: number;
    clientProjects: number;
  };
}

interface UserManagementClientProps {
  initialUsers: UserData[];
  currentUserId: string;
}

const roleColors: Record<string, string> = {
  ADMIN:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  CUSTOMER: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  STUDENT:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
};

export function UserManagementClient({
  initialUsers,
  currentUserId,
}: UserManagementClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [roleFilter, setRoleFilter] = useState<string>(
    searchParams.get("role") || "all",
  );
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    role: "STUDENT" as UserRole,
    phone: "",
    company: "",
    location: "",
  });

  // Filter users client-side
  const filteredUsers = initialUsers.filter((user) => {
    const matchesSearch =
      !search ||
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.company?.toLowerCase().includes(search.toLowerCase());

    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const openEditDialog = (user: UserData) => {
    setEditForm({
      name: user.name || "",
      role: user.role,
      phone: user.phone || "",
      company: user.company || "",
      location: user.location || "",
    });
    setEditingUser(user);
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    startTransition(async () => {
      try {
        await updateUser(editingUser.id, editForm);
        setEditingUser(null);
        router.refresh();
      } catch (err) {
        alert(err instanceof Error ? err.message : "Failed to update user");
      }
    });
  };

  const handleDeleteUser = async (userId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this user? This action cannot be undone.",
      )
    ) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteUser(userId);
        router.refresh();
      } catch (err) {
        alert(err instanceof Error ? err.message : "Failed to delete user");
      }
    });
  };

  return (
    <>
      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="ADMIN">Admins</SelectItem>
                <SelectItem value="CUSTOMER">Customers</SelectItem>
                <SelectItem value="STUDENT">Students</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground mb-4">
        Showing {filteredUsers.length} of {initialUsers.length} users
      </p>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 font-medium">User</th>
                  <th className="text-left py-3 font-medium">Role</th>
                  <th className="text-left py-3 font-medium hidden md:table-cell">
                    Company
                  </th>
                  <th className="text-left py-3 font-medium">Stats</th>
                  <th className="text-left py-3 font-medium hidden md:table-cell">
                    Joined
                  </th>
                  <th className="text-right py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b last:border-0 hover:bg-muted/50"
                  >
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                          {user.role === "ADMIN" ? (
                            <Shield className="h-4 w-4 text-purple-500" />
                          ) : (
                            <UserIcon className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">
                            {user.name || "No name"}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 text-xs rounded ${roleColors[user.role]}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 hidden md:table-cell text-muted-foreground">
                      {user.company || "-"}
                    </td>
                    <td className="py-3">
                      <div className="text-xs space-y-0.5">
                        <p>{user._count.enrollments} enrollments</p>
                        <p>{user._count.clientProjects} projects</p>
                      </div>
                    </td>
                    <td className="py-3 hidden md:table-cell text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditDialog(user)}
                          disabled={isPending}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        {user.id !== currentUserId && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={isPending}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <p className="text-muted-foreground text-sm py-8 text-center">
                No users found matching your filters
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog
        open={!!editingUser}
        onOpenChange={(open) => !open && setEditingUser(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={editingUser?.email || ""} disabled />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="User's name"
              />
            </div>

            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={editForm.role}
                onValueChange={(value: UserRole) =>
                  setEditForm((prev) => ({ ...prev, role: value }))
                }
                disabled={editingUser?.id === currentUserId}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="CUSTOMER">Customer</SelectItem>
                  <SelectItem value="STUDENT">Student</SelectItem>
                </SelectContent>
              </Select>
              {editingUser?.id === currentUserId && (
                <p className="text-xs text-muted-foreground">
                  You cannot change your own role
                </p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={editForm.phone}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder="+234..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-location">Location</Label>
                <Input
                  id="edit-location"
                  value={editForm.location}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  placeholder="Lagos, Nigeria"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-company">Company</Label>
              <Input
                id="edit-company"
                value={editForm.company}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, company: e.target.value }))
                }
                placeholder="Company name"
              />
            </div>

            <Button
              onClick={handleUpdateUser}
              disabled={isPending}
              className="w-full"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
