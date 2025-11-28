export default function ProductCard({ product, onAdd }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md flex flex-col justify-between">
      <h3 className="font-semibold">{product.name}</h3>
      <p className="text-gray-500">{product.sellingPrice} ₸</p>
      <p className="text-gray-500">{product.stockBalance} {product.unit}</p>
      <button
        onClick={onAdd}
        className="mt-2 bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
      >
        Add to Basket
      </button>
    </div>
  );
}