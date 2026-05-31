const { default: axios } = require("axios");

export const BASE_URL = "https://linkedin-clone-backend-nqks.onrender.com" // ← remove trailing slash
export const clientServer = axios.create({
  baseURL: BASE_URL,
});