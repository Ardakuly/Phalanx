import { useState } from "react";
import { addProductsToStock } from "../api/product";

export default function AddProductModal({ open, onClose, onSuccess }) {
  const [form, setForm] = useState({
    externalId: "",
    name: "",
    sku: "",
    barcode: "",
    unit: "",
    category: "",
    purchasedPrice: "",
    sellingPrice: "",
    stockBalance: "",
    photoUrl: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const payload = [
        {
          ...form,
          purchasedPrice: parseFloat(form.purchasedPrice),
          sellingPrice: parseFloat(form.sellingPrice),
          stockBalance: parseFloat(form.stockBalance)
        }
      ];

      await addProductsToStock(payload);
      onSuccess();      // refresh product list
      onClose();        // close modal
    } catch (error) {
      alert("Error adding product");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-[450px] shadow-lg">

        <h2 className="text-xl font-semibold mb-4">Add Product to Stock</h2>

        <div className="flex flex-col gap-3">
          <input className="border p-2 rounded" name="externalId" placeholder="External ID" onChange={handleChange}/>
          <input className="border p-2 rounded" name="name" placeholder="Name" onChange={handleChange}/>
          <input className="border p-2 rounded" name="sku" placeholder="SKU" onChange={handleChange}/>
          <input className="border p-2 rounded" name="barcode" placeholder="Barcode" onChange={handleChange}/>
          <input className="border p-2 rounded" name="unit" placeholder="Unit (KG / PIECE)" onChange={handleChange}/>
          <input className="border p-2 rounded" name="category" placeholder="Category (FOOD / DRINK)" onChange={handleChange}/>

          <input className="border p-2 rounded" name="purchasedPrice" placeholder="Purchased Price" type="number" onChange={handleChange}/>
          <input className="border p-2 rounded" name="sellingPrice" placeholder="Selling Price" type="number" onChange={handleChange}/>
          <input className="border p-2 rounded" name="stockBalance" placeholder="Stock Balance" type="number" onChange={handleChange}/>
          <input className="border p-2 rounded" name="photoUrl" placeholder="Photo URL" onChange={handleChange}/>
        </div>

        <div className="flex justify-end gap-3 mt-5">
          <button className="px-4 py-2 bg-gray-400 text-white rounded" onClick={onClose}>
            Cancel
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700" onClick={handleSubmit}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
