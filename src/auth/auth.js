import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";

export const auth = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/checkauth");
      set({ authUser: res.data });
    } catch (error) {
      console.log("Error in checkauth", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      console.log("Account created successfully");
    } catch (error) {
      console.log(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      console.log("Logged in successfully");
    } catch (error) {
      console.log(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      console.log("Logged out successfully");
    } catch (error) {
      console.log(error.response.data.message);
    }
  },
}));
