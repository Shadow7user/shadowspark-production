"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

export type Lead = {
  id: string;
  phoneNumber: string;
  status: string;
  intent: string | null;
  leadScore: number | null;
  createdAt: Date;
};

export const columns: ColumnDef<Lead>[] = [
  {
    accessorKey: "phoneNumber",
    header: "Lead",
    cell: ({ row }) => <span className="font-mono">{row.getValue("phoneNumber")}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant="outline" className={
          status === 'PAID' ? 'text-green-400 border-green-400/20' : 
          status === 'QUALIFIED' ? 'text-cyan-400 border-cyan-400/20' : 
          'text-zinc-500 border-zinc-800'
        }>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "intent",
    header: "Intent",
  },
  {
    accessorKey: "leadScore",
    header: "Score",
    cell: ({ row }) => <span className="font-bold">{row.getValue("leadScore") || 0}</span>,
  },
  {
    accessorKey: "createdAt",
    header: "Timestamp",
    cell: ({ row }) => {
      return new Date(row.getValue("createdAt")).toLocaleDateString();
    },
  },
];
