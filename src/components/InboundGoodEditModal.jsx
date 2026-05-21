import React, { useState, useEffect } from "react";
import { FaTimes, FaSave } from "react-icons/fa";

export default function InboundGoodEditModal({ isOpen, onClose, good, onSubmit, submitting }) {
  const [formData, setFormData] = useState({
    name: "",
    purchasedPrice: 0,
    sellingPrice: 0,
    quantity: 0,
    unit: "PIECE",
    category: "",
  });

  const parseUnit = (unitStr) => {
    if (!unitStr) return "PIECE";
    const u = unitStr.toUpperCase().trim();
    if (["PIECE", "KILOGRAM", "GRAM", "LITRE", "METER"].includes(u)) {
      return u;
    }
    // Reverse map from common Russian translations
    if (u === "ШТ" || u === "ШТ." || u === "ШТУК" || u === "ШТУКИ") return "PIECE";
    if (u === "КГ" || u === "КИЛОГРАММ" || u === "КИЛОГРАММЫ") return "KILOGRAM";
    if (u === "Г" || u === "ГР" || u === "ГРАММ" || u === "ГРАММЫ") return "GRAM";
    if (u === "Л" || u === "ЛИТР" || u === "ЛИТРЫ") return "LITRE";
    if (u === "М" || u === "МЕТР" || u === "МЕТРЫ") return "METER";
    
    return "PIECE"; // Fallback
  };

  useEffect(() => {
    if (isOpen && good) {
      setFormData({
        name: good.name || "",
        purchasedPrice: good.purchasedPrice || 0,
        sellingPrice: good.sellingPrice || 0,
        quantity: good.quantity || 0,
        unit: parseUnit(good.unit),
        category: good.category || "",
      });
    }
  }, [isOpen, good]);

  if (!isOpen || !good) return null;

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? "" : parseFloat(value)) : value,
    }));
  };

  const handleSave = () => {
    onSubmit({
      externalId: good.externalId,
      ...formData,
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              Редактирование товара
            </h2>
            <p className="text-sm text-gray-500 font-mono mt-1">{good.barcode}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-600 mb-1">Название</label>
              <input
                className="border border-gray-200 p-2.5 rounded-xl w-full focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Категория</label>
              <input
                className="border border-gray-200 p-2.5 rounded-xl w-full focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                name="category"
                value={formData.category}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Ед. измерения</label>
              <select
                name="unit"
                className="border border-gray-200 p-2.5 rounded-xl w-full focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={formData.unit}
                onChange={handleChange}
              >
                <option value="PIECE">Штук</option>
                <option value="KILOGRAM">Килограмм</option>
                <option value="GRAM">Грамм</option>
                <option value="LITRE">Литр</option>
                <option value="METER">Метр</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Кол-во</label>
              <input
                className="border border-gray-200 p-2.5 rounded-xl w-full focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                name="quantity"
                type="number"
                min="0"
                step="0.01"
                value={formData.quantity}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Цена закупа (₸)</label>
              <input
                className="border border-gray-200 p-2.5 rounded-xl w-full focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                name="purchasedPrice"
                type="number"
                min="0"
                step="0.01"
                value={formData.purchasedPrice}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Цена продажи (₸)</label>
              <input
                className="border border-gray-200 p-2.5 rounded-xl w-full focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                name="sellingPrice"
                type="number"
                min="0"
                step="0.01"
                value={formData.sellingPrice}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            disabled={submitting}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center gap-2"
          >
            {submitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <FaSave size={14} />
            )}
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}
