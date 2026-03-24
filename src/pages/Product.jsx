import { useEffect, useState } from "react";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import AddProductModal from "../components/AddProductModal";
import Basket from "../components/Basket";
import { getProducts } from "../api/product";
import { sellProducts } from "../api/product";
import { getUser } from "../api/user";
import { toast } from "react-toastify";
import { downloadLeftoverReport, downloadTransactionsReport } from "../api/report";


export default function Products() {
  const [user, setUser] = useState({});
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [basket, setBasket] = useState([]);

  const [page, setPage] = useState(0);
  const [pageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("DESC");

  const [openModal, setOpenModal] = useState(false);

  // Load user
  useEffect(() => {
    (async () => {
      const data = await getUser();
      setUser(data);
    })();
  }, []);

  // Fetch products (debounced)
  useEffect(() => {
    const timer = setTimeout(() => fetchProducts(), 300);
    return () => clearTimeout(timer);
  }, [page, sortBy, sortDirection, search]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const payload = { page, pageSize, search, sortBy, sortDirection };
      const data = await getProducts(payload);

      setProducts(data.products || []);
      console.log(data);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      toast.error(error.response.data.error);
    }
    setLoading(false);
  };

  // Add product to basket
  const handleAddToBasket = (product) => {
    const key = product.id || product.barcode || product.name;

    setBasket((prev) => {
      const existing = prev.find((p) => p.key === key);

      if (existing) {
        return prev.map((p) =>
          p.key === key ? { ...p, count: p.count + 1 } : p
        );
      }

      return [...prev, { ...product, key, count: 1 }];
    });
  };

  const handleIncrease = (product) => {
    setBasket((prev) =>
      prev.map((p) =>
        p.key === product.key ? { ...p, count: p.count + 1 } : p
      )
    );
  };

  const handleDecrease = (product) => {
    setBasket((prev) =>
      prev
        .map((p) =>
          p.key === product.key ? { ...p, count: p.count - 1 } : p
        )
        .filter((p) => p.count > 0)
    );
  };

  const handleRemove = (product) => {
    setBasket((prev) => prev.filter((p) => p.key !== product.key));
  };

    const handleSell = async () => {
        if (basket.length === 0) {
            toast.info("Basket is empty");
            return;
        }

        try {
            // Transform basket to ProductSellDto
            const productsToSell = basket.map((p) => ({
                ...(p.id ? { externalId: p.id.toString() } : {}),
                barcode: p.barcode,
                quantity: p.count,
            }));

            await sellProducts(productsToSell);

            toast.success("Products sold successfully");

            // Empty basket
            setBasket([]);
            // Refresh products stock
            fetchProducts();
        } catch (error) {
            toast.error(error.response.data.error);
            console.error(error);
        }
    };


  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      <Header
        page="products"
        user={user}
        onAddProduct={() => setOpenModal(true)}
        onReportClick={
            async (type) => {
                try {
                    if (type === "leftover") {
                        await downloadLeftoverReport();
                    } else if (type === "transactions") {
                        await downloadTransactionsReport();
                    }
                } catch (e) {
                    toast.error("Failed to download report");
                }
            }
        }
      />

      <div className="flex p-4 gap-6 flex-1 overflow-hidden">

        {/* LEFT SIDE */}
        <div className="flex-1 overflow-y-auto p-2">

          {/* SEARCH + SORT */}
          <div className="flex gap-3 mb-3 items-center">
            <input
              type="text"
              placeholder="Поиск продуктов по имени и штрихкоду"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border p-2 rounded w-4/5"
            />

            <select
              className="border p-2 rounded w-1/5"
              value={`${sortBy}:${sortDirection}`}
              onChange={(e) => {
                const [f, d] = e.target.value.split(":");
                setSortBy(f);
                setSortDirection(d);
                setPage(0);
              }}
            >
                <option value="createdAt:DESC">Новые</option>
                <option value="createdAt:ASC">Старые</option>
                <option value="name:ASC">Имя A→Z</option>
                <option value="name:DESC">Имя Z→A</option>
                <option value="sellingPrice:ASC">Цена: низкая→высокая</option>
                <option value="sellingPrice:DESC">Цена: высокая→низкая</option>
                <option value="stockBalance:ASC">Остаток: низкий→высокий</option>
                <option value="stockBalance:DESC">Остаток: высокий→низкий</option>

            </select>
          </div>

          {loading && (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {!loading && products.length === 0 && (
            <div className="text-center py-10 bg-white rounded-xl shadow-md mt-4 text-gray-500">
              <p className="text-lg">Продукты не найдены</p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 mt-4">
            {products.map((prod) => (
              <ProductCard
                key={prod.barcode}
                product={prod}
                onAdd={() => handleAddToBasket(prod)}
              />
            ))}
          </div>

          {/* PAGINATION */}
          <div className="flex gap-3 mt-4">
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
            >
              Prev
            </button>
            <button
              disabled={page + 1 >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
            >
              Next
            </button>
          </div>
        </div>

        {/* RIGHT: BASKET */}
        <Basket
          basket={basket}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
          onRemove={handleRemove}
          onSell={handleSell}
        />
      </div>

      <AddProductModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={fetchProducts}
      />
    </div>
  );
}