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
import {
  DownloadIcon,
  EyeIcon,
  Trash2,
  Trash2Icon,
  PencilIcon,
  XIcon,
  CheckIcon,
} from "lucide-react";
import InventoryViewModal from "./InventoryViewModal";
import { Dialog } from "@/components/ui/dialog";

interface InventoryItem {
  _id: string;
  itemCode: string;
  name: string;
  totalQuantity: number;
  taken: number;
  balance: number;
  unit: string;
  acquiredDate: string;
  condition: string;
  createdBy: string;
  takenHistory?: { takenBy: string; quantity: number; date: string }[];
}

interface Props {
  category: string;
  showCreatedBy?: boolean;
  showQuantityDetails?: boolean;
  itemsPerPage?: number;
  newItemId?: string | null;
}

export default function InventoryTable({
  category,
  showCreatedBy,
  showQuantityDetails,
  itemsPerPage = 10,
  newItemId: initialNewItemId = null,
}: Props) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<keyof InventoryItem | "">("");
  const [sortAsc, setSortAsc] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    itemId: null as string | null,
  });
  const [search, setSearch] = useState("");
  const [conditionFilter, setConditionFilter] = useState("");
  const [viewItem, setViewItem] = useState<InventoryItem | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [newItemId, setNewItemId] = useState<string | null>(initialNewItemId);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedTaken, setEditedTaken] = useState<number | null>(null);

  const fetchInventory = async () => {
    const res = await fetch(`/api/inventory/${category}`);
    const data = await res.json();
    setItems(data);
    toast.success("Inventory refreshed");
  };

  useEffect(() => {
    fetchInventory();
  }, [category]);

  const handleExportCSV = () => {
    const rows = [
      [
        "Item Code",
        "Name",
        "Total Quantity",
        "Taken",
        "Balance",
        "Unit",
        "Date",
        "Condition",
      ],
      ...items.map((i) => [
        i.itemCode,
        i.name,
        i.totalQuantity,
        i.taken,
        i.balance,
        i.unit,
        new Date(i.acquiredDate).toLocaleDateString(),
        i.condition,
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
      item.name?.toLowerCase().includes(search.toLowerCase()) &&
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

  const paginatedItems = sortedItems.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/inventory/item/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems(items.filter((i) => i._id !== id));
      toast.success("Item deleted");
    }
  };

  const handleEdit = async (id: string) => {
    const item = items.find((i) => i._id === id);
    if (!item || editedTaken === null) return;

    if (editedTaken > item.totalQuantity) {
      toast.error("Taken cannot exceed total quantity");
      return;
    }

    const newBalance = item.totalQuantity - editedTaken;
    const takenEntry = {
      takenBy: item.createdBy,
      quantity: editedTaken - item.taken,
      date: new Date().toISOString(),
    };

    const updatedValues: Partial<InventoryItem> = {
      taken: editedTaken,
      balance: newBalance,
      takenHistory: [...(item.takenHistory || []), takenEntry],
    };

    const res = await fetch(`/api/inventory/item/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedValues),
    });

    if (res.ok) {
      setItems((prev) =>
        prev.map((i) => (i._id === id ? { ...i, ...updatedValues } : i))
      );
      toast.success("Item updated");
      setEditingId(null);
      setEditedTaken(null);
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
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
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
              <TableHead onClick={() => toggleSort("itemCode")}>Code</TableHead>
              <TableHead onClick={() => toggleSort("name")}>Name</TableHead>
              {showQuantityDetails && (
                <>
                  <TableHead>Total</TableHead>
                  <TableHead>Taken</TableHead>
                  <TableHead>Balance</TableHead>
                </>
              )}
              <TableHead>Unit</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Condition</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedItems.map((item) => {
              const isNew = item._id === newItemId;
              const isEditing = editingId === item._id;
              return (
                <motion.tr
                  key={item._id}
                  initial={{ backgroundColor: isNew ? "#d1fae5" : "transparent" }}
                  animate={{ backgroundColor: "transparent" }}
                  transition={{ duration: 3 }}
                  className="transition hover:bg-muted/50"
                >
                  <TableCell>{item.itemCode ?? ""}</TableCell>
                  <TableCell>
                    <Input
                      value={item.name ?? ""}
                      onChange={(e) =>
                        setItems((prev) =>
                          prev.map((i) =>
                            i._id === item._id
                              ? { ...i, name: e.target.value }
                              : i
                          )
                        )
                      }
                      className="w-[180px]"
                    />
                  </TableCell>
                  {showQuantityDetails && (
                    <>
                      <TableCell>{item.totalQuantity ?? 0}</TableCell>
                      <TableCell>
                        {isEditing ? (
                          <Input
                            type="number"
                            value={editedTaken ?? item.taken ?? 0}
                            onChange={(e) =>
                              setEditedTaken(Number(e.target.value))
                            }
                            className="w-[80px]"
                          />
                        ) : (
                          item.taken ?? 0
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditing
                          ? item.totalQuantity -
                            (editedTaken ?? item.taken ?? 0)
                          : item.balance ?? 0}
                      </TableCell>
                    </>
                  )}
                  <TableCell>{item.unit ?? ""}</TableCell>
                  <TableCell>
                    {item.acquiredDate
                      ? new Date(item.acquiredDate).toLocaleDateString()
                      : ""}
                  </TableCell>
                  <TableCell>{item.condition ?? ""}</TableCell>
                  <TableCell className="space-x-2 flex items-center">
                    {isEditing ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(item._id)}
                        >
                          <CheckIcon size={14} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingId(null);
                            setEditedTaken(null);
                          }}
                        >
                          <XIcon size={14} />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingId(item._id);
                            setEditedTaken(item.taken ?? 0);
                          }}
                        >
                          <PencilIcon size={14} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setViewItem(item);
                            setViewModalOpen(true);
                          }}
                        >
                          <EyeIcon size={14} />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            setConfirmDialog({ open: true, itemId: item._id })
                          }
                        >
                          <Trash2Icon />
                        </Button>
                      </>
                    )}
                  </TableCell>
                </motion.tr>
              );
            })}
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
        <Dialog
          open={true}
          onOpenChange={(open) => setConfirmDialog({ open, itemId: null })}
        >
          <div className="bg-white dark:bg-gray-900 p-4 rounded shadow-md">
            <h2 className="text-lg font-semibold mb-2">Confirm Delete</h2>
            <p className="mb-4">Are you sure you want to delete this item?</p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setConfirmDialog({ open: false, itemId: null })}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (confirmDialog.itemId) handleDelete(confirmDialog.itemId);
                  setConfirmDialog({ open: false, itemId: null });
                }}
              >
                <Trash2 />
              </Button>
            </div>
          </div>
        </Dialog>
      )}

      <InventoryViewModal
        item={viewItem}
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
      />
    </div>
  );
}
