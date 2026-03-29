import { useState, useEffect } from "react";
import { getGoodReturnDocuments } from "../api/goodReturnDocument";
import { toast } from "react-toastify";

export function useGoodReturnDocuments() {
  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("DESC");
  const [createdFrom, setCreatedFrom] = useState("");
  const [createdTo, setCreatedTo] = useState("");

  // Fetch documents (debounced for search)
  useEffect(() => {
    const timer = setTimeout(() => fetchDocuments(), 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortBy, sortDirection, search, createdFrom, createdTo]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const filters = {
        page,
        pageSize,
        search,
        createdFrom: createdFrom || null,
        createdTo: createdTo || null,
        sortBy,
        sortDirection,
      };
      
      const data = await getGoodReturnDocuments(filters);

      setDocuments(data.goodReturnDocuments || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to fetch return receipts");
    } finally {
      setLoading(false);
    }
  };

  return {
    documents,
    search,
    setSearch,
    page,
    setPage,
    pageSize,
    totalPages,
    totalElements,
    loading,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    createdFrom,
    setCreatedFrom,
    createdTo,
    setCreatedTo,
    fetchDocuments,
  };
}
