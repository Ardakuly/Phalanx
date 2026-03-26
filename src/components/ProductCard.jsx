import { useInventarization } from "../context/InventarizationContext";

export default function ProductCard({ product, onAdd }) {
  const { isStockFrozen } = useInventarization();
  return (
    <div className="bg-white p-4 rounded-xl shadow-md flex flex-col justify-between">
      <h3 className="font-semibold">{product.name}</h3>
      <p className="text-gray-500">{product.sellingPrice} ₸</p>
      <p className="text-gray-500">{product.stockBalance} {product.unit}</p>
      {onAdd && (
        <button
          onClick={onAdd}
          disabled={isStockFrozen}
          className={`mt-2 text-white text-lg px-3 py-1 rounded-lg ${
            isStockFrozen ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Добавить в корзину
        </button>
      )}
    </div>
  );
}