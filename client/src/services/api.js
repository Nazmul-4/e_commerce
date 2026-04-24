import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",

  // ✅ COOKIE PART START
  // This allows browser to send/receive HTTP-only cookies with API requests
  withCredentials: true,
  // ✅ COOKIE PART END
});

export const getAuthConfig = () => {
  // ✅ COOKIE PART START
  // Token is now stored in HTTP-only cookie, so frontend does not need Authorization header.
  // Keeping this function because your existing files already call getAuthConfig().
  return {
    withCredentials: true,
  };
  // ✅ COOKIE PART END
};

export default api;