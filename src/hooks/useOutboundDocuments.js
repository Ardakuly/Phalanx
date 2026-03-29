import { useState, useEffect } from "react";
import { getOutboundDocuments } from "../api/outboundDocument";
import { toast } from "react-toastify";

export function useOutboundDocuments() {
  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("DESC");
  const [paymentType, setPaymentType] = useState(null);
  const [createdFrom, setCreatedFrom] = useState("");
  const [createdTo, setCreatedTo] = useState("");

  // Fetch documents (debounced for search)
  useEffect(() => {
    const timer = setTimeout(() => fetchDocuments(), 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortBy, sortDirection, search, paymentType, createdFrom, createdTo]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const filters = {
        page,
        pageSize,
        search,
        paymentType,
        createdFrom: createdFrom || null,
        createdTo: createdTo || null,
        sortBy,
        sortDirection,
      };
      
      const data = await getOutboundDocuments(filters);

      setDocuments(data.outboundDocuments || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to fetch receipts");
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
    paymentType,
    setPaymentType,
    createdFrom,
    setCreatedFrom,
    createdTo,
    setCreatedTo,
    fetchDocuments,
  };
}
