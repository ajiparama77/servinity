"use client";

import { useTenantStore } from "@/app/store/tenantStore";
import { useState } from "react";

export default function POSPage() {
  const { themeColorHex } = useTenantStore();
  
  const dummyCategories = ["All", "Haircut", "Coloring", "Treatment", "Products"];
  const dummyItems = [
    { id: 1, name: "Premium Haircut", price: 150000, category: "Haircut" },
    { id: 2, name: "Basic Haircut", price: 80000, category: "Haircut" },
    { id: 3, name: "Balayage Color", price: 850000, category: "Coloring" },
    { id: 4, name: "Keratin Treatment", price: 500000, category: "Treatment" },
    { id: 5, name: "Hair Tonic Serum", price: 120000, category: "Products" },
  ];

  const [cart, setCart] = useState<{item: typeof dummyItems[0], qty: number}[]>([]);

  const addToCart = (item: typeof dummyItems[0]) => {
    setCart(prev => {
      const exists = prev.find(p => p.item.id === item.id);
      if (exists) {
        return prev.map(p => p.item.id === item.id ? { ...p, qty: p.qty + 1 } : p);
      }
      return [...prev, { item, qty: 1 }];
    });
  };

  const total = cart.reduce((acc, curr) => acc + (curr.item.price * curr.qty), 0);

  return (
    <div className="flex w-full h-full">
      {/* Left Panel: Catalog */}
      <div className="flex-1 flex flex-col bg-white border-r">
        {/* Category Tabs */}
        <div className="flex overflow-x-auto p-4 border-b space-x-2">
          {dummyCategories.map(cat => (
            <button key={cat} className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-sm font-medium whitespace-nowrap">
              {cat}
            </button>
          ))}
        </div>
        
        {/* Items Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {dummyItems.map(item => (
            <button 
              key={item.id}
              onClick={() => addToCart(item)}
              className="p-4 border rounded-xl flex flex-col items-start justify-between h-32 hover:border-gray-400 hover:shadow-md transition-all text-left bg-gray-50/50"
            >
              <span className="font-semibold text-gray-800">{item.name}</span>
              <span className="text-gray-600">Rp {item.price.toLocaleString('id-ID')}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Right Panel: Cart */}
      <div className="w-96 bg-white flex flex-col shadow-xl z-20">
        <div className="p-6 border-b bg-gray-50">
          <h2 className="text-xl font-bold">Current Order</h2>
          <p className="text-sm text-gray-500 mt-1">Walk-in Customer</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center text-gray-400 mt-10">Cart is empty</div>
          ) : (
            cart.map(c => (
              <div key={c.item.id} className="flex justify-between items-center border-b pb-4">
                <div>
                  <p className="font-semibold">{c.item.name}</p>
                  <p className="text-sm text-gray-500">Rp {c.item.price.toLocaleString('id-ID')} x {c.qty}</p>
                </div>
                <p className="font-bold">Rp {(c.item.price * c.qty).toLocaleString('id-ID')}</p>
              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-gray-50 border-t">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-semibold">Rp {total.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-600">Tax (11%)</span>
            <span className="font-semibold">Rp {(total * 0.11).toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between items-center mb-6 text-xl font-bold">
            <span>Total</span>
            <span>Rp {(total * 1.11).toLocaleString('id-ID')}</span>
          </div>
          <button 
            className="w-full py-4 text-white rounded-lg font-bold text-lg shadow-md hover:shadow-lg transition-all"
            style={{ backgroundColor: themeColorHex || '#10b981' }}
          >
            Charge
          </button>
        </div>
      </div>
    </div>
  );
}
