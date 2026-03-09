
import { Role } from "@prisma/client";
import { Session } from "next-auth";

// Define a type for a user object that includes the role
export type UserWithRole = {
  role: Role;
};

// A map defining the permissions for each role
const permissions: Record<Role, Set<string>> = {
  USER: new Set([
    "transaction:create",
    "transaction:view:own",
    "account:view:own",
  ]),
  SUPPORT: new Set([
    "transaction:view:all",
    "account:view:all",
    "user:view:all",
  ]),
  FINANCE: new Set([
    "transaction:create",
    "transaction:view:all",
    "ledger:view:all",
    "payment:refund",
  ]),
  ADMIN: new Set([
    "transaction:create",
    "transaction:view:all",
    "ledger:view:all",
    "payment:refund",
    "user:manage:all",
    "system:config:manage",
  ]),
};

/**
 * Checks if a user has a specific permission.
 *
 * @param user - The user object (or session.user)
 * @param permission - The permission string to check for.
 * @returns True if the user has the permission, false otherwise.
 */
function hasPermission(user: UserWithRole | null | undefined, permission: string): boolean {
  if (!user || !user.role) {
    return false;
  }
  const userPermissions = permissions[user.role];
  if (!userPermissions) {
    return false;
  }
  // Admins have all permissions implicitly
  if (user.role === "ADMIN") {
    return true;
  }
  return userPermissions.has(permission);
}

// --- High-level Permission Check Functions ---

export const canCreateTransaction = (user: UserWithRole) =>
  hasPermission(user, "transaction:create");

export const canViewLedger = (user: UserWithRole) =>
  hasPermission(user, "ledger:view:all");

export const canRefundPayment = (user: UserWithRole) =>
  hasPermission(user, "payment:refund");

export const canManageUsers = (user: UserWithRole) =>
  hasPermission(user, "user:manage:all");

// --- Example of a more complex permission check ---

// In a real app, you would pass the objects themselves to check ownership
export const canViewTransaction = (
  user: UserWithRole,
  transactionOwnerId: string,
  sessionUserId: string
) => {
  if (hasPermission(user, "transaction:view:all")) {
    return true;
  }
  if (hasPermission(user, "transaction:view:own")) {
    return transactionOwnerId === sessionUserId;
  }
  return false;
};
