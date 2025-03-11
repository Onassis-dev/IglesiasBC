import { api } from "@/lib/boilerplate";

export const logout = async (cb: any) => {
  await api.post("/auth/logout");
  localStorage.clear();
  cb();
};

export const saveUserData = (userData: any[]) => {
  Object.keys(userData).forEach((key: any) => {
    localStorage.setItem(key, userData[key]);
  });
};
