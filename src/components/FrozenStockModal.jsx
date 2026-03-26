import React from "react";
import { FaExclamationTriangle, FaSnowflake } from "react-icons/fa";

export default function FrozenStockModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100">
        <div className="bg-blue-50 p-6 flex justify-center">
            <div className="relative">
                <FaSnowflake size={48} className="text-blue-500 animate-spin-slow" />
                <FaExclamationTriangle size={24} className="text-amber-500 absolute -bottom-1 -right-1" />
            </div>
        </div>
        
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Склад заморожен</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Операции со складом временно отключены, так как идет процесс инвентаризации. 
            Пожалуйста, завершите инвентаризацию перед совершением продаж или обновлением склада.
          </p>
          
          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-blue-200"
          >
            Я понимаю
          </button>
        </div>
      </div>
    </div>
  );
}
