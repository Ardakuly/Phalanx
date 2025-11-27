import { Minus, Plus, Trash2 } from "lucide-react";

export default function Basket({
  basket,
  onIncrease,
  onDecrease,
  onRemove,
  onSell,
}) {
  const total = basket.reduce(
    (acc, item) => acc + item.sellingPrice * item.count,
    0
  );

  return (
    <div className="w-1/3 bg-white p-4 rounded-xl shadow-md flex flex-col h-full min-h-0">
      <h2 className="text-lg font-semibold mb-3">Basket</h2>

      <div className="flex-1 overflow-y-auto mb-3">
        {basket.length === 0 && (
          <p className="text-gray-500">No products added</p>
        )}

        {basket.map((item) => (
          <div
            key={item.id ?? item.barcode}
            className="flex justify-between items-center py-3 border-b text-sm"
          >
            {/* Left: product name + price */}
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-gray-600">{item.sellingPrice} ₸</p>
            </div>

            {/* Middle: quantity controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onDecrease(item)}
                className="p-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                <Minus size={16} />
              </button>

              <span className="px-2 font-semibold">{item.count}</span>

              <button
                onClick={() => onIncrease(item)}
                className="p-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Remove button */}
            <button
              onClick={() => onRemove(item)}
              className="p-1 text-red-500 hover:text-red-700"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* Bottom total + sell */}
      <div className="border-t pt-3 shrink-0">
        <div className="flex justify-between text-lg font-semibold mb-2">
          <span>Total:</span>
          <span>{total} ₸</span>
        </div>

        <button
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-center font-medium"
          onClick={onSell}
          disabled={basket.length === 0}
        >
          Sell
        </button>
      </div>
    </div>
  );
}