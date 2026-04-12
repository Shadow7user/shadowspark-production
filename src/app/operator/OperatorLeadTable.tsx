"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader } from "@/components/ui/table";

export type OperatorLead = {
  id: string;
  name: string;
  business: string;
  status: "New" | "Paid" | "Demo Generated" | "Approved" | "Rejected";
  demoSlug: string | null;
};

function statusClasses(status: OperatorLead["status"]) {
  if (status === "Approved") return "border-green-400/20 bg-green-400/10 text-green-300";
  if (status === "Demo Generated") return "border-cyan-400/20 bg-cyan-400/10 text-cyan-300";
  if (status === "Paid") return "border-sky-400/20 bg-sky-400/10 text-sky-300";
  if (status === "Rejected") return "border-red-400/20 bg-red-400/10 text-red-300";
  return "border-zinc-700 bg-zinc-900 text-zinc-300";
}

export default function OperatorLeadTable({ data }: { data: OperatorLead[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<OperatorLead[]>(data);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function updateLead(leadId: string, action: "approve" | "reject") {
    setBusyId(leadId);
    try {
      const response = await fetch(`/api/operator/${action}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId }),
      });

      const result = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(result?.error || `${action} failed`);
      }

      setRows((current) =>
        current.map((row) =>
          row.id === leadId
            ? { ...row, status: action === "approve" ? "Approved" : "Rejected" }
            : row
        )
      );
    } finally {
      setBusyId(null);
    }
  }

  const columns = useMemo<ColumnDef<OperatorLead>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "business",
        header: "Business",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <span
            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${statusClasses(
              row.original.status
            )}`}
          >
            {row.original.status}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-2">
            {row.original.demoSlug ? (
              <Link
                href={`/demo/${row.original.demoSlug}`}
                className="rounded-full border border-zinc-700 px-3 py-2 text-xs font-semibold text-zinc-200 transition hover:border-cyan-400/50 hover:text-cyan-300"
              >
                View Demo
              </Link>
            ) : null}
            <button
              type="button"
              disabled={busyId === row.original.id}
              onClick={() => updateLead(row.original.id, "approve")}
              className="rounded-full bg-cyan-400 px-3 py-2 text-xs font-bold text-black transition hover:brightness-110 disabled:opacity-50"
            >
              Approve
            </button>
            <button
              type="button"
              disabled={busyId === row.original.id}
              onClick={() => updateLead(row.original.id, "reject")}
              className="rounded-full border border-red-400/30 bg-red-400/10 px-3 py-2 text-xs font-bold text-red-300 transition hover:bg-red-400/20 disabled:opacity-50"
            >
              Reject
            </button>
          </div>
        ),
      },
    ],
    [busyId]
  );

  const table = useReactTable({
    data: rows,
    columns,
    state: {
      sorting,
      globalFilter: search,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setSearch,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, _columnId, value) => {
      const haystack = `${row.original.name} ${row.original.business} ${row.original.status}`.toLowerCase();
      return haystack.includes(String(value).toLowerCase());
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 rounded-[1.5rem] border border-zinc-800 bg-zinc-950/90 p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-mono uppercase tracking-[0.22em] text-cyan-300">Lead Command Grid</p>
          <p className="mt-2 text-sm text-zinc-400">Search, sort, and act on active pipeline records.</p>
        </div>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search leads..."
          className="w-full rounded-full border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400 md:max-w-xs"
        />
      </div>

      <div className="overflow-hidden rounded-[1.75rem] border border-zinc-800 bg-zinc-950">
        <Table>
          <TableHeader className="bg-zinc-900/60">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-zinc-800">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="px-6 py-4 text-[10px] uppercase tracking-[0.18em] text-zinc-500"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </tr>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row, index) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.03 }}
                  className="border-b border-zinc-900 transition-colors hover:bg-zinc-900/40"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-6 py-5">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </motion.tr>
              ))
            ) : (
              <tr>
                <TableCell colSpan={columns.length} className="h-24 text-center text-zinc-500">
                  No matching leads.
                </TableCell>
              </tr>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
