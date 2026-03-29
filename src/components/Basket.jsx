import React, { useState } from "react";
import { useInventarization } from "../context/InventarizationContext";
import FrozenStockModal from "./FrozenStockModal";

export default function Basket({ basket, onIncrease, onDecrease, onRemove, onSell }) {
  const total = basket.reduce((acc, item) => acc + item.sellingPrice * item.count, 0);
  const { isStockFrozen } = useInventarization();
  const [showFrozenModal, setShowFrozenModal] = useState(false);

  const [paymentType, setPaymentType] = useState("CASH");

  const handleSellClick = () => {
    if (isStockFrozen) {
      setShowFrozenModal(true);
      return;
    }
    onSell(paymentType);
  };

  return (
    <div className="w-1/3 bg-white p-4 rounded-xl shadow-md flex flex-col h-full overflow-hidden">

      <h2 className="text-lg font-semibold mb-3">Корзина</h2>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto mb-3 min-h-0">
        {basket.length === 0 && (
          <p className="text-gray-500">Продукты не добавлены</p>
        )}

        {basket.map((item) => (
          <div key={item.key} className="flex justify-between items-center py-3 border-b text-sm">
            
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-gray-600">{item.sellingPrice} ₸</p>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => onDecrease(item)} className="p-1 bg-gray-200 rounded hover:bg-gray-300">-</button>
              <span className="px-2 font-semibold">{item.count}</span>
              <button onClick={() => onIncrease(item)} className="p-1 bg-gray-200 rounded hover:bg-gray-300">+</button>
            </div>

            <button onClick={() => onRemove(item)} className="p-1 text-red-500 hover:text-red-700">✕</button>
          </div>
        ))}
      </div>

      {/* Bottom always visible */}
      <div className="border-t pt-3 shrink-0 bg-white">
        <div className="flex justify-between text-lg font-semibold mb-3">
          <span>Итого:</span>
          <span>{total} ₸</span>
        </div>

        {/* Payment Method Selection */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { id: "CASH", label: "Наличные" },
            { id: "CARD", label: "Карта" },
            { id: "QR", label: "Каспи QR" },
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => setPaymentType(opt.id)}
              className={`py-2 px-1 text-xs font-bold rounded-lg border transition-all ${
                paymentType === opt.id
                  ? "bg-blue-600 border-blue-600 text-white shadow-md"
                  : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <button
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold text-lg shadow-lg active:scale-95 transition-transform"
          onClick={handleSellClick}
          disabled={basket.length === 0}
        >
          Продать
        </button>

        <FrozenStockModal 
            isOpen={showFrozenModal} 
            onClose={() => setShowFrozenModal(false)} 
        />
      </div>
    </div>
  );
}
