import React from "react";
import { Search, Scan, AlertCircle, CheckCircle2 } from "lucide-react";

interface DrugItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  status: "ok" | "low" | "critical";
}

const INVENTORY: DrugItem[] = [
  { id: "1", name: "Lonart DS (Antimalarial)", category: "Antimalarial", stock: 4, price: 2850, status: "critical" },
  { id: "2", name: "Emzor Paracetamol", category: "Pain Relief", stock: 156, price: 300, status: "ok" },
  { id: "3", name: "Ciprotab 500mg", category: "Antibiotics", stock: 12, price: 4500, status: "low" },
];

const PharmacyInventory: React.FC = () => {
  return (
    <div className="relative w-full max-w-md mx-auto bg-gray-50 min-h-[500px] border border-gray-200 rounded-2xl overflow-hidden font-sans">
      <div className="bg-white p-4 border-b border-gray-200 sticky top-0 z-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">Dispense & Track</h2>
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">Shop Floor Mode</span>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search drug name or scan barcode..."
            aria-label="Search drugs by name or scan barcode"
            className="w-full pl-10 pr-12 py-3 bg-gray-100 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-0 rounded-lg transition-all text-sm outline-none"
          />
          <button
            className="absolute right-2 top-2 p-1 bg-white rounded border border-gray-200 shadow-sm active:bg-gray-100"
            aria-label="Scan barcode"
          >
            <Scan className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="p-2 space-y-2">
        {INVENTORY.map((item) => (
          <div
            key={item.id}
            className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex justify-between items-center group active:scale-[0.99] transition-transform"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                {item.status === "critical" && <AlertCircle className="w-4 h-4 text-red-500 animate-bounce" />}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {item.category} • {item.stock} units left
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm font-bold text-gray-900 tabular-nums">
                {item.price.toLocaleString("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 })}
              </p>

              {item.status === "critical" ? (
                <button
                  className="mt-1 px-3 py-1 bg-red-50 text-red-600 text-xs font-medium rounded border border-red-100"
                  aria-label={`Reorder ${item.name}`}
                >
                  Reorder
                </button>
              ) : (
                <button
                  className="mt-1 px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded shadow-sm hover:bg-blue-700"
                  aria-label={`Dispense ${item.name}`}
                >
                  Dispense
                </button>
              )}
            </div>
          </div>
        ))}

        <div className="bg-white p-3 rounded-lg border border-gray-100 opacity-50">
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-2 animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse" />
        </div>
      </div>

      <div className="absolute left-0 right-0 bottom-0 bg-white border-t border-gray-200 p-4 flex justify-around text-gray-400">
        <div className="text-center text-blue-600">
          <div className="mx-auto w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mb-1">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold">Sales</span>
        </div>
        <div className="text-center">
          <div className="mx-auto w-6 h-6 mb-1">
            <AlertCircle className="w-5 h-5" />
          </div>
          <span className="text-[10px]">Shortages</span>
        </div>
      </div>
    </div>
  );
};

export default PharmacyInventory;
