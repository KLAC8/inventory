"use client";

import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CategoryManager() {
  const [categories, setCategories] = useState<any[]>([]);
  const [newCat, setNewCat] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  async function loadCategories() {
    const res = await fetch("/api/categories");
    if (res.ok) {
      const data = await res.json();
      setCategories(data);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  async function addCategory() {
    if (!newCat.trim()) return toast.error("Name cannot be empty");
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCat }),
    });
    if (res.ok) {
      toast.success("Category added");
      setNewCat("");
      loadCategories();
    } else {
      toast.error("Failed to add category");
    }
  }

  async function deleteCategory(id: string) {
    if (!confirm("Delete this category?")) return;
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Deleted");
      loadCategories();
    } else {
      toast.error("Failed to delete");
    }
  }

  async function updateCategory() {
    if (!editName.trim() || !editId) return toast.error("Invalid data");
    const res = await fetch(`/api/categories/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName }),
    });
    if (res.ok) {
      toast.success("Updated");
      setEditId(null);
      setEditName("");
      loadCategories();
    } else {
      toast.error("Failed to update");
    }
  }

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <input
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
          placeholder="New category"
          className="border p-2 rounded flex-grow"
        />
        <button className="bg-blue-600 text-white px-4 rounded" onClick={addCategory}>
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {categories.map((cat) => (
          <li key={cat._id} className="border p-3 rounded flex justify-between items-center">
            {editId === cat._id ? (
              <>
                <input
                  className="border p-1 rounded flex-grow"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
                <button className="text-green-600 px-3" onClick={updateCategory}>
                  Save
                </button>
                <button className="text-gray-600 px-3" onClick={() => setEditId(null)}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span>{cat.name}</span>
                <div className="flex gap-2">
                  <button className="text-blue-600" onClick={() => { setEditId(cat._id); setEditName(cat.name); }}>
                    Edit
                  </button>
                  <button className="text-red-600" onClick={() => deleteCategory(cat._id)}>
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
      <ToastContainer />
    </div>
  );
}
