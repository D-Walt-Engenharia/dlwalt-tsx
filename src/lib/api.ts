import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
    // Allows a local/staging API for tests without sending applications to production.
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.dwalt.net/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(
    (config) => {
        // Check if running on client side before accessing cookies
        if (typeof window !== "undefined") {
            const token = Cookies.get("token"); // token saved in cookies

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
