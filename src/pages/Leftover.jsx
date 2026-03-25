import { useEffect, useState } from "react";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import { useAuth } from "../context/AuthContext";
import { getLeftovers } from "../api/product";
import { toast } from "react-toastify";

export default function Leftover() {
  const { user } = useAuth();
  const [threshold, setThreshold] = useState(10);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLeftovers(threshold);
  }, [threshold]);

  const fetchLeftovers = async (val) => {
    setLoading(true);
    try {
      const data = await getLeftovers(val);
      setProducts(data);
    } catch (error) {
      toast.error(error.response?.data?.error || "Не удалось загрузить остаток");
    }
    setLoading(false);
  };

  const thresholds = [10, 20, 30];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header page="leftovers" user={user} />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white p-6 rounded-2xl shadow-sm mb-6 flex flex-col items-center sm:flex-row justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Заканчивающиеся товары</h2>
              <p className="text-gray-500 mt-1">Товары, у которых запас на складе ниже {threshold} штук</p>
            </div>

            <div className="flex gap-3 mt-4 sm:mt-0 bg-gray-100 p-1.5 rounded-xl">
              {thresholds.map((t) => (
                <button
                  key={t}
                  onClick={() => setThreshold(t)}
                  className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                    threshold === t
                      ? "bg-white text-blue-600 shadow-sm ring-1 ring-blue-100"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/50"
                  }`}
                >
                  Меньше {t} штук
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
              <span className="text-4xl block mb-4">🎉</span>
              <h3 className="text-xl font-medium text-gray-800">Всё отлично!</h3>
              <p className="text-gray-500 mt-2">Заканчивающейся товары не найдены</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {products.map((prod) => (
                <ProductCard
                  key={prod.barcode}
                  product={prod}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
