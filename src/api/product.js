import axiosInstance from "./axios";

export const getProducts = async (filters = {}) => {

    const body = {
        page: filters.page ?? 0,
        pageSize: filters.pageSize ?? 20,
        search: filters.search ?? "",
        category: filters.category ?? null,
        priceFrom: filters.priceFrom ?? 0,
        priceTo: filters.priceTo ?? 0,
        stockBalanceFrom: filters.stockBalanceFrom ?? 0,
        stockBalanceTo: filters.stockBalanceTo ?? 0,
        createdFrom: filters.createdFrom ?? null,
        createdTo: filters.createdTo ?? null,
        sortBy: filters.sortBy ?? "createdAt",
        sortDirection: filters.sortDirection ?? "DESC"
    };

  const res = await axiosInstance.post("/product", body);
  return res.data;
};

export const addProductsToStock = async (products) => {
  try {
    const res = await axiosInstance.post(
      "/admin/inbound_document/add",
      products       // must be an array of ProductRequestDto
    );
    return res.data;
  } catch (error) {
    console.error("Failed to add products to stock", error);
    throw error;
  }
};


