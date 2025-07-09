import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IInventoryItem extends Document {
  category: string;
  itemCode: string;
  name: string;
  totalQuantity: number;
  balance: number;
  unit: string;
  acquiredDate: Date;
  condition: string;
  description: string;
  givenTo?: string;
  givenBy?: string;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InventoryItemSchema = new Schema<IInventoryItem>(
  {
    category: { type: String, required: true, index: true },
    itemCode: { type: String, required: true },
    name: { type: String, required: true },
    totalQuantity: { type: Number, required: true },
    balance: { type: Number, required: true },
    unit: { type: String, default: "pcs" },
    acquiredDate: { type: Date, required: true },
    condition: { type: String, enum: ["new", "used", "damaged"], default: "new" },
    description: { type: String, default: "" },
    givenTo: { type: String, default: "" },
    givenBy: { type: String, default: "" },
    createdBy: { type: String, default: "" },
  },
  { timestamps: true }
);

const InventoryItem = models.InventoryItem || model<IInventoryItem>("InventoryItem", InventoryItemSchema);
export default InventoryItem;
