export default function Basket({ basket, onIncrease, onDecrease, onRemove, onSell }) {
  const total = basket.reduce((acc, item) => acc + item.sellingPrice * item.count, 0);

  return (
    <div className="w-1/3 bg-white p-4 rounded-xl shadow-md flex flex-col 
                    h-[80vh] max-h-[80vh] overflow-hidden">  {/* << 80% screen */}

      <h2 className="text-lg font-semibold mb-3">Корзина</h2>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto mb-3 min-h-0">
        {basket.length === 0 && (
          <p className="text-gray-500">Продукты не добавлены</p>
        )}

        {basket.map((item) => (
          <div key={item.key} className="flex justify-between items-center py-3 border-b text-sm">
            
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-gray-600">{item.sellingPrice} ₸</p>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => onDecrease(item)} className="p-1 bg-gray-200 rounded hover:bg-gray-300">-</button>
              <span className="px-2 font-semibold">{item.count}</span>
              <button onClick={() => onIncrease(item)} className="p-1 bg-gray-200 rounded hover:bg-gray-300">+</button>
            </div>

            <button onClick={() => onRemove(item)} className="p-1 text-red-500 hover:text-red-700">✕</button>
          </div>
        ))}
      </div>

      {/* Bottom always visible */}
      <div className="border-t pt-3 shrink-0 bg-white">
        <div className="flex justify-between text-lg font-semibold mb-2">
          <span>Итого:</span>
          <span>{total} ₸</span>
        </div>

        <button
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium"
          onClick={onSell}
          disabled={basket.length === 0}
        >
          Продать
        </button>
      </div>
    </div>
  );
}
