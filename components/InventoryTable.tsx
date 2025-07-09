// components/InventoryTable.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Dialog } from "@/components/ui/dialog";
import { DownloadIcon, FilterIcon } from "lucide-react";

interface InventoryItem {
  _id: string;
  itemCode: string;
  name: string;
  totalQuantity: number;
  balance: number;
  unit: string;
  acquiredDate: string;
  condition: string;
  createdBy: string;
}

interface Props {
  category: string;
  showCreatedBy?: boolean;
  showQuantityDetails?: boolean;
  itemsPerPage?: number;
}

export default function InventoryTable({ category, showCreatedBy, showQuantityDetails, itemsPerPage = 10 }: Props) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<keyof InventoryItem | "">("");
  const [sortAsc, setSortAsc] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; itemId: string | null }>({ open: false, itemId: null });
  const [search, setSearch] = useState("");
  const [conditionFilter, setConditionFilter] = useState("");

  useEffect(() => {
    fetch(`/api/inventory/${category}`)
      .then((res) => res.json())
      .then(setItems);
  }, [category]);

  const handleExportCSV = () => {
    const rows = [
      ["Item Code", "Name", "Total Quantity", "Balance", "Unit", "Date", "Condition", "Created By"],
      ...items.map((i) => [
        i.itemCode,
        i.name,
        i.totalQuantity,
        i.balance,
        i.unit,
        new Date(i.acquiredDate).toLocaleDateString(),
        i.condition,
        i.createdBy,
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${category}_inventory.csv`;
    a.click();
  };

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) &&
      (!conditionFilter || item.condition === conditionFilter)
  );

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    return sortAsc
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });

  const paginatedItems = sortedItems.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/inventory/item/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems(items.filter((i) => i._id !== id));
      toast.success("Item deleted");
    }
  };

  const handleEdit = async (id: string, key: keyof InventoryItem, value: any) => {
    const res = await fetch(`/api/inventory/item/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [key]: value }),
    });
    if (res.ok) {
      setItems(items.map((i) => (i._id === id ? { ...i, [key]: value } : i)));
    }
  };

  const toggleSort = (key: keyof InventoryItem) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex gap-2 w-full md:w-auto">
          <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <select
            className="border rounded px-2 py-1 dark:bg-gray-900"
            value={conditionFilter}
            onChange={(e) => setConditionFilter(e.target.value)}
          >
            <option value="">All Conditions</option>
            <option value="new">New</option>
            <option value="used">Used</option>
            <option value="damaged">Damaged</option>
          </select>
        </div>
        <Button onClick={handleExportCSV} className="flex items-center gap-1">
          <DownloadIcon size={16} /> Export CSV
        </Button>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("itemCode")}>Code</TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("name")}>Name</TableHead>
              {showQuantityDetails && (
                <>
                  <TableHead>Total</TableHead>
                  <TableHead>Balance</TableHead>
                </>
              )}
              <TableHead>Unit</TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("acquiredDate")}>Date</TableHead>
              <TableHead>Condition</TableHead>
              {showCreatedBy && <TableHead>Added By</TableHead>}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedItems.map((item) => (
              <TableRow
                key={item._id}
                className="transition hover:bg-muted/50"
              >
                <TableCell>{item.itemCode}</TableCell>
                <TableCell>
                  <Input
                    value={item.name}
                    onChange={(e) => handleEdit(item._id, "name", e.target.value)}
                  />
                </TableCell>
                {showQuantityDetails && (
                  <>
                    <TableCell>{item.totalQuantity}</TableCell>
                    <TableCell>{item.balance}</TableCell>
                  </>
                )}
                <TableCell>{item.unit}</TableCell>
                <TableCell>{new Date(item.acquiredDate).toLocaleDateString()}</TableCell>
                <TableCell>{item.condition}</TableCell>
                {showCreatedBy && <TableCell>{item.createdBy}</TableCell>}
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setConfirmDialog({ open: true, itemId: item._id })}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              variant={i + 1 === page ? "default" : "outline"}
              onClick={() => setPage(i + 1)}
              size="sm"
            >
              {i + 1}
            </Button>
          ))}
        </div>
      )}

      {confirmDialog.open && confirmDialog.itemId && (
        <Dialog open={true} onOpenChange={(open) => setConfirmDialog({ open, itemId: null })}>
          <div className="bg-white dark:bg-gray-900 p-4 rounded shadow-md">
            <h2 className="text-lg font-semibold mb-2">Confirm Delete</h2>
            <p className="mb-4">Are you sure you want to delete this item?</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setConfirmDialog({ open: false, itemId: null })}>Cancel</Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (confirmDialog.itemId) handleDelete(confirmDialog.itemId);
                  setConfirmDialog({ open: false, itemId: null });
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}
