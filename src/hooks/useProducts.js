import { useState, useEffect } from "react";
import { getProducts } from "../api/product";
import { toast } from "react-toastify";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("DESC");

  // Reset page to 0 on search change
  useEffect(() => {
    setPage(0);
  }, [search]);

  // Fetch products (debounced)
  useEffect(() => {
    const timer = setTimeout(() => fetchProducts(), 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortBy, sortDirection, search]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const payload = { page, pageSize, search, sortBy, sortDirection };
      const data = await getProducts(payload);

      setProducts(data.products || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to fetch products");
    }
    setLoading(false);
  };

  return {
    products,
    search,
    setSearch,
    page,
    setPage,
    pageSize,
    totalPages,
    loading,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    fetchProducts,
  };
}
