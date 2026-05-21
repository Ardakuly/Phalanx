import { useState, useEffect } from "react";
import { getInboundDocuments } from "../api/inboundDocument";
import { toast } from "react-toastify";

export function useInboundDocuments() {
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
        createdFrom: createdFrom ? `${createdFrom}T00:00:00` : null,
        createdTo: createdTo ? `${createdTo}T23:59:59` : null,
        sortBy,
        sortDirection,
      };
      
      const data = await getInboundDocuments(filters);

      setDocuments(data.inboundDocuments || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to fetch inbound documents");
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
