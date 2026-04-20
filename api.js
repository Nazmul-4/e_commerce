import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export default api;