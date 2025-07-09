// components/InventoryForm.tsx
"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface Props {
  category: string;
  userFullName: string;
}

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

  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  async function handleAdd() {
    const requiredFields = [
      "itemCode",
      "name",
      "totalQuantity",
      "unit",
      "acquiredDate",
      "condition",
      "description",
      "givenTo",
      "givenBy",
    ];

    const newErrors: { [key: string]: boolean } = {};
    let hasError = false;

    requiredFields.forEach((field) => {
      if (
        form[field as keyof typeof form] === "" ||
        form[field as keyof typeof form] === null ||
        form[field as keyof typeof form] === undefined
      ) {
        newErrors[field] = true;
        hasError = true;
      }
    });

    if (hasError) {
      setErrors(newErrors);
      toast.error("Please fill in all required fields.");
      return;
    }

    setErrors({});

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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 bg-muted/20 p-4 rounded-xl"
    >
      <h2 className="text-xl font-semibold text-center">Add New Inventory Item</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { name: "itemCode", placeholder: "Item Code *" },
          { name: "name", placeholder: "Name *" },
          { name: "totalQuantity", placeholder: "Qty", type: "number" },
          { name: "unit", placeholder: "Unit" },
          { name: "acquiredDate", placeholder: "Date", type: "date" },
          { name: "givenTo", placeholder: "Given To" },
          { name: "givenBy", placeholder: "Given By" },
        ].map((field) => (
          <div key={field.name}>
            <Input
              type={field.type || "text"}
              placeholder={field.placeholder}
              value={form[field.name as keyof typeof form] as string | number}
              onChange={(e) =>
                setForm({
                  ...form,
                  [field.name]: field.type === "number" ? +e.target.value : e.target.value,
                })
              }
              className={errors[field.name] ? "border-red-500" : ""}
            />
            {errors[field.name] && (
              <p className="text-red-500 text-sm">Required</p>
            )}
          </div>
        ))}

        <div className="col-span-2 md:col-span-1">
          <select
            className={`w-full border rounded px-3 py-2 dark:bg-gray-800 ${
              errors.condition ? "border-red-500" : ""
            }`}
            value={form.condition}
            onChange={(e) => setForm({ ...form, condition: e.target.value })}
          >
            <option value="">Select Condition</option>
            <option value="new">New</option>
            <option value="used">Used</option>
            <option value="damaged">Damaged</option>
          </select>
          {errors.condition && (
            <p className="text-red-500 text-sm">Required</p>
          )}
        </div>
      </div>

      <div>
        <textarea
          className={`w-full border rounded p-2 dark:bg-gray-800 ${
            errors.description ? "border-red-500" : ""
          }`}
          rows={2}
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        {errors.description && (
          <p className="text-red-500 text-sm">Required</p>
        )}
      </div>

      <Button onClick={handleAdd} className="w-full md:w-auto">
        Add Item
      </Button>
    </motion.div>
  );
}
