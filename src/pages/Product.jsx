import { useEffect, useState } from "react";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import AddProductModal from "../components/AddProductModal";
import Basket from "../components/Basket";
import { getProducts } from "../api/product";
import { getUser } from "../api/user";
import { toast } from "react-toastify";

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

  // Fetch products
  useEffect(() => {
    const timer = setTimeout(() => fetchProducts(), 300);
    return () => clearTimeout(timer);
  }, [search, page, sortBy, sortDirection]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const payload = { page, pageSize, search, sortBy, sortDirection };
      const data = await getProducts(payload);

      setProducts(data.products || []);
      setTotalPages(data.totalPages || 0);
    } catch (e) {
      toast.error("Failed to fetch products");
    }
    setLoading(false);
  };

  // Add product to basket — using BARCODE as unique key
  const handleAddToBasket = (product) => {
    const key = product.barcode; // barcode MUST be unique

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

  const handleSell = () => {
    alert("Sell clicked");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      <Header
        page="products"
        user={user}
        onAddProduct={() => setOpenModal(true)}
        onReportClick={(type) => alert(`Report: ${type}`)}
      />

      <div className="flex p-4 gap-6 flex-1 overflow-hidden">

        {/* LEFT SIDE */}
        <div className="flex-1 overflow-y-auto p-2">

          {/* SEARCH + SORT */}
          <div className="flex gap-3 mb-3 items-center">
            <input
              type="text"
              placeholder="Search Products"
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
              <option value="createdAt:DESC">Newest</option>
              <option value="createdAt:ASC">Oldest</option>
              <option value="name:ASC">Name A→Z</option>
              <option value="name:DESC">Name Z→A</option>
              <option value="sellingPrice:ASC">Price Low→High</option>
              <option value="sellingPrice:DESC">Price High→Low</option>
              <option value="stockBalance:ASC">Stock Low→High</option>
              <option value="stockBalance:DESC">Stock High→Low</option>
            </select>
          </div>

          {loading && <p className="text-gray-500">Loading...</p>}

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