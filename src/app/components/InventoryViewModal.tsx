"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, PackageIcon, UserIcon, ClipboardIcon } from "lucide-react";

interface InventoryItem {
  _id: string;
  itemCode: string;
  name: string;
  totalQuantity: number;
  taken: number;
  balance: number;
  unit: string;
  acquiredDate: string;
  condition: string;
  createdBy: string;
  description?: string;
  givenTo?: string;
  givenBy?: string;
  takenHistory?: { takenBy: string; quantity: number; date: string }[];
}

interface Props {
  item: InventoryItem | null;
  open: boolean;
  onClose: () => void;
}

export default function InventoryViewModal({ item, open, onClose }: Props) {
  if (!item) return null;

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "new":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "used":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "damaged":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <PackageIcon size={20} />
            {item.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-2 text-sm text-gray-800 dark:text-gray-200">
          {/* Item Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Item Code</p>
              <p className="font-mono">{item.itemCode}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Condition</p>
              <Badge className={getConditionColor(item.condition)}>
                {item.condition.toUpperCase()}
              </Badge>
            </div>
          </div>

          {/* Quantities */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
              <p className="text-lg font-bold">{item.totalQuantity}</p>
              <p className="text-xs">Total</p>
            </div>
            <div className="text-center bg-orange-100 dark:bg-orange-900/30 p-3 rounded-lg">
              <p className="text-lg font-bold">{item.taken}</p>
              <p className="text-xs">Taken</p>
            </div>
            <div className="text-center bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
              <p className="text-lg font-bold">{item.balance}</p>
              <p className="text-xs">Balance</p>
            </div>
          </div>

          {/* Unit & Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Unit</p>
              <p className="capitalize">{item.unit}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <CalendarIcon size={14} /> Acquired Date
              </p>
              <p>{new Date(item.acquiredDate).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Description */}
          {item.description && (
            <div>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <ClipboardIcon size={14} />
                Description
              </p>
              <p className="bg-gray-50 dark:bg-gray-800 p-2 rounded-md">{item.description}</p>
            </div>
          )}

          {/* Given To/By */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {item.givenTo && (
              <div>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <UserIcon size={14} /> Given To
                </p>
                <p>{item.givenTo}</p>
              </div>
            )}
            {item.givenBy && (
              <div>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <UserIcon size={14} /> Given By
                </p>
                <p>{item.givenBy}</p>
              </div>
            )}
          </div>

          {/* Created By */}
          <div>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <UserIcon size={14} /> Created By
            </p>
            <p>{item.createdBy}</p>
          </div>

          {/* Taken History */}
          {item.takenHistory && item.takenHistory.length > 0 && (
            <div>
              <p className="text-xs text-gray-500">Taken History</p>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {item.takenHistory.map((history, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded text-sm"
                  >
                    <span>{history.takenBy}</span>
                    <span>{history.quantity} {item.unit}</span>
                    <span>{new Date(history.date).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Close Button */}
          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
