import axiosInstance from "./axios";

/**
 * Fetches good return documents (return receipts) with filtering and pagination.
 * 
 * @param {Object} filters - Filter criteria
 * @param {number} filters.page - Page number (0-indexed)
 * @param {number} filters.pageSize - Number of items per page
 * @param {string} filters.search - Search by document number, external ID, or product names
 * @param {string} filters.createdFrom - ISO date string
 * @param {string} filters.createdTo - ISO date string
 * @param {string} filters.sortBy - Field to sort by
 * @param {string} filters.sortDirection - Sort direction ("ASC" or "DESC")
 */
export const getGoodReturnDocuments = async (filters = {}) => {
  const payload = {
    page: filters.page ?? 0,
    pageSize: filters.pageSize ?? 10,
    search: filters.search ?? "",
    createdFrom: filters.createdFrom ?? null,
    createdTo: filters.createdTo ?? null,
    sortBy: filters.sortBy ?? "createdAt",
    sortDirection: filters.sortDirection ?? "DESC",
  };

  const response = await axiosInstance.post("/good-return-documents", payload);
  return response.data;
};

/**
 * Creates a new good return document.
 * 
 * @param {Object} payload - Good return document creation data
 * @param {string} payload.outboundDocumentNumber - Number of the original outbound document
 * @param {string} payload.comment - Reason or comment for the return
 * @param {Array} payload.goods - List of goods to return
 * @param {string} payload.goods[].barcode - Barcode of the product
 * @param {number} payload.goods[].quantity - Quantity being returned
 */
export const createGoodReturnDocument = async (payload) => {
  const response = await axiosInstance.post("/good-return-documents", payload);
  return response.data;
};
