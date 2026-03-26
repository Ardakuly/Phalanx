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
