import axiosInstance from "./axios";

export const getProducts = async (filters = {}) => {
  const body = {
    page: filters.page ?? 0,
    pageSize: filters.pageSize ?? 20,
    search: filters.search ?? "",
    category: filters.category ?? null,
    priceFrom: filters.priceFrom ?? null,
    priceTo: filters.priceTo ?? null,
    stockBalanceFrom: filters.stockBalanceFrom ?? null,
    stockBalanceTo: filters.stockBalanceTo ?? null,
    createdFrom: filters.createdFrom ?? null,
    createdTo: filters.createdTo ?? null,
    sortBy: filters.sortBy ?? "createdAt",
    sortDirection: filters.sortDirection ?? "DESC",
  };

  const res = await axiosInstance.post("/product", body);
  return res.data;
};

export const getProductByBarcode = async (barcode) => {
  const res = await axiosInstance.get(`/product/barcode/${barcode}`);
  return res.data;
};

export const getProductByName = async (name) => {
  const res = await axiosInstance.get(`/product/name/${name}`);
  return res.data;
};


export const addProductsToStock = async (products) => {
  try {
    // products MUST be an array of ProductRequestDto
    // ProductRequestDto:
    // name, barcode, unit, category, purchasedPrice, sellingPrice, stockBalance, photoUrl
    const res = await axiosInstance.post(
      "/admin/inbound-document/add",
      products
    );

    return res.data;
  } catch (error) {
    console.error("Failed to add products to stock", error);
    throw error;
  }
};

export const sellProduts = async (products) => {
  try {
    // products MUST be an array of ProductRequestDto
    // ProductRequestDto:
    // name, barcode, unit, category, purchasedPrice, sellingPrice, stockBalance, photoUrl
    const res = await axiosInstance.post(
      "/outbound-document/sell",
      products
    );

    return res.data;
  } catch (error) {
    console.error("Failed to sell products", error);
    throw error;
  }
};