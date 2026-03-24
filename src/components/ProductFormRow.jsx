import React from "react";

export default function ProductFormRow({ product, index, onChange, onRemove, showRemoveButton }) {
  return (
    <div className="border p-3 rounded flex flex-col gap-2 relative bg-gray-50">
      <div className="grid grid-cols-2 gap-3 mt-2 pr-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Название</label>
          <input
            className="border p-2 rounded w-full"
            name="name"
            placeholder="Название"
            value={product.name}
            onChange={(e) => onChange(index, e)}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Штрихкод</label>
          <input
            className="border p-2 rounded w-full"
            name="barcode"
            placeholder="Штрихкод"
            value={product.barcode}
            onChange={(e) => onChange(index, e)}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Ед. измерения</label>
          <select
            name="unit"
            className="border p-2 rounded w-full"
            value={product.unit}
            onChange={(e) => onChange(index, e)}
          >
            <option value="PIECE">Штук</option>
            <option value="KILOGRAM">Килограмм</option>
            <option value="GRAM">Грамм</option>
            <option value="LITRE">Литр</option>
            <option value="METER">Метр</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Категория</label>
          <input
            className="border p-2 rounded w-full"
            name="category"
            placeholder="Категория"
            value={product.category}
            onChange={(e) => onChange(index, e)}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Закупочная цена (₸)</label>
          <input
            className="border p-2 rounded w-full"
            name="purchasedPrice"
            placeholder="0"
            type="number"
            value={product.purchasedPrice}
            onChange={(e) => onChange(index, e)}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Цена продажи (₸)</label>
          <input
            className="border p-2 rounded w-full"
            name="sellingPrice"
            placeholder="0"
            type="number"
            value={product.sellingPrice}
            onChange={(e) => onChange(index, e)}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Остаток на складе</label>
          <input
            className="border p-2 rounded w-full"
            name="stockBalance"
            placeholder="0"
            type="number"
            value={product.stockBalance}
            onChange={(e) => onChange(index, e)}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Ссылка на фото</label>
          <input
            className="border p-2 rounded w-full"
            name="photoUrl"
            placeholder="https://..."
            value={product.photoUrl}
            onChange={(e) => onChange(index, e)}
          />
        </div>
      </div>
      
      {showRemoveButton && (
        <div className="flex justify-end mt-3 pt-3 border-t">
          <button
            onClick={() => onRemove(index)}
            className="flex items-center gap-1 text-red-500 hover:text-red-700 font-medium transition-colors bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg"
          >
            <span className="text-xl leading-none">&times;</span> Удалить продукт
          </button>
        </div>
      )}
    </div>
  );
}
