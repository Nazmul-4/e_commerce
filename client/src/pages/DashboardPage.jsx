import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api, { getAuthConfig } from "../services/api";
import { saveSelectedJobId } from "../utils/selectedJob";
function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchMessage, setSearchMessage] = useState("");
  const [searchError, setSearchError] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const [generateLoadingId, setGenerateLoadingId] = useState("");

  const fetchCurrentUser = async () => {
    try {
      const { data } = await api.get("/auth/me", getAuthConfig());
      setUser(data.user);
    } catch (error) {
      console.error("Failed to fetch current user:", error.message);
    }
  };

  const fetchSearchHistory = async () => {
    try {
      const { data } = await api.get("/search/my-history", getAuthConfig());
      setSearchHistory(data.searchJobs || []);
    } catch (error) {
      console.error("Failed to fetch search history:", error.message);
    }
  };

  const handleCreateSearch = async (e) => {
    e.preventDefault();

    setSearchMessage("");
    setSearchError("");

    if (!keyword.trim()) {
      setSearchError("Please enter a keyword");
      return;
    }

    try {
      setSearchLoading(true);

      const { data } = await api.post("/search", { keyword }, getAuthConfig());

      setSearchMessage(data.message || "Search job created successfully");
      setKeyword("");
      await fetchSearchHistory();
    } catch (error) {
      setSearchError(
        error.response?.data?.message ||
        "Failed to create search job. Please try again."
      );
    } finally {
      setSearchLoading(false);
    }
  };

  const handleGenerateProducts = async (jobId) => {
    try {
      setGenerateLoadingId(jobId);
      saveSelectedJobId(jobId);

      await api.post(`/search/${jobId}/generate-products`, {}, getAuthConfig());

      await fetchSearchHistory();
    } catch (error) {
      console.error("Failed to generate products:", error.message);
    } finally {
      setGenerateLoadingId("");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchCurrentUser();
      await fetchSearchHistory();
      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-lg font-medium text-slate-700">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="bg-white shadow-lg rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Dashboard</h1>
          <p className="text-slate-600 mb-8">
            Create search jobs and generate real product data.
          </p>

          {user && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
            </div>
          )}

          <form onSubmit={handleCreateSearch} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Product Keyword
              </label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Example: shirt, bag, jacket"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>

            {searchError && (
              <p className="text-red-600 text-sm font-medium">{searchError}</p>
            )}

            {searchMessage && (
              <p className="text-green-600 text-sm font-medium">{searchMessage}</p>
            )}

            <button
              type="submit"
              disabled={searchLoading}
              className="bg-slate-800 text-white px-6 py-3 rounded-xl hover:bg-slate-900 transition disabled:opacity-50"
            >
              {searchLoading ? "Creating Search..." : "Create Search Job"}
            </button>
          </form>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Search History</h2>

          {searchHistory.length === 0 ? (
            <p className="text-slate-600">No search history found yet.</p>
          ) : (
            <div className="space-y-4">
              {searchHistory.map((job) => (
                <div
                  key={job._id}
                  className="border border-slate-200 rounded-xl p-4 bg-slate-50"
                >
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
                    <div>
                      <p className="text-xs text-slate-500">Keyword</p>
                      <p className="font-semibold text-slate-800">{job.keyword}</p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">Country</p>
                      <p className="font-semibold text-slate-800">{job.country}</p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">Currency</p>
                      <p className="font-semibold text-slate-800">{job.currency}</p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">Status</p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${job.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : job.status === "running"
                              ? "bg-blue-100 text-blue-700"
                              : job.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                      >
                        {job.status}
                      </span>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">Products Saved</p>
                      <p className="font-semibold text-slate-800">{job.totalProductsSaved}</p>
                    </div>

                    <div>
                      <button
                        onClick={() => handleGenerateProducts(job._id)}
                        disabled={generateLoadingId === job._id}
                        className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
                      >
                        {generateLoadingId === job._id
                          ? "Generating..."
                          : "Generate Products"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;