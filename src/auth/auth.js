import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import Clerk from "@clerk/clerk-js";


const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const clerk = new Clerk(PUBLISHABLE_KEY); 

export const auth = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: true,
  authProvider: null,
/*
  checkAuth: async () => {
    try {
      // Try local authentication first
      const res = await axiosInstance.get("/auth/checkauth");
      set({
        authUser: res.data,
        authProvider: "local",
        isCheckingAuth: false
      });
    } catch (error) {
      // If no al user, check Clerk session
      try {
        // Note: useClerkAuth cannot be used directly in async functions
        // We'll use Clerk.session instead
        await clerk.load();
        const session = clerk.session;

        if(!session) {
          console.warn("No active clerk session");
        }

        if (session) {
          const token = await session.getToken(); // Get Clerk token
          if(!token) throw new Error("Failed to retrieve Clerk Token");

          // Send token to backend for Clerk user authentication
          const res = await axiosInstance.get("/auth/checkauth", {
            headers: { Authorization: `Bearer ${token}` },
          });

          set({
            authUser: res.data,
            authProvider: "clerk",
            isCheckingAuth: false
          });
        } else {
          set({ 
            authUser: null, 
            authProvider: null,
            isCheckingAuth: false 
          });
        }
      } catch (clerkError) {
        console.error("Error during Clerk authentication:", clerkError);
        set({ 
          authUser: null, 
          authProvider: null,
          isCheckingAuth: false 
        });
      } finally {
        set({ isCheckingAuth: false });
      }
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
    const { authProvider } = get();
    try {
      if (authProvider === "local") {
        await axiosInstance.post("/auth/logout");
        set({ 
          authUser: null 
        });
      } else if (authProvider === "clerk") {
        await clerk.signOut();
        set({ 
          authUser: null
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      set({ 
        authUser: null,
      });
      console.log("Logged out successfully");
    }
  },
}));
*/
checkAuth: async () => {
  try {
    // Skip local authentication and check Clerk session directly
    await clerk.load();
    const session = clerk.session;

    if (!session) {
      console.warn("No active Clerk session");
      set({
        authUser: null,
        authProvider: null,
        isCheckingAuth: false
      });
      return;
    }

    const token = await session.getToken(); // Get Clerk token
    if (!token) throw new Error("Failed to retrieve Clerk Token");

    set({
      authUser: session.user,
      authProvider: "clerk",
      isCheckingAuth: false
    });
  } catch (error) {
    console.error("Clerk authentication error:", error);
    set({
      authUser: null,
      authProvider: null,
      isCheckingAuth: false
    });
  }
},

login: async (formData) => {
  set({ isLoggingIn: true });
  try {
    const res = await axiosInstance.post("/auth/login", formData);
    set({
      authUser: res.data,
      authProvider: "local",
      isLoggingIn: false
    });
  } catch (error) {
    console.error("Login error:", error);
    set({ isLoggingIn: false });
  }
},
signup: async (formData) => {
  set({ isSigningUp: true });
  try {
    const res = await axiosInstance.post("/auth/signup", formData);
    set({
      authUser: res.data,
      authProvider: "local",
      isSigningUp: false
    });
  } catch (error) {
    console.error("Sign-Up error:", error);
    set({ isSigningUp: false });
  }
},
logout: async () => {
  try {
    await axiosInstance.post("/auth/logout");
    set({
      authUser: null,
      authProvider: null
    });
  } catch (error) {
    console.error("Logout error:", error);
  }
}
}));