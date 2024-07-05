import axios from "axios";
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Ensure cookies are sent with requests
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config; // Define originalRequest
    const statusCode = error.response?.status;

    if (statusCode === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Attempt to refresh the token
        await axiosInstance.post(
          "http://localhost:3000/api/v1/users/refreshToken"
        );
        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export async function authorizedFetcher({ URL, signal }) {
  try {
    const response = await axiosInstance.get(URL, {
      signal,
    });
    return response.data.data;
  } catch (error) {
    if (axios.isCancel(error)) {
    } else {
      console.error(error);
      throw new Error(error.response?.data?.message || "Request failed");
    }
  }
}

export async function authorizedUpdater({ URL, body }) {
  console.log(body);
  try {
    const response = await axiosInstance.patch(URL, body);
    return response.data.data;
  } catch (error) {
    if (axios.isCancel(error)) {
    } else {
      console.error(error);
      throw new Error(error.response?.data?.message || "Request failed");
    }
  }
}

export async function authorizedRemover({ URL, body }) {
  try {
    const response = await axiosInstance.delete(URL, {
      data: body,
    });
    return response.data.data;
  } catch (error) {
    if (axios.isCancel(error)) {
    } else {
      console.error(error);
      throw new Error(error.response?.data?.message || "Request failed");
    }
  }
}

export async function authorizedCreator({ URL, body = {} }) {
  console.log({ body });
  try {
    const response = await axiosInstance.post(URL, body);
    return response.data.data;
  } catch (error) {
    if (axios.isCancel(error)) {
    } else {
      console.error(error);
      throw new Error(error.response?.data?.message || "Request failed");
    }
  }
}

export async function authorizer({ URL, body = {} }) {
  console.log({ body });
  try {
    const response = await axiosInstance.post(URL, body);
    return response.data.data;
  } catch (error) {
    if (axios.isCancel(error)) {
    } else {
      console.error(error);
      throw new Error(error.response?.data?.message || "Request failed");
    }
  }
}
