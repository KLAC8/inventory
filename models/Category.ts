import mongoose, { Schema, Document, model, models } from "mongoose";

export interface ICategory extends Document {
  name: string;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
    createdBy: { type: String, default: "" },
  },
  { timestamps: true }
);

const Category = models.Category || model<ICategory>("Category", CategorySchema);
export default Category;
