import React, { useState } from "react";
import { useInventarization } from "../context/InventarizationContext";
import { translateUnit } from "../utils/unitTranslations";
import { getProductImageUrl } from "../utils/imageUtils";
import { Package, Plus } from "lucide-react";

export default function ProductCard({ product, onAdd }) {
  const { isStockFrozen, loading } = useInventarization();
  const [imgError, setImgError] = useState(false);

  const resolvedUrl = getProductImageUrl(product.photoUrl);
  const hasImage = resolvedUrl && !imgError;

  const isOutOfStock = product.stockBalance <= 0;
  const isLowStock = product.stockBalance > 0 && product.stockBalance <= 5;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden group">
      {/* Photo / Placement Container */}
      <div className="relative h-40 bg-slate-50 flex items-center justify-center overflow-hidden border-b border-gray-100">
        {hasImage ? (
          <img
            src={resolvedUrl}
            alt={product.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100/50 flex flex-col items-center justify-center text-slate-400 gap-1.5 p-4">
            <Package size={28} className="text-slate-300 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-[10px] text-gray-400 font-medium text-center line-clamp-1">{product.category?.name || "Товар"}</span>
          </div>
        )}

        {/* Badges */}
        {product.category?.name && (
          <div className="absolute top-2.5 left-2.5 bg-white/80 backdrop-blur-md text-[10px] font-semibold px-2 py-0.5 rounded-full text-gray-600 shadow-sm border border-gray-200/50">
            {product.category.name}
          </div>
        )}

        <div className="absolute top-2.5 right-2.5">
          {isOutOfStock ? (
            <span className="bg-rose-50 text-rose-700 border border-rose-100 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
              Нет в наличии
            </span>
          ) : isLowStock ? (
            <span className="bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
              Мало: {product.stockBalance} {translateUnit(product.unit)}
            </span>
          ) : (
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
              В наличии
            </span>
          )}
        </div>
      </div>

      {/* Info Container */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <h3 className="font-semibold text-gray-800 text-sm group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
          <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
            <span>Штрихкод: {product.barcode || "—"}</span>
            <span className="font-medium text-gray-500">
              {product.stockBalance} {translateUnit(product.unit)}
            </span>
          </div>
        </div>

        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-extrabold text-gray-900">{product.sellingPrice?.toLocaleString()}</span>
            <span className="text-xs font-bold text-gray-500">₸</span>
          </div>

          {onAdd && (
            <button
              onClick={onAdd}
              disabled={loading || isStockFrozen || isOutOfStock}
              className={`w-full mt-3 flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl text-xs font-bold transition-all duration-200 transform active:scale-95 ${
                loading || isStockFrozen || isOutOfStock
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-sm"
              }`}
            >
              <Plus size={14} />
              <span>Добавить в корзину</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}