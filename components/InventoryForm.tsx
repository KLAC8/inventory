"use client";

import { useState } from "react";
import { toast } from "react-toastify";

type Props = {
  category: string;
  userFullName: string;
};

export default function InventoryForm({ category, userFullName }: Props) {
  const [form, setForm] = useState({
    itemCode: "",
    name: "",
    totalQuantity: 1,
    unit: "pcs",
    acquiredDate: "",
    condition: "new",
    description: "",
    givenTo: "",
    givenBy: "",
  });

  async function handleAdd() {
    if (!form.name || !form.itemCode) {
      toast.error("Item name and code are required");
      return;
    }

    const res = await fetch(`/api/inventory/${category}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        createdBy: userFullName,
      }),
    });

    if (res.ok) {
      toast.success("Item added");
      setForm({
        itemCode: "",
        name: "",
        totalQuantity: 1,
        unit: "pcs",
        acquiredDate: "",
        condition: "new",
        description: "",
        givenTo: "",
        givenBy: "",
      });
    } else {
      toast.error("Failed to add item");
    }
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <input
          className="input-style"
          placeholder="Item Code"
          value={form.itemCode}
          onChange={(e) => setForm({ ...form, itemCode: e.target.value })}
        />
        <input
          className="input-style"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="input-style"
          placeholder="Qty"
          type="number"
          value={form.totalQuantity}
          onChange={(e) => setForm({ ...form, totalQuantity: +e.target.value })}
        />
        <input
          className="input-style"
          placeholder="Unit"
          value={form.unit}
          onChange={(e) => setForm({ ...form, unit: e.target.value })}
        />
        <input
          className="input-style"
          type="date"
          value={form.acquiredDate}
          onChange={(e) => setForm({ ...form, acquiredDate: e.target.value })}
        />
        <select
          className="input-style"
          value={form.condition}
          onChange={(e) => setForm({ ...form, condition: e.target.value })}
        >
          <option value="new">New</option>
          <option value="used">Used</option>
          <option value="damaged">Damaged</option>
        </select>
        <input
          className="input-style"
          placeholder="Given To (optional)"
          value={form.givenTo}
          onChange={(e) => setForm({ ...form, givenTo: e.target.value })}
        />
        <input
          className="input-style"
          placeholder="Given By (optional)"
          value={form.givenBy}
          onChange={(e) => setForm({ ...form, givenBy: e.target.value })}
        />
      </div>

      <textarea
        className="input-style w-full"
        rows={2}
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <button
        onClick={handleAdd}
        className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded transition"
      >
        Add Item
      </button>
    </div>
  );
}
