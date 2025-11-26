import { useEffect, useState } from "react";
import Header from "../components/Header";
import Input from "../components/Input";
import ProductCard from "../components/ProductCard";
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
    const timer = setTimeout(() => fetchProducts(), 300); // debounce search
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

  const handleAddProduct = () => alert("Add Product Clicked!");
  const handleReportClick = (type) => alert(`Report clicked: ${type}`);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header
        page="products"
        user={user}
        onAddProduct={handleAddProduct}
        onReportClick={handleReportClick}
      />

      <div className="flex p-4 gap-6">
        {/* Products List */}
        <div className="flex-1">
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

        {/* Basket */}
        <div className="w-1/3 bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-2">Basket</h2>
          {basket.length === 0 && <p>No products added</p>}
          {basket.map((item, index) => (
            <div key={index} className="flex justify-between py-1">
              <span>{item.name}</span>
              <span>{item.sellingPrice}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
