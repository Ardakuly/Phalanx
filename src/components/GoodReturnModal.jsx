import React, { useState, useEffect } from "react";
import { createGoodReturnDocument } from "../api/goodReturnDocument";
import { toast } from "react-toastify";
import { FaTimes, FaUndo, FaMinus, FaPlus } from "react-icons/fa";
import { translateUnit } from "../utils/unitTranslations";

export default function GoodReturnModal({ isOpen, onClose, document, onSuccess }) {
  const [comment, setComment] = useState("");
  const [returnGoods, setReturnGoods] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && document) {
      // Initialize return quantities to 0
      const initialGoods = document.outboundGoods.map(good => ({
        ...good,
        returnQuantity: 0
      }));
      setReturnGoods(initialGoods);
      setComment("");
    }
  }, [isOpen, document]);

  if (!isOpen || !document) return null;

  const handleQuantityChange = (barcode, newQuantity) => {
    setReturnGoods(prev => prev.map(item => {
      if (item.barcode === barcode) {
        // Clamp between 0 and original quantity
        const cappedQuantity = Math.max(0, Math.min(item.quantity, newQuantity));
        return { ...item, returnQuantity: cappedQuantity };
      }
      return item;
    }));
  };

  const totalRefund = returnGoods.reduce((sum, item) => {
    return sum + (item.returnQuantity * item.sellingPrice);
  }, 0);

  const handleSubmit = async () => {
    const goodsToReturn = returnGoods
      .filter(item => item.returnQuantity > 0)
      .map(item => ({
        barcode: item.barcode,
        quantity: item.returnQuantity
      }));

    if (goodsToReturn.length === 0) {
      toast.warning("Выберите хотя бы один товар для возврата");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        outboundDocumentNumber: document.documentNumber,
        comment,
        goods: goodsToReturn
      };
      
      await createGoodReturnDocument(payload);
      toast.success("Возврат успешно оформлен");
      onSuccess?.();
      onClose();
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Ошибка при оформлении возврата";
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FaUndo className="text-blue-500" size={18} />
              Оформление возврата
            </h2>
            <p className="text-sm text-gray-500">По чеку №{document.documentNumber}</p>
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
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Товары в чеке</h3>
            <div className="border border-gray-100 rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Товар</th>
                    <th className="px-4 py-3 text-center font-semibold">Куплено</th>
                    <th className="px-4 py-3 text-center font-semibold">К возврату</th>
                    <th className="px-4 py-3 text-right font-semibold">Сумма</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {returnGoods.map((item) => (
                    <tr key={item.externalId} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-800">{item.name}</div>
                        <div className="text-[10px] text-gray-400 font-mono">{item.barcode}</div>
                      </td>
                      <td className="px-4 py-3 text-center text-gray-600 font-medium">
                        {item.quantity} {translateUnit(item.unit)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleQuantityChange(item.barcode, item.returnQuantity - 1)}
                            disabled={item.returnQuantity <= 0}
                            className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition-all"
                          >
                            <FaMinus size={10} />
                          </button>
                          <input
                            type="number"
                            value={item.returnQuantity}
                            onChange={(e) => handleQuantityChange(item.barcode, parseFloat(e.target.value) || 0)}
                            className="w-12 text-center font-bold text-gray-800 bg-transparent border-b-2 border-transparent focus:border-blue-500 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <button
                            onClick={() => handleQuantityChange(item.barcode, item.returnQuantity + 1)}
                            disabled={item.returnQuantity >= item.quantity}
                            className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition-all"
                          >
                            <FaPlus size={10} />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-900">
                        {(item.returnQuantity * item.sellingPrice).toLocaleString()} ₸
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Comment */}
            <div className="space-y-2 pt-2">
              <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Причина / Комментарий</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Укажите причину возврата..."
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none h-24 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-6 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Сумма возврата</span>
            <span className="text-2xl font-black text-gray-900">{totalRefund.toLocaleString()} ₸</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 text-sm font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-2xl transition-all"
            >
              Отмена
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || totalRefund === 0}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-2xl shadow-lg shadow-blue-200 transition-all flex items-center gap-2"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <FaUndo size={14} />
              )}
              Подтвердить возврат
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
