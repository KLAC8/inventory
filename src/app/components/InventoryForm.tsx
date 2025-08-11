"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusCircleIcon,
  PackageIcon,
  CalendarIcon,
  UserIcon,
  ClipboardListIcon,
  HashIcon,
  SparklesIcon,
  CheckCircleIcon,
  AlertCircleIcon,
} from "lucide-react";

interface Props {
  category: string;
  userFullName: string;
  onItemAdded?: (newItemId: string) => void;
}

export default function InventoryForm({
  category,
  userFullName,
  onItemAdded,
}: Props) {
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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/inventory/${category}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          createdBy: userFullName,
        }),
      });

      if (res.ok) {
        const newItem = await res.json();
        
        toast.success("Item added successfully!");
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

        if (newItem._id) {
          onItemAdded?.(newItem._id);
        }
      } else {
        toast.error("Failed to add item");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error)
    } finally {
      setIsSubmitting(false);
    }
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new': return 'from-emerald-500 to-teal-500';
      case 'used': return 'from-amber-500 to-orange-500';
      case 'damaged': return 'from-red-500 to-red-600';
      default: return 'from-slate-400 to-slate-500';
    }
  };

  const formFields = [
    {
      name: "itemCode",
      placeholder: "Item Code *",
      icon: HashIcon,
      colSpan: "col-span-1 sm:col-span-1",
    },
    {
      name: "name",
      placeholder: "Item Name *",
      icon: PackageIcon,
      colSpan: "col-span-1 sm:col-span-2",
    },
    {
      name: "totalQuantity",
      placeholder: "Quantity *",
      type: "number",
      icon: ClipboardListIcon,
      colSpan: "col-span-1 sm:col-span-1",
    },
    {
      name: "unit",
      placeholder: "Unit (pcs, kg, etc) *",
      icon: SparklesIcon,
      colSpan: "col-span-1 sm:col-span-1",
    },
    {
      name: "acquiredDate",
      placeholder: "Acquired Date *",
      type: "date",
      icon: CalendarIcon,
      colSpan: "col-span-1 sm:col-span-1",
    },
    {
      name: "givenTo",
      placeholder: "Given To *",
      icon: UserIcon,
      colSpan: "col-span-1 sm:col-span-1",
    },
    {
      name: "givenBy",
      placeholder: "Given By *",
      icon: UserIcon,
      colSpan: "col-span-1 sm:col-span-1",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative group"
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400/20 via-teal-400/20 to-cyan-400/20 rounded-2xl blur-lg opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative bg-white/80 backdrop-blur-xl border border-white/30 rounded-2xl overflow-hidden shadow-xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 border-b border-emerald-200">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg"
            >
              <PlusCircleIcon className="w-6 h-6 text-white" />
            </motion.div>
            
            <div>
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent"
              >
                Add New Inventory Item
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-sm text-slate-600 mt-1"
              >
                Fill in the details below to add a new item to your {category} inventory
              </motion.p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Form Fields Grid */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {formFields.map((field, index) => {
              const IconComponent = field.icon;
              return (
                <motion.div
                  key={field.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                  className={field.colSpan}
                >
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IconComponent 
                        size={18} 
                        className={`transition-colors duration-200 ${
                          errors[field.name] 
                            ? 'text-red-400' 
                            : 'text-slate-400 group-focus-within:text-emerald-500'
                        }`} 
                      />
                    </div>
                    <Input
                      type={field.type || "text"}
                      placeholder={field.placeholder}
                      value={form[field.name as keyof typeof form] as string | number}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          [field.name]:
                            field.type === "number" ? +e.target.value : e.target.value,
                        })
                      }
                      className={`pl-10 bg-white/70 border-slate-200 focus:border-emerald-400 focus:ring-emerald-400/20 transition-all duration-200 ${
                        errors[field.name] ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''
                      }`}
                    />
                    <AnimatePresence>
                      {errors[field.name] && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.9 }}
                          className="flex items-center gap-1 mt-1"
                        >
                          <AlertCircleIcon size={14} className="text-red-500" />
                          <span className="text-red-500 text-xs">This field is required</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}

            {/* Condition Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 + formFields.length * 0.1 }}
              className="col-span-1 sm:col-span-1"
            >
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getConditionColor(form.condition)}`} />
                </div>
                <select
                  className={`w-full pl-10 pr-8 py-2.5 border border-slate-200 rounded-lg bg-white/70 focus:border-emerald-400 focus:ring-emerald-400/20 focus:outline-none transition-all duration-200 text-sm ${
                    errors.condition ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''
                  }`}
                  value={form.condition}
                  onChange={(e) => setForm({ ...form, condition: e.target.value })}
                >
                  <option value="">Select Condition *</option>
                  <option value="new">New</option>
                  <option value="used">Used</option>
                  <option value="damaged">Damaged</option>
                </select>
                <AnimatePresence>
                  {errors.condition && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.9 }}
                      className="flex items-center gap-1 mt-1"
                    >
                      <AlertCircleIcon size={14} className="text-red-500" />
                      <span className="text-red-500 text-xs">Please select a condition</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.8 }}
            className="space-y-2"
          >
            <div className="relative group">
              <div className="absolute top-3 left-3 pointer-events-none">
                <ClipboardListIcon 
                  size={18} 
                  className={`transition-colors duration-200 ${
                    errors.description 
                      ? 'text-red-400' 
                      : 'text-slate-400 group-focus-within:text-emerald-500'
                  }`} 
                />
              </div>
              <textarea
                className={`w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg bg-white/70 focus:border-emerald-400 focus:ring-emerald-400/20 focus:outline-none transition-all duration-200 resize-none ${
                  errors.description ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''
                }`}
                rows={3}
                placeholder="Description (details about the item) *"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
              <AnimatePresence>
                {errors.description && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.9 }}
                    className="flex items-center gap-1 mt-1"
                  >
                    <AlertCircleIcon size={14} className="text-red-500" />
                    <span className="text-red-500 text-xs">Please provide a description</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.9 }}
            className="flex justify-end pt-4 border-t border-slate-200"
          >
            <Button
              onClick={handleAdd}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 px-8 py-2.5 font-semibold"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Adding...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CheckCircleIcon size={18} />
                  <span>Add Item</span>
                </div>
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}