"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useUser } from "@clerk/nextjs";
import InventoryTable from "../components/InventoryTable";
import InventoryForm from "../components/InventoryForm";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { user } = useUser();
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Used to force refresh InventoryTable
  const [refreshKey, setRefreshKey] = useState(0);
  // To store id of newly added item to highlight row
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
      toast.success("Category added");
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
    <main className="px-4 py-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
        Kelaa LAC Inventory Dashboard
      </h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full lg:w-1/4 bg-white dark:bg-gray-900 shadow-md rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Categories</h2>

          <div className="flex gap-2 mb-4">
            <Input
              placeholder="New category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <Button onClick={addCategory}>Add</Button>
          </div>

          <ul className="space-y-2">
            {categories.map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition font-medium ${
                    selectedCategory === cat
                      ? "bg-blue-400 text-white"
                      : "bg-gray-100 dark:bg-gray-800 hover:bg-indigo-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
                  }`}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Inventory Form & Table */}
        <section className="w-full lg:w-3/4 bg-white dark:bg-gray-900 shadow-md rounded-lg p-4">
          {selectedCategory ? (
            <>
              <InventoryForm
                category={selectedCategory}
                userFullName={user?.fullName || ""}
                onItemAdded={handleItemAdded} // pass callback here
              />
              <div className="mt-6">
                <InventoryTable
                  key={refreshKey} // force re-render on refreshKey change
                  category={selectedCategory}
                  showCreatedBy
                  showQuantityDetails
                  itemsPerPage={10}
                  newItemId={newItemId} // pass new item id to highlight
                />
              </div>
            </>
          ) : (
            <p className="text-gray-600 dark:text-gray-300">Select a category to view inventory.</p>
          )}
        </section>
      </div>
    </main>
  );
}
