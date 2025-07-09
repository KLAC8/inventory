"use client";
import { useParams } from "next/navigation";
import InventoryTable from "../../components/InventoryTable";

export default function CustomerCategoryPage() {
  const params = useParams();
  const category = params.category as string;

  return (
    <main className="p-4 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 capitalize">{category} Inventory</h1>
      <InventoryTable
        category={category}
        showCreatedBy
        showQuantityDetails
      />
    </main>
  );
}
