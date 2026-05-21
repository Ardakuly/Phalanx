import axiosInstance from "./axios";

/**
 * Fetches inbound documents with filtering and pagination.
 * 
 * @param {Object} filters - Filter criteria
 * @param {number} filters.page - Page number (0-indexed)
 * @param {number} filters.pageSize - Number of items per page
 * @param {string} filters.search - Search term
 * @param {string} filters.createdFrom - ISO date string
 * @param {string} filters.createdTo - ISO date string
 * @param {string} filters.sortBy - Field to sort by
 * @param {string} filters.sortDirection - Sort direction ("ASC" or "DESC")
 */
export const getInboundDocuments = async (filters = {}) => {
  const payload = {
    page: filters.page ?? 0,
    pageSize: filters.pageSize ?? 10,
    search: filters.search ?? "",
    createdFrom: filters.createdFrom ?? null,
    createdTo: filters.createdTo ?? null,
    sortBy: filters.sortBy ?? "createdAt",
    sortDirection: filters.sortDirection ?? "DESC",
  };

  const response = await axiosInstance.post("/admin/inbound-document/search", payload);
  return response.data;
};

/**
 * Updates an existing inbound document good's details.
 * 
 * @param {Object} payload - Update payload
 * @param {string} payload.externalId - Required
 * @param {number} payload.purchasedPrice - Optional
 * @param {number} payload.sellingPrice - Optional
 * @param {number} payload.quantity - Optional
 * @param {string} payload.unit - Optional
 * @param {string} payload.name - Optional
 * @param {string} payload.category - Optional
 */
export const updateInboundGood = async (payload) => {
  const response = await axiosInstance.put("/admin/inbound-document/update", payload);
  return response.data;
};
