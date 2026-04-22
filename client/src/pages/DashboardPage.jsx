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

  // ✅ FIX: moved inside component
  const [totalSearches, setTotalSearches] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [topKeyword, setTopKeyword] = useState("");

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
      const jobs = data.searchJobs || [];

      setSearchHistory(jobs);

      // 📊 Stats
      setTotalSearches(jobs.length);

      const total = jobs.reduce(
        (sum, job) => sum + (job.totalProductsSaved || 0),
        0
      );
      setTotalProducts(total);

      const keywordMap = {};
      jobs.forEach((job) => {
        keywordMap[job.keyword] =
          (keywordMap[job.keyword] || 0) + 1;
      });

      const top = Object.keys(keywordMap).reduce(
        (a, b) => (keywordMap[a] > keywordMap[b] ? a : b),
        ""
      );

      setTopKeyword(top || "N/A");
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

      const { data } = await api.post(
        "/search",
        { keyword },
        getAuthConfig()
      );

      setSearchMessage(
        data.message || "Search job created successfully"
      );
      setKeyword("");
      await fetchSearchHistory();
    } catch (error) {
      setSearchError(
        error.response?.data?.message ||
          "Failed to create search job"
      );
    } finally {
      setSearchLoading(false);
    }
  };

  const handleGenerateProducts = async (jobId) => {
    try {
      setGenerateLoadingId(jobId);
      saveSelectedJobId(jobId);

      await api.post(
        `/search/${jobId}/generate-products`,
        {},
        getAuthConfig()
      );

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
      <div className="min-h-screen flex items-center justify-center">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="bg-white shadow-lg rounded-2xl p-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="mb-8">
            Create search jobs and generate real product data.
          </p>

          {/* ✅ NEW SUMMARY UI */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg">
              <h2 className="text-sm opacity-80">Total Searches</h2>
              <p className="text-3xl font-bold">{totalSearches}</p>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg">
              <h2 className="text-sm opacity-80">Total Products</h2>
              <p className="text-3xl font-bold">{totalProducts}</p>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg">
              <h2 className="text-sm opacity-80">Top Keyword</h2>
              <p className="text-2xl font-bold">{topKeyword}</p>
            </div>
          </div>

          {/* USER INFO */}
          {user && (
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div>Name: {user.name}</div>
              <div>Email: {user.email}</div>
              <div>Country: {user.country}</div>
            </div>
          )}

          {/* SEARCH FORM */}
          <form onSubmit={handleCreateSearch}>
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search keyword"
            />

            <button type="submit">
              {searchLoading ? "Creating..." : "Create Search"}
            </button>
          </form>
        </div>

        {/* SEARCH HISTORY */}
        <div className="bg-white shadow-lg rounded-2xl p-8">
          <h2 className="text-xl font-bold mb-4">Search History</h2>

          {searchHistory.map((job) => (
            <div key={job._id}>
              {job.keyword} - {job.status}
              <button onClick={() => handleGenerateProducts(job._id)}>
                Generate
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;