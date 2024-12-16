import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // Flask backend URL
  withCredentials: true, // Include cookies for authentication
});
