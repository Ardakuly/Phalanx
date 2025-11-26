import axiosInstance from "./axios";

export async function signUp(payload) {
  try {
    const response = await axiosInstance.post("/sign-up", payload);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Sign up failed");
    } else {
      throw new Error(error.message);
    }
  }
}

export async function signIn(payload) {
  try {
    const response = await axiosInstance.post("/sign-in", payload);
    return response.data; // assuming server returns { token: "..." }
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Invalid credentials");
    } else {
      throw new Error(error.message);
    }
  }
}
