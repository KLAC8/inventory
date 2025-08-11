"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import InventoryTable from "../components/InventoryTable";
import InventoryForm from "../components/InventoryForm";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FolderIcon, PlusIcon, BarChart3Icon } from "lucide-react";

export default function DashboardPage() {
  const { user } = useUser();
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Used to force refresh InventoryTable
  const [refreshKey, setRefreshKey] = useState(0);
  // To store id h2 newly added item to highlight row
  const [newItemId, setNewItemId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then(setCategories);
  }, []);

  const addCategory = async () => {
    if (!newCategory.trim() || !user) return;
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCategory, createdBy: user.fullName }),
    });
    if (res.ok) {
      setCategories((prev) => [...prev, newCategory]);
      setNewCategory("");
      toast.success("Category added successfully");
    } else {
      toast.error("Failed to add category");
    }
  };

  // Callback when InventoryForm adds a new item
  const handleItemAdded = (id: string) => {
    setNewItemId(id);
    setRefreshKey((prev) => prev + 1);
    toast.success("Inventory item added and table refreshed");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden bg-white/70 backdrop-blur-xl border-b border-white/30 shadow-lg"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 via-teal-400/10 to-cyan-400/10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-emerald-300/20 to-teal-300/20 rounded-full blur-3xl -translate-y-1/2" />
        
        <div className="relative px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-7xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-3"
            >
              KLAC Inventory
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="w-24 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-full mx-auto mb-4"
            />
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col xl:flex-row gap-6">
            {/* Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full xl:w-80 shrink-0"
            >
              <div className="sticky top-6">
                {/* Categories Card */}
                <div className="relative group mb-6">
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
                  <div className="relative bg-white/80 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                        <FolderIcon className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-xl font-semibold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                        Categories
                      </h2>
                    </div>

                    {/* Add Category Form */}
                    <div className="space-y-3 mb-6">
                      <Input
                        placeholder="Enter category name..."
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="bg-white/70 border-slate-200 focus:border-emerald-400 focus:ring-emerald-400/20 transition-all duration-200"
                        onKeyDown={(e) => e.key === 'Enter' && addCategory()}
                      />
                      <Button
                        onClick={addCategory}
                        disabled={!newCategory.trim()}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-emerald-200 transition-all duration-200"
                      >
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Add Category
                      </Button>
                    </div>

                    {/* Categories List */}
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {categories.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">
                          <FolderIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <p className="text-sm">No categories yet</p>
                          <p className="text-xs">Add your first category above</p>
                        </div>
                      ) : (
                        categories.map((cat, index) => (
                          <motion.div
                            key={cat}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                          >
                            <button
                              onClick={() => setSelectedCategory(cat)}
                              className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 font-medium group ${
                                selectedCategory === cat
                                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg transform scale-[1.02]"
                                  : "bg-slate-100 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 text-slate-700 hover:text-slate-900 hover:shadow-md"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full transition-colors ${
                                  selectedCategory === cat ? "bg-white/80" : "bg-emerald-400"
                                }`} />
                                <span className="truncate">{cat}</span>
                              </div>
                            </button>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Stats Card */}
                {categories.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="relative group"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
                    <div className="relative bg-white/80 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-xl">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-lg flex items-center justify-center">
                          <BarChart3Icon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="font-semibold bg-gradient-to-r from-cyan-700 to-teal-700 bg-clip-text text-transparent">
                          Quick Stats
                        </h3>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Total Categories</span>
                          <span className="font-bold text-slate-800">{categories.length}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Selected</span>
                          <span className="font-bold text-emerald-600">
                            {selectedCategory || "None"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.aside>

            {/* Main Content Area */}
            <motion.section
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex-1 min-w-0"
            >
              {selectedCategory ? (
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-2xl blur-lg opacity-20 group-hover:opacity-25 transition-opacity duration-300" />
                  <div className="relative bg-white/80 backdrop-blur-xl border border-white/30 rounded-2xl shadow-xl overflow-hidden">
                    {/* Section Header */}
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 sm:px-8 py-6 border-b border-white/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                            {selectedCategory}
                          </h2>
                          <p className="text-slate-600 mt-1">
                            Manage inventory items in this category
                          </p>
                        </div>
                        <div className="hidden sm:flex w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl items-center justify-center">
                          <FolderIcon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 sm:p-8 space-y-8">
                      {/* Inventory Form */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                      >
                        <InventoryForm
                          category={selectedCategory}
                          userFullName={user?.fullName || ""}
                          onItemAdded={handleItemAdded}
                        />
                      </motion.div>

                      {/* Inventory Table */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                      >
                        <InventoryTable
                          key={refreshKey}
                          category={selectedCategory}
                          showCreatedBy
                          showQuantityDetails
                          itemsPerPage={10}
                          newItemId={newItemId}
                        />
                      </motion.div>
                    </div>
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="relative group"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-slate-200 to-slate-300 rounded-2xl blur-lg opacity-30" />
                  <div className="relative bg-white/80 backdrop-blur-xl border border-white/30 rounded-2xl p-12 sm:p-16 text-center shadow-xl">
                    <div className="max-w-md mx-auto">
                      <div className="w-20 h-20 bg-gradient-to-br from-slate-400 to-slate-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                        <FolderIcon className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-800 mb-4">
                        Select a Category
                      </h3>
                      <p className="text-slate-600 mb-8">
                        Choose a category from the sidebar to view and manage your inventory items.
                      </p>
                      {categories.length === 0 && (
                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200">
                          <p className="text-emerald-700 text-sm font-medium">
                            💡 Start by creating your first category in the sidebar
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.section>
          </div>
        </div>
      </main>
    </div>
  );
}