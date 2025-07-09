// types.ts
export type InventoryItem = {
  _id: string;
  itemCode: string;
  name: string;
  quantity: number;
  unit: string;
  description?: string;
  acquiredDate: string;
  condition: 'new' | 'used' | 'damaged';
  category: string;
};
