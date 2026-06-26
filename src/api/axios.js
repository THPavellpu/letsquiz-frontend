import axios from "axios";

const api = axios.create({

    baseURL: "http://127.0.0.1:8000/api",
    headers: {
        "Content-Type": "application/json"
    }

});


api.interceptors.request.use(

    (config) => {

        const token = localStorage.getItem("access");

        if (token) {

            config.headers.Authorization = `Bearer ${token}`;

        }

        return config;

    },

    (error) => {

        return Promise.reject(error);

    }

);

// Response interceptor to handle token expiration
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const responseData = error.response?.data;
        const errorMessage = responseData?.detail || JSON.stringify(responseData) || "";

        // Check if token is invalid or expired
        const isTokenError =
            error.response?.status === 401 && (
                errorMessage.includes("token_not_valid") ||
                errorMessage.includes("Given token not valid for any token type") ||
                errorMessage.includes("Token is invalid") ||
                errorMessage.includes("Token has expired")
            );

        if (isTokenError) {
            // Remove tokens from localStorage
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");

            // Show session expired message and redirect to login
            // Use a small timeout to allow the message to be seen
            setTimeout(() => {
                window.location.href = "/login";
            }, 100);
        }

        return Promise.reject(error);
    }
);

export default api;