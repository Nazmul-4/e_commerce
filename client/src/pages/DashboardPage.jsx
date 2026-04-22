import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api, { getAuthConfig } from "../services/api";
import { saveSelectedJobId } from "../utils/selectedJob";

function DashboardPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchMessage, setSearchMessage] = useState("");
  const [searchError, setSearchError] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const [generateLoadingId, setGenerateLoadingId] = useState("");

  const [totalSearches, setTotalSearches] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [topKeyword, setTopKeyword] = useState("N/A");

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
      setTotalSearches(jobs.length);

      const total = jobs.reduce(
        (sum, job) => sum + (job.totalProductsSaved || 0),
        0
      );
      setTotalProducts(total);

      const keywordMap = {};
      jobs.forEach((job) => {
        keywordMap[job.keyword] = (keywordMap[job.keyword] || 0) + 1;
      });

      const keys = Object.keys(keywordMap);
      if (keys.length > 0) {
        const best = keys.reduce((a, b) =>
          keywordMap[a] > keywordMap[b] ? a : b
        );
        setTopKeyword(best);
      } else {
        setTopKeyword("N/A");
      }
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
      setSearchMessage("Products generated successfully");
    } catch (error) {
      console.error("Failed to generate products:", error.message);
      setSearchError("Failed to generate products");
    } finally {
      setGenerateLoadingId("");
    }
  };

  const handleGoToProductsPage = (jobId) => {
    saveSelectedJobId(jobId);
    navigate("/products");
  };

  const handleGoToTopProductsPage = (jobId) => {
    saveSelectedJobId(jobId);
    navigate("/top-products");
  };

  const getStatusBadgeClass = (status) => {
    if (status === "completed") {
      return "bg-emerald-100 text-emerald-700 border border-emerald-200";
    }
    if (status === "running") {
      return "bg-blue-100 text-blue-700 border border-blue-200";
    }
    if (status === "pending") {
      return "bg-amber-100 text-amber-700 border border-amber-200";
    }
    return "bg-red-100 text-red-700 border border-red-200";
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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white text-lg font-medium">
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
          <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative p-6 md:p-8">
            <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6 mb-8">
              <div>
                <p className="text-cyan-400 text-xs md:text-sm font-semibold tracking-[0.18em] uppercase mb-3">
                  Analytics Workspace
                </p>
                <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-3">
                  Product Intelligence Dashboard
                </h1>
                <p className="text-slate-300 max-w-2xl text-sm md:text-base leading-7">
                  Generate country-specific search jobs, collect products, rank them,
                  and turn raw results into polished business insights.
                </p>
              </div>

              {user && (
                <div className="rounded-[28px] bg-white/5 backdrop-blur-xl border border-white/10 p-5 min-w-[290px] shadow-xl">
                  <p className="text-slate-400 text-xs mb-1">Logged in as</p>
                  <h2 className="text-white text-lg font-bold">{user.name}</h2>
                  <p className="text-slate-300 text-sm">{user.email}</p>
                  <div className="mt-4 inline-flex items-center px-3 py-1.5 rounded-full bg-cyan-500/15 text-cyan-300 text-xs font-semibold border border-cyan-500/20">
                    Country: {user.country}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="rounded-[28px] bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-6 shadow-[0_16px_40px_rgba(34,211,238,0.2)]">
                <p className="text-sm text-white/80 mb-2">Total Searches</p>
                <h3 className="text-3xl md:text-4xl font-bold">{totalSearches}</h3>
              </div>

              <div className="rounded-[28px] bg-gradient-to-r from-emerald-600 to-green-500 text-white p-6 shadow-[0_16px_40px_rgba(34,197,94,0.2)]">
                <p className="text-sm text-white/80 mb-2">Total Products</p>
                <h3 className="text-3xl md:text-4xl font-bold">{totalProducts}</h3>
              </div>

              <div className="rounded-[28px] bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white p-6 shadow-[0_16px_40px_rgba(168,85,247,0.2)]">
                <p className="text-sm text-white/80 mb-2">Top Keyword</p>
                <h3 className="text-2xl md:text-3xl font-bold capitalize">
                  {topKeyword}
                </h3>
              </div>
            </div>

            <div className="rounded-[28px] bg-white/5 backdrop-blur-xl border border-white/10 p-5 md:p-6">
              <h2 className="text-white text-xl md:text-2xl font-bold mb-4">
                Create New Search Job
              </h2>

              <form onSubmit={handleCreateSearch} className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Product Keyword
                  </label>
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Try: shirt, ring, bag, shoes, watch"
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/70 text-white px-4 py-3.5 outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                {searchError && (
                  <div className="rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 text-sm">
                    {searchError}
                  </div>
                )}

                {searchMessage && (
                  <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-4 py-3 text-sm">
                    {searchMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={searchLoading}
                  className="rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600 hover:opacity-95 disabled:opacity-50 text-white font-semibold px-6 py-3.5 transition shadow-[0_16px_40px_rgba(59,130,246,0.35)]"
                >
                  {searchLoading ? "Creating Search..." : "Create Search Job"}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="rounded-[32px] bg-slate-900 border border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.35)] p-6 md:p-8">
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Search History
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Generate, view products, or open top-ranked products.
            </p>
          </div>

          {searchHistory.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-white/10 bg-slate-950/40 p-8 text-center text-slate-400">
              No search history found yet.
            </div>
          ) : (
            <div className="space-y-4">
              {searchHistory.map((job) => (
                <div
                  key={job._id}
                  className="rounded-[28px] bg-slate-950/60 border border-white/10 p-5 hover:border-cyan-500/30 transition"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 items-end">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Keyword</p>
                      <p className="font-semibold text-white capitalize">
                        {job.keyword}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500 mb-1">Country</p>
                      <p className="font-semibold text-slate-200">
                        {job.country}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500 mb-1">Currency</p>
                      <p className="font-semibold text-slate-200">
                        {job.currency}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500 mb-1">Status</p>
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(
                          job.status
                        )}`}
                      >
                        {job.status}
                      </span>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500 mb-1">Products Saved</p>
                      <p className="font-semibold text-slate-200">
                        {job.totalProductsSaved}
                      </p>
                    </div>

                    <div>
                      <button
                        onClick={() => handleGenerateProducts(job._id)}
                        disabled={generateLoadingId === job._id}
                        className="w-full rounded-2xl bg-blue-600 text-white px-4 py-3 hover:bg-blue-700 transition disabled:opacity-50 font-semibold"
                      >
                        {generateLoadingId === job._id
                          ? "Generating..."
                          : "Generate Products"}
                      </button>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleGoToProductsPage(job._id)}
                        className="w-full rounded-2xl bg-slate-800 text-white px-4 py-3 hover:bg-slate-700 transition font-semibold"
                      >
                        View Products
                      </button>

                      <button
                        onClick={() => handleGoToTopProductsPage(job._id)}
                        className="w-full rounded-2xl bg-emerald-600 text-white px-4 py-3 hover:bg-emerald-700 transition font-semibold"
                      >
                        View Top Products
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