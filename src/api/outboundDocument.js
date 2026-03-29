import axiosInstance from "./axios";

/**
 * Fetches outbound documents (receipts) with filtering and pagination.
 * 
 * @param {Object} filters - Filter criteria
 * @param {number} filters.page - Page number (0-indexed)
 * @param {number} filters.pageSize - Number of items per page
 * @param {string} filters.search - Search by seller email, document number, or product name
 * @param {string} filters.paymentType - Payment type (e.g., "CASH", "CARD")
 * @param {string} filters.createdFrom - ISO date string
 * @param {string} filters.createdTo - ISO date string
 * @param {string} filters.sortBy - Field to sort by
 * @param {string} filters.sortDirection - Sort direction ("ASC" or "DESC")
 */
export const getOutboundDocuments = async (filters = {}) => {
  const payload = {
    page: filters.page ?? 0,
    pageSize: filters.pageSize ?? 20,
    search: filters.search ?? "",
    paymentType: filters.paymentType ?? null,
    createdFrom: filters.createdFrom ?? null,
    createdTo: filters.createdTo ?? null,
    sortBy: filters.sortBy ?? "createdAt",
    sortDirection: filters.sortDirection ?? "DESC",
  };

  const response = await axiosInstance.post("/outbound-document", payload);
  return response.data;
};
