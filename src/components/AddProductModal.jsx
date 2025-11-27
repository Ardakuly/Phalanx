import { useState } from "react";
import { addProductsToStock } from "../api/product";

export default function AddProductModal({ open, onClose, onSuccess }) {
  // Start with one product row
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

  const handleChange = (index, e) => {
    const newProducts = [...products];
    newProducts[index][e.target.name] = e.target.value;
    setProducts(newProducts);
  };

  const addProductRow = () => {
    setProducts([
      ...products,
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
    setProducts(products.filter((_, i) => i !== index));
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
      onSuccess(); // refresh product list
      onClose();   // close modal
      setProducts([ // reset modal
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
      alert("Error adding products");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-[600px] max-h-[90vh] overflow-y-auto shadow-lg">

        <h2 className="text-xl font-semibold mb-4">Add Products to Stock</h2>

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
                placeholder="Name"
                value={product.name}
                onChange={(e) => handleChange(index, e)}
              />

              <input
                className="border p-2 rounded"
                name="barcode"
                placeholder="Barcode"
                value={product.barcode}
                onChange={(e) => handleChange(index, e)}
              />

              <select
                name="unit"
                className="border p-2 rounded"
                value={product.unit}
                onChange={(e) => handleChange(index, e)}
              >
                <option value="PIECE">Piece (шт)</option>
                <option value="KILOGRAM">Kilogram (кг)</option>
                <option value="GRAM">Gram (г)</option>
                <option value="LITRE">Litre (л)</option>
                <option value="METER">Meter (м)</option>
              </select>

              <input
                className="border p-2 rounded"
                name="category"
                placeholder="Category"
                value={product.category}
                onChange={(e) => handleChange(index, e)}
              />

              <input
                className="border p-2 rounded"
                name="purchasedPrice"
                placeholder="Purchased Price"
                type="number"
                value={product.purchasedPrice}
                onChange={(e) => handleChange(index, e)}
              />

              <input
                className="border p-2 rounded"
                name="sellingPrice"
                placeholder="Selling Price"
                type="number"
                value={product.sellingPrice}
                onChange={(e) => handleChange(index, e)}
              />

              <input
                className="border p-2 rounded"
                name="stockBalance"
                placeholder="Stock Balance"
                type="number"
                value={product.stockBalance}
                onChange={(e) => handleChange(index, e)}
              />

              <input
                className="border p-2 rounded"
                name="photoUrl"
                placeholder="Photo URL"
                value={product.photoUrl}
                onChange={(e) => handleChange(index, e)}
              />
            </div>
          ))}

          <button
            onClick={addProductRow}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            + Add Another Product
          </button>

        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-5">
          <button
            className="px-4 py-2 bg-gray-400 text-white rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={handleSubmit}
          >
            Add All
          </button>
        </div>

      </div>
    </div>
  );
}