import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { getAuthConfig } from "../services/api";

function DashboardPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const fetchCurrentUser = async () => {
    try {
      const { data } = await api.get("/auth/me", getAuthConfig());
      setUser(data.user);
    } catch (error) {
      console.error("Failed to fetch current user:", error.message);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-lg font-medium text-slate-700">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
            <p className="text-slate-600 mt-2">
              Welcome to your country-based product dashboard
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-5 py-2.5 rounded-xl hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {user && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
              <h2 className="text-sm text-slate-500 mb-1">Name</h2>
              <p className="text-lg font-semibold text-slate-800">{user.name}</p>
            </div>

            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
              <h2 className="text-sm text-slate-500 mb-1">Email</h2>
              <p className="text-lg font-semibold text-slate-800">{user.email}</p>
            </div>

            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
              <h2 className="text-sm text-slate-500 mb-1">Country</h2>
              <p className="text-lg font-semibold text-slate-800">{user.country}</p>
            </div>

            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
              <h2 className="text-sm text-slate-500 mb-1">User ID</h2>
              <p className="text-sm font-medium text-slate-800 break-all">
                {user._id}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;