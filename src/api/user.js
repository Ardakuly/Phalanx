import axiosInstance from "./axios";

export const getUser = async () => {
  const res = await axiosInstance.get("/user");
  return res.data;
};

export const getUsers = async () => {
  const res = await axiosInstance.get("/user/all");
  return res.data;
};

export const updateUser = async () => {
  const res = await axiosInstance.updateUser("/user");
  return res.data;
};