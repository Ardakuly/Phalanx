import axiosInstance from "./axios";

export const startInventarization = async () => {
  const res = await axiosInstance.post("/inventarization/start");
  return res.data;
};

export const getInventarization = async (id) => {
  const res = await axiosInstance.get(`/inventarization/${id}`);
  return res.data;
};

export const updateCount = async (id, productId, countedQuantity) => {
  const body = {
    productId,
    countedQuantity,
  };
  const res = await axiosInstance.post(`/inventarization/${id}/count`, body);
  return res.data;
};

export const completeInventarization = async (id) => {
  const res = await axiosInstance.post(`/inventarization/${id}/complete`);
  return res.data;
};

export const getActiveInventarization = async () => {
    try {
        const res = await axiosInstance.get("/inventarization/active");
        return res.data;
    } catch (e) {
        if (e.response && e.response.status === 404) {
            return null;
        }
        throw e;
    }
};

export const getInventarizations = async (filters = {}) => {
  const payload = {
    page: filters.page ?? 0,
    pageSize: filters.pageSize ?? 10,
    status: filters.status ?? null,
    conductedBy: filters.conductedBy ?? null,
    startedFrom: filters.startedFrom ?? null,
    startedTo: filters.startedTo ?? null,
    completedFrom: filters.completedFrom ?? null,
    completedTo: filters.completedTo ?? null,
    sortBy: filters.sortBy ?? "id",
    sortDirection: filters.sortDirection ?? "DESC",
  };
  const res = await axiosInstance.post("/inventarization", payload);
  return res.data;
};
