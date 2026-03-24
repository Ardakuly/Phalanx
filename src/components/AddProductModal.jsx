import { useRef, useState } from "react";
import { addProductsToStock, getProductByBarcode, getProductByName } from "../api/product";
import { toast } from "react-toastify";

export default function AddProductModal({ open, onClose, onSuccess }) {
  const [products, setProducts] = useState([
    {
      rowId: Date.now(),
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

  // one debounce timer per row
  const searchTimeoutsRef = useRef({});

  const handleClose = () => {
    setProducts([
      {
        rowId: Date.now(),
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
    onClose();
  };

  const autoFillProduct = async (index, product) => {
    try {
      let existing = null;

      if (product.name && product.name.length >= 3) {
        existing = await getProductByName(product.name);
      }

      if (!existing) return;

      setProducts((prev) => {
        const currentProduct = prev[index];
        // Discard autofill if user modified the name/barcode during the API request
        if (!currentProduct || currentProduct.name !== product.name || currentProduct.barcode !== product.barcode) {
          return prev;
        }
        return prev.map((p, i) =>
          i === index
            ? {
                ...p,
                // auto-filled from backend
                name: existing.name,
                barcode: existing.barcode,
                unit: existing.unit,
                category: existing.category.name,
                photoUrl: existing.photoUrl ?? p.photoUrl,
              }
            : p
        );
      });

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
      if (searchTimeoutsRef.current[index]) clearTimeout(searchTimeoutsRef.current[index]);

      searchTimeoutsRef.current[index] = setTimeout(() => {
        autoFillProduct(index, newProducts[index]);
      }, 400); // debounce 400ms
    }
  };

  const addProductRow = () => {
    setProducts((prev) => [
      ...prev,
      {
        rowId: Date.now() + Math.random(),
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
        purchasedPrice: parseFloat(p.purchasedPrice) || 0,
        sellingPrice: parseFloat(p.sellingPrice) || 0,
        stockBalance: parseFloat(p.stockBalance) || 0,
        photoUrl: p.photoUrl,
      }));

      await addProductsToStock(payload);
      toast.success("Products added to stock");

      onSuccess(); // refresh product list
      onClose();   // close modal

      // reset state
      setProducts([
        {
          rowId: Date.now(),
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
              key={product.rowId || index}
              className="border p-3 rounded flex flex-col gap-2 relative bg-gray-50"
            >
              <div className="grid grid-cols-2 gap-3 mt-2 pr-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Название</label>
                  <input
                    className="border p-2 rounded w-full"
                    name="name"
                    placeholder="Название"
                    value={product.name}
                    onChange={(e) => handleChange(index, e)}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Штрихкод</label>
                  <input
                    className="border p-2 rounded w-full"
                    name="barcode"
                    placeholder="Штрихкод"
                    value={product.barcode}
                    onChange={(e) => handleChange(index, e)}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Ед. измерения</label>
                  <select
                    name="unit"
                    className="border p-2 rounded w-full"
                    value={product.unit}
                    onChange={(e) => handleChange(index, e)}
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
                    onChange={(e) => handleChange(index, e)}
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
                    onChange={(e) => handleChange(index, e)}
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
                    onChange={(e) => handleChange(index, e)}
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
                    onChange={(e) => handleChange(index, e)}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Ссылка на фото</label>
                  <input
                    className="border p-2 rounded w-full"
                    name="photoUrl"
                    placeholder="https://..."
                    value={product.photoUrl}
                    onChange={(e) => handleChange(index, e)}
                  />
                </div>
              </div>
              
              {products.length > 1 && (
                <div className="flex justify-end mt-3 pt-3 border-t">
                  <button
                    onClick={() => removeProductRow(index)}
                    className="flex items-center gap-1 text-red-500 hover:text-red-700 font-medium transition-colors bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg"
                  >
                    <span className="text-xl leading-none">&times;</span> Удалить продукт
                  </button>
                </div>
              )}
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
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            onClick={handleClose}
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