import mongoose, { Schema, Document, model, models, UpdateQuery } from "mongoose";

export interface IInventoryItem extends Document {
  category: string;
  itemCode: string;
  name: string;
  totalQuantity: number;
  taken?: number;  
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
    taken: { type: Number, default: 0 }, 
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


InventoryItemSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();

  if (!update) return next();

  if (typeof update === "object" && !Array.isArray(update)) {
    const u = update as UpdateQuery<IInventoryItem>;

    const taken = u.taken ?? u.$set?.taken;
    const totalQuantity = u.totalQuantity ?? u.$set?.totalQuantity;

    if (taken !== undefined || totalQuantity !== undefined) {
      this.model
        .findOne(this.getQuery())
        .then((doc: IInventoryItem | null) => {
          if (!doc) return next();

          const newTotal = totalQuantity !== undefined ? totalQuantity : doc.totalQuantity;
          const newTaken = taken !== undefined ? taken : doc.taken ?? 0;

          if (newTaken > newTotal) {
            return next(new Error("Taken quantity cannot be greater than total quantity."));
          }

          if (u.$set) {
            u.$set.balance = newTotal - newTaken;
          } else {
            u.balance = newTotal - newTaken;
          }

          this.setUpdate(u);
          next();
        })
        .catch(next);

      return; 
    }
  }

  next();
});

const InventoryItem =
  models.InventoryItem || model<IInventoryItem>("InventoryItem", InventoryItemSchema);

export default InventoryItem;
