"use client";

import { useEffect, useState, useCallback } from "react";
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
import { motion, AnimatePresence } from "framer-motion";
import {
  DownloadIcon,
  EyeIcon,
  Trash2,
  PencilIcon,
  XIcon,
  CheckIcon,
  SearchIcon,
  FilterIcon,
  RefreshCwIcon,
  SortAscIcon,
  SortDescIcon,
  PackageIcon,
  AlertTriangleIcon,
} from "lucide-react";
import InventoryViewModal from "./InventoryViewModal";


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
  const [newItemId] = useState<string | null>(initialNewItemId);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedTaken, setEditedTaken] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/inventory/${category}`);
      const data = await res.json();
      setItems(data);
      toast.success("Inventory refreshed");
    } catch (error) {
      toast.error("Failed to fetch inventory");
      console.log(error)
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

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
      ...filteredItems.map((i) => [
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
    toast.success("CSV exported successfully");
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
      toast.success("Item deleted successfully");
    } else {
      toast.error("Failed to delete item");
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
      toast.success("Item updated successfully");
      setEditingId(null);
      setEditedTaken(null);
    } else {
      toast.error("Failed to update item");
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

  const getSortIcon = (key: keyof InventoryItem) => {
    if (sortKey !== key) return null;
    return sortAsc ? <SortAscIcon size={14} /> : <SortDescIcon size={14} />;
  };

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'new': return 'text-emerald-600 bg-emerald-50';
      case 'used': return 'text-amber-600 bg-amber-50';
      case 'damaged': return 'text-red-600 bg-red-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  const getStockStatus = (balance: number, total: number) => {
    const percentage = (balance / total) * 100;
    if (percentage <= 10) return { color: 'text-red-600 bg-red-50', icon: AlertTriangleIcon, label: 'Critical' };
    if (percentage <= 25) return { color: 'text-amber-600 bg-amber-50', icon: AlertTriangleIcon, label: 'Low' };
    return { color: 'text-emerald-600 bg-emerald-50', icon: PackageIcon, label: 'Good' };
  };

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200"
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
              <PackageIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                Inventory Items
              </h3>
              <p className="text-sm text-slate-600">
                {filteredItems.length} of {items.length} items
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            {/* Search */}
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
              <Input
                placeholder="Search items..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-white/70 border-slate-200 focus:border-emerald-400 focus:ring-emerald-400/20 min-w-[200px]"
              />
            </div>

            {/* Condition Filter */}
            <div className="relative">
              <FilterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
              <select
                className="pl-10 pr-8 py-2 border border-slate-200 rounded-lg bg-white/70 focus:border-emerald-400 focus:ring-emerald-400/20 focus:outline-none transition-all min-w-[140px]"
                value={conditionFilter}
                onChange={(e) => setConditionFilter(e.target.value)}
              >
                <option value="">All Conditions</option>
                <option value="new">New</option>
                <option value="used">Used</option>
                <option value="damaged">Damaged</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={fetchInventory}
                disabled={loading}
                className="border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300"
              >
                <RefreshCwIcon size={16} className={loading ? "animate-spin" : ""} />
              </Button>
              <Button
                onClick={handleExportCSV}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg"
              >
                <DownloadIcon size={16} className="mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Table Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative group"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400/20 via-teal-400/20 to-cyan-400/20 rounded-2xl blur-lg opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative bg-white/80 backdrop-blur-xl border border-white/30 rounded-2xl overflow-hidden shadow-xl">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-16">
              <PackageIcon className="w-16 h-16 mx-auto mb-4 text-slate-300" />
              <h3 className="text-lg font-semibold text-slate-600 mb-2">No items found</h3>
              <p className="text-slate-500">
                {search || conditionFilter ? "Try adjusting your search or filters" : "Add your first inventory item"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 border-b border-slate-200">
                    <TableHead 
                      className="cursor-pointer hover:bg-emerald-50 transition-colors font-semibold"
                      onClick={() => toggleSort("itemCode")}
                    >
                      <div className="flex items-center gap-2">
                        Code
                        {getSortIcon("itemCode")}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-emerald-50 transition-colors font-semibold"
                      onClick={() => toggleSort("name")}
                    >
                      <div className="flex items-center gap-2">
                        Name
                        {getSortIcon("name")}
                      </div>
                    </TableHead>
                    {showQuantityDetails && (
                      <>
                        <TableHead className="font-semibold">Total</TableHead>
                        <TableHead className="font-semibold">Taken</TableHead>
                        <TableHead className="font-semibold">
                          <div className="flex items-center gap-2">
                            Balance
                            <PackageIcon size={14} className="text-emerald-500" />
                          </div>
                        </TableHead>
                      </>
                    )}
                    <TableHead className="font-semibold">Unit</TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-emerald-50 transition-colors font-semibold"
                      onClick={() => toggleSort("acquiredDate")}
                    >
                      <div className="flex items-center gap-2">
                        Date
                        {getSortIcon("acquiredDate")}
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold">Condition</TableHead>
                    <TableHead className="font-semibold text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {paginatedItems.map((item, index) => {
                      const isNew = item._id === newItemId;
                      const isEditing = editingId === item._id;
                      const stockStatus = getStockStatus(item.balance ?? 0, item.totalQuantity ?? 0);
                      
                      return (
                        <motion.tr
                          key={item._id}
                          initial={{ opacity: 0, y: 20, backgroundColor: isNew ? "#d1fae5" : "transparent" }}
                          animate={{ opacity: 1, y: 0, backgroundColor: "transparent" }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ 
                            duration: isNew ? 3 : 0.3, 
                            delay: index * 0.1,
                            backgroundColor: { duration: isNew ? 3 : 0 }
                          }}
                          className="group hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-teal-50/50 transition-all duration-200 border-b border-slate-100"
                        >
                          <TableCell className="font-mono text-sm">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400"></span>
                              {item.itemCode ?? "—"}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {isEditing ? (
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
                                className="min-w-[200px] bg-white/70 border-emerald-200 focus:border-emerald-400"
                              />
                            ) : (
                              <span className="text-slate-800">{item.name ?? "—"}</span>
                            )}
                          </TableCell>
                          {showQuantityDetails && (
                            <>
                              <TableCell>
                                <span className="font-semibold text-slate-700">
                                  {item.totalQuantity ?? 0}
                                </span>
                              </TableCell>
                              <TableCell>
                                {isEditing ? (
                                  <Input
                                    type="number"
                                    value={editedTaken ?? item.taken ?? 0}
                                    onChange={(e) =>
                                      setEditedTaken(Number(e.target.value))
                                    }
                                    className="w-20 bg-white/70 border-emerald-200 focus:border-emerald-400"
                                  />
                                ) : (
                                  <span className="font-medium text-amber-600">
                                    {item.taken ?? 0}
                                  </span>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                                    {isEditing
                                      ? item.totalQuantity - (editedTaken ?? item.taken ?? 0)
                                      : item.balance ?? 0}
                                  </span>
                                  <stockStatus.icon size={14} className={stockStatus.color.split(' ')[0]} />
                                </div>
                              </TableCell>
                            </>
                          )}
                          <TableCell>
                            <span className="text-slate-600 text-sm">
                              {item.unit ?? "—"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-slate-600 text-sm">
                              {item.acquiredDate
                                ? new Date(item.acquiredDate).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })
                                : "—"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getConditionColor(item.condition ?? "")}`}>
                              {item.condition ?? "—"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-2">
                              {isEditing ? (
                                <motion.div 
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="flex gap-1"
                                >
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEdit(item._id)}
                                    className="border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 text-emerald-600"
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
                                    className="border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-600"
                                  >
                                    <XIcon size={14} />
                                  </Button>
                                </motion.div>
                              ) : (
                                <motion.div 
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                >
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setEditingId(item._id);
                                      setEditedTaken(item.taken ?? 0);
                                    }}
                                    className="border-blue-200 hover:bg-blue-50 hover:border-blue-300 text-blue-600"
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
                                    className="border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 text-emerald-600"
                                  >
                                    <EyeIcon size={14} />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      setConfirmDialog({ open: true, itemId: item._id })
                                    }
                                    className="border-red-200 hover:bg-red-50 hover:border-red-300 text-red-600"
                                  >
                                    <Trash2 size={14} />
                                  </Button>
                                </motion.div>
                              )}
                            </div>
                          </TableCell>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/60 backdrop-blur-lg rounded-xl p-4 border border-white/30"
        >
          <div className="text-sm text-slate-600">
            Showing {((page - 1) * itemsPerPage) + 1} to {Math.min(page * itemsPerPage, sortedItems.length)} of {sortedItems.length} items
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="border-emerald-200 hover:bg-emerald-50"
            >
              Previous
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
              return (
                <Button
                  key={pageNum}
                  variant={pageNum === page ? "default" : "outline"}
                  onClick={() => setPage(pageNum)}
                  size="sm"
                  className={pageNum === page 
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg" 
                    : "border-emerald-200 hover:bg-emerald-50"
                  }
                >
                  {pageNum}
                </Button>
              );
            })}
            <Button
              variant="outline"
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="border-emerald-200 hover:bg-emerald-50"
            >
              Next
            </Button>
          </div>
        </motion.div>
      )}

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {confirmDialog.open && confirmDialog.itemId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setConfirmDialog({ open: false, itemId: null })}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-2xl max-w-md w-full border border-white/30"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                  <AlertTriangleIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">Delete Item</h3>
                  <p className="text-slate-600 text-sm">This action cannot be undone</p>
                </div>
              </div>
              <p className="text-slate-600 mb-6">
                Are you sure you want to delete this inventory item? All associated data will be permanently removed.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setConfirmDialog({ open: false, itemId: null })}
                  className="flex-1 border-slate-200 hover:bg-slate-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (confirmDialog.itemId) handleDelete(confirmDialog.itemId);
                    setConfirmDialog({ open: false, itemId: null });
                  }}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                >
                  <Trash2 size={16} className="mr-2" />
                  Delete
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Modal */}
      <InventoryViewModal
        item={viewItem}
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
      />
    </div>
  );
}