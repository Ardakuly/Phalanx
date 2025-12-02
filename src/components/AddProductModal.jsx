import { useRef, useState } from "react";
import { addProductsToStock, getProductByBarcode, getProductByName } from "../api/product";
import { toast } from "react-toastify";

export default function AddProductModal({ open, onClose, onSuccess }) {
  const [products, setProducts] = useState([
    {
      name: "",
      barcode: "",
      unit: "PIECE",
      category: "",
      purchasedPrice: "",
      sellingPrice: "",
      stockBalance: "",
      photoUrl: "",
    },
  ]);

  // one debounce timer for search
  const searchTimeoutRef = useRef(null);

  const autoFillProduct = async (index, product) => {
    try {
      let existing = null;

      if (product.name && product.name.length >= 3) {
        existing = await getProductByName(product.name);
      }

      if (!existing) return;

      setProducts((prev) =>
        prev.map((p, i) =>
          i === index
            ? {
                ...p,
                // auto-filled from backend
                name: existing.name,
                barcode: existing.barcode,
                unit: existing.unit,
                category: existing.category.name,
                photoUrl: existing.photoUrl ?? p.photoUrl,
                // DO NOT override these:
                // purchasedPrice: p.purchasedPrice,
                // sellingPrice: p.sellingPrice,
                // stockBalance: p.stockBalance,
              }
            : p
        )
      );

      toast.info("Existing product found, fields filled");
    } catch (e) {
      // likely 404 – just means new product, do nothing
      // console.log("No existing product found");
    }
  };

  const handleChange = (index, e) => {
    const { name, value } = e.target;

    const newProducts = [...products];
    newProducts[index][name] = value;
    setProducts(newProducts);

    // trigger auto-fill only when name/barcode change
    if (name === "name" || name === "barcode") {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

      searchTimeoutRef.current = setTimeout(() => {
        autoFillProduct(index, newProducts[index]);
      }, 400); // debounce 400ms
    }
  };

  const addProductRow = () => {
    setProducts((prev) => [
      ...prev,
      {
        name: "",
        barcode: "",
        unit: "PIECE",
        category: "",
        purchasedPrice: "",
        sellingPrice: "",
        stockBalance: "",
        photoUrl: "",
      },
    ]);
  };

  const removeProductRow = (index) => {
    setProducts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      const payload = products.map((p) => ({
        name: p.name,
        barcode: p.barcode,
        unit: p.unit,
        category: p.category,
        purchasedPrice: parseFloat(p.purchasedPrice),
        sellingPrice: parseFloat(p.sellingPrice),
        stockBalance: parseFloat(p.stockBalance),
        photoUrl: p.photoUrl,
      }));

      await addProductsToStock(payload);
      toast.success("Products added to stock");

      onSuccess(); // refresh product list
      onClose();   // close modal

      // reset state
      setProducts([
        {
          name: "",
          barcode: "",
          unit: "PIECE",
          category: "",
          purchasedPrice: "",
          sellingPrice: "",
          stockBalance: "",
          photoUrl: "",
        },
      ]);
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  if (!open) return null;

  // 🔻 YOUR ORIGINAL LAYOUT, unchanged except wired to enhanced logic
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-[600px] max-h-[90vh] overflow-y-auto shadow-lg">

        <h2 className="text-xl font-semibold mb-4">Добавить продукты на склад</h2>

        <div className="flex flex-col gap-4">
          {products.map((product, index) => (
            <div
              key={index}
              className="border p-3 rounded flex flex-col gap-2 relative bg-gray-50"
            >
              {products.length > 1 && (
                <button
                  onClick={() => removeProductRow(index)}
                  className="absolute top-1 right-1 text-red-500 font-bold"
                  title="Remove product"
                >
                  ×
                </button>
              )}

              <input
                className="border p-2 rounded"
                name="name"
                placeholder="Название"
                value={product.name}
                onChange={(e) => handleChange(index, e)}
              />

              <input
                className="border p-2 rounded"
                name="barcode"
                placeholder="Штрихкод"
                value={product.barcode}
                onChange={(e) => handleChange(index, e)}
              />

              <select
                name="unit"
                className="border p-2 rounded"
                value={product.unit}
                onChange={(e) => handleChange(index, e)}
              >
                <option value="PIECE">Штук</option>
                <option value="KILOGRAM">Килограмм</option>
                <option value="GRAM">Грамм</option>
                <option value="LITRE">Литр</option>
                <option value="METER">Метр</option>
              </select>

              <input
                className="border p-2 rounded"
                name="category"
                placeholder="Категория"
                value={product.category}
                onChange={(e) => handleChange(index, e)}
              />

              <input
                className="border p-2 rounded"
                name="purchasedPrice"
                placeholder="Закупочная цена"
                type="number"
                value={product.purchasedPrice}
                onChange={(e) => handleChange(index, e)}
              />

              <input
                className="border p-2 rounded"
                name="sellingPrice"
                placeholder="Цена продажи"
                type="number"
                value={product.sellingPrice}
                onChange={(e) => handleChange(index, e)}
              />

              <input
                className="border p-2 rounded"
                name="stockBalance"
                placeholder="Остаток на складе"
                type="number"
                value={product.stockBalance}
                onChange={(e) => handleChange(index, e)}
              />

              <input
                className="border p-2 rounded"
                name="photoUrl"
                placeholder="Ссылка на фото"
                value={product.photoUrl}
                onChange={(e) => handleChange(index, e)}
              />
            </div>
          ))}

          <button
            onClick={addProductRow}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            + Добавить другой продукт
          </button>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-5">
          <button
            className="px-4 py-2 bg-gray-400 text-white rounded"
            onClick={onClose}
          >
            Отмена
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={handleSubmit}
          >
            Добавить все
          </button>
        </div>

      </div>
    </div>
  );
}