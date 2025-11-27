import { useEffect, useState } from "react";
import Header from "../components/Header";
import Input from "../components/Input";
import ProductCard from "../components/ProductCard";
import AddProductModal from "../components/AddProductModal";
import { getProducts } from "../api/product";
import { getUser } from "../api/user";

export default function Products() {
  const [user, setUser] = useState({});
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [basket, setBasket] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const [openModal, setOpenModal] = useState(false); // ← MODAL STATE

  // Load user info
  useEffect(() => {
    async function fetchUser() {
      const data = await getUser();
      setUser(data);
    }
    fetchUser();
  }, []);

  // Load products from backend
  useEffect(() => {
    const timer = setTimeout(() => fetchProducts(), 300);
    return () => clearTimeout(timer);
  }, [search, page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts({
        page,
        pageSize,
        search,
        sortBy: "createdAt",
        sortDirection: "DESC",
      });

      setProducts(data.products || []);
      setTotalPages(data.totalPages || 0);
    } catch (e) {
      console.error("Failed to fetch products", e);
    }
    setLoading(false);
  };

  const handleAddToBasket = (product) => {
    setBasket((prev) => [...prev, product]);
  };

  // ---- OPEN MODAL instead of alert ----
  const handleAddProduct = () => setOpenModal(true);

  const handleReportClick = (type) => alert(`Report clicked: ${type}`);

  const refreshAfterAdd = () => fetchProducts(); // refresh UI after modal submit

  return (
    <div className="min-h-screen bg-gray-100h-full bg-gray-100 flex flex-col">
      <Header
        page="products"
        user={user}
        onAddProduct={handleAddProduct}
        onReportClick={handleReportClick}
      />

      <div className="flex p-4 gap-6 flex-1 overflow-hidden">

        {/* LEFT: Products */}
        <div className="flex-1 overflow-y-auto">
          <Input
            label="Search Products"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            name="search"
          />

          {loading && <p className="text-gray-500 mt-3">Loading...</p>}

          <div className="grid grid-cols-3 gap-4 mt-4">
            {products.map((prod) => (
              <ProductCard
                key={prod.externalId}
                product={prod}
                onAdd={() => handleAddToBasket(prod)}
              />
            ))}
          </div>

          {/* Pagination */}
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

        {/* RIGHT: Basket section */}
        <div className="w-1/3 bg-white p-4 rounded-xl shadow-md flex flex-col h-full min-h-0">
          <h2 className="text-lg font-semibold mb-3">Basket</h2>

          <div className="flex-1 overflow-y-auto mb-3">
            {basket.length === 0 && <p className="text-gray-500">No products added</p>}

            {basket.map((item, index) => (
              <div key={index} className="flex justify-between py-2 border-b text-sm">
                <span>{item.name}</span>
                <span className="font-semibold">{item.sellingPrice} ₸</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-3 shrink-0">
            <div className="flex justify-between text-lg font-semibold mb-2">
              <span>Total:</span>
              <span>
                {basket.reduce((acc, item) => acc + item.sellingPrice, 0)} ₸
              </span>
            </div>

            <button
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-center font-medium"
              onClick={() => alert("Sell clicked")}
              disabled={basket.length === 0}
            >
              Sell
            </button>
          </div>
        </div>
      </div>

      {/* MODAL RENDER */}
      <AddProductModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={refreshAfterAdd}
      />
    </div>
  );
}
