import axios from "axios";

const API_URL = "http://13.203.92.53:5000";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;
