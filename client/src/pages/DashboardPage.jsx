import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { getAuthConfig } from "../services/api";

function DashboardPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchMessage, setSearchMessage] = useState("");
  const [searchError, setSearchError] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [products, setProducts] = useState([]);
  const [productLoading, setProductLoading] = useState(false);

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

  const fetchProductsByJob = async (jobId) => {
    try {
      setProductLoading(true);
      const { data } = await api.get(`/search/${jobId}/products`, getAuthConfig());
      setProducts(data.products || []);
    } catch (error) {
      console.error("Failed to fetch products:", error.message);
      setProducts([]);
    } finally {
      setProductLoading(false);
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
      setProductLoading(true);

      await api.post(`/search/${jobId}/generate-products`, {}, getAuthConfig());

      setSelectedJobId(jobId);
      await fetchSearchHistory();
      await fetchProductsByJob(jobId);
    } catch (error) {
      console.error("Failed to generate products:", error.message);
    } finally {
      setProductLoading(false);
    }
  };

  const handleViewProducts = async (jobId) => {
    setSelectedJobId(jobId);
    await fetchProductsByJob(jobId);
  };

  useEffect(() => {
    const loadDashboard = async () => {
      await fetchCurrentUser();
      await fetchSearchHistory();
      setLoading(false);
    };

    loadDashboard();
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
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-white shadow-lg rounded-2xl p-8">
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

          <div className="border-t pt-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              Search Products
            </h2>

            <form onSubmit={handleCreateSearch} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Product Keyword
                </label>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Example: smart watch"
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>

              {searchError && (
                <p className="text-red-600 text-sm font-medium">{searchError}</p>
              )}

              {searchMessage && (
                <p className="text-green-600 text-sm font-medium">
                  {searchMessage}
                </p>
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
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Search History
          </h2>

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
                      <p className="font-semibold text-slate-800">{job.status}</p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">Products Saved</p>
                      <p className="font-semibold text-slate-800">
                        {job.totalProductsSaved}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleGenerateProducts(job._id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
                      >
                        Generate Products
                      </button>

                      <button
                        onClick={() => handleViewProducts(job._id)}
                        className="bg-slate-700 text-white px-4 py-2 rounded-xl hover:bg-slate-800 transition"
                      >
                        View Products
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Product List
          </h2>

          {!selectedJobId ? (
            <p className="text-slate-600">
              Select a search job and generate/view products.
            </p>
          ) : productLoading ? (
            <p className="text-slate-600">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="text-slate-600">No products found for this search job.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="border border-slate-200 rounded-2xl p-5 bg-slate-50"
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-40 object-cover rounded-xl mb-4"
                  />

                  <h3 className="text-lg font-bold text-slate-800 mb-2">
                    {product.title}
                  </h3>

                  <p className="text-slate-700 mb-1">
                    <span className="font-semibold">Price:</span> {product.priceText}
                  </p>

                  <p className="text-slate-700 mb-1">
                    <span className="font-semibold">Currency:</span> {product.currency}
                  </p>

                  <p className="text-slate-700 mb-1">
                    <span className="font-semibold">Rating:</span> {product.rating}
                  </p>

                  <p className="text-slate-700 mb-1">
                    <span className="font-semibold">Reviews:</span> {product.reviewCount}
                  </p>

                  <p className="text-slate-700 mb-3">
                    <span className="font-semibold">Source:</span> {product.sourceSite}
                  </p>

                  <a
                    href={product.productUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block bg-slate-800 text-white px-4 py-2 rounded-xl hover:bg-slate-900 transition"
                  >
                    View Product
                  </a>
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