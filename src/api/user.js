import axiosInstance from "./axios";

export const getUser = async () => {
  const res = await axiosInstance.get("/user");
  return res.data;
};

export const getUsers = async () => {
  const res = await axiosInstance.get("/user/all");
  return res.data;
};

export const changeUserRole = async (email, role) => {
  return axiosInstance.patch(`/user/${email}/role`, null, {
    params: { role }
  });
};

export const enableUser = async (email) => {
  return axiosInstance.patch(`/user/${email}/enable`);
};

export const disableUser = async (email) => {
  return axiosInstance.patch(`/user/${email}/disable`);
};