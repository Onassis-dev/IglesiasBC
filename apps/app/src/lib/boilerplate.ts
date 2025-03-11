import axios from "axios";
import { showError } from "./showFunctions";
import { useUIStore } from "@/lib/store";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem("userId");
      location.href = "/login?redirect=/";
      return showError(error);
    }
    if (error.response.data.message === "NOCHURCH") {
      localStorage.removeItem("churchId");
      useUIStore.getState().setRegisterOpen(true);
      return;
    }
    return Promise.reject(error);
  }
);

api.defaults.withCredentials = true;
