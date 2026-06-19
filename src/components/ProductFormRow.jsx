import React, { useState } from "react";
import { getProductImageUrl, uploadProductImage } from "../utils/imageUtils";

export default function ProductFormRow({ product, index, onChange, onRemove, showRemoveButton }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const photoUrl = await uploadProductImage(file);
      onChange(index, { target: { name: "photoUrl", value: photoUrl } });
    } catch (err) {
      console.error("Image upload failed:", err);
      setError("Ошибка при загрузке фото");
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    onChange(index, { target: { name: "photoUrl", value: "" } });
  };

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
          <label className="block text-sm text-gray-600 mb-1">Фото товара</label>
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id={`file-input-${index}`}
              disabled={uploading}
            />
            
            {uploading && (
              <div className="h-10 px-3 rounded-xl border border-dashed border-gray-300 flex items-center gap-2 text-gray-500 bg-white w-full">
                <div className="w-3.5 h-3.5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs">Загрузка...</span>
              </div>
            )}

            {!uploading && !product.photoUrl && (
              <div className="w-full">
                <label
                  htmlFor={`file-input-${index}`}
                  className="h-10 border border-dashed border-gray-300 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer hover:bg-gray-100 hover:border-blue-400 transition-all text-gray-600 bg-white w-full"
                >
                  <span className="text-xs font-semibold text-blue-600">📸 Выберите фото</span>
                </label>
                {error && <span className="text-[10px] text-rose-500 mt-1 block">{error}</span>}
              </div>
            )}

            {!uploading && product.photoUrl && (
              <div className="flex items-center gap-2 w-full bg-white p-1 border rounded-xl">
                <div className="relative w-8 h-8 rounded-lg border overflow-hidden bg-gray-50 flex-shrink-0">
                  <img
                    src={getProductImageUrl(product.photoUrl)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-gray-400 truncate">{product.photoUrl.split('/').pop()}</p>
                </div>
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors flex-shrink-0"
                  title="Удалить фото"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            )}
          </div>
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

