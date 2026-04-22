import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api, { getAuthConfig } from "../services/api";
import { getSelectedJobId, saveSelectedJobId } from "../utils/selectedJob";

function TopProductsPage() {
  const [searchHistory, setSearchHistory] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSearchHistory = async () => {
    try {
      const { data } = await api.get("/search/my-history", getAuthConfig());
      setSearchHistory(data.searchJobs || []);
    } catch (error) {
      console.error("Failed to fetch search history:", error.message);
    }
  };

  const fetchTopProductsByJob = async (jobId) => {
    try {
      setLoading(true);
      const { data } = await api.get(`/search/${jobId}/top-products`, getAuthConfig());
      setTopProducts(data.topProducts || []);
      setSelectedJobId(jobId);
      saveSelectedJobId(jobId);
    } catch (error) {
      console.error("Failed to fetch top products:", error.message);
      setTopProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async (jobId) => {
    try {
      const response = await api.get(`/search/${jobId}/download-report`, {
        ...getAuthConfig(),
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      const contentDisposition = response.headers["content-disposition"];
      let fileName = "top_products_report.csv";

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.+?)"?$/);
        if (match && match[1]) {
          fileName = match[1];
        }
      }

      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download report:", error.message);
    }
  };

  useEffect(() => {
    const loadPage = async () => {
      try {
        const { data } = await api.get("/search/my-history", getAuthConfig());
        const jobs = data.searchJobs || [];
        setSearchHistory(jobs);

        const savedJobId = getSelectedJobId();

        if (savedJobId) {
          await fetchTopProductsByJob(savedJobId);
        }
      } catch (error) {
        console.error("Failed to fetch search history:", error.message);
      }
    };

    loadPage();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Choose Search Job</h2>

          {searchHistory.length === 0 ? (
            <p className="text-slate-600">No search jobs found.</p>
          ) : (
            <div className="space-y-3">
              {searchHistory.map((job) => (
                <div
                  key={job._id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border border-slate-200 rounded-xl p-4"
                >
                  <div>
                    <p className="font-semibold text-slate-800">{job.keyword}</p>
                    <p className="text-sm text-slate-500">
                      {job.country} • {job.currency} • {job.status}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => fetchTopProductsByJob(job._id)}
                      className="bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-700 transition"
                    >
                      View Top Products
                    </button>

                    <button
                      onClick={() => handleDownloadReport(job._id)}
                      className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition"
                    >
                      Download Report
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Top Products</h2>

          {!selectedJobId ? (
            <p className="text-slate-600">Select a search job first.</p>
          ) : loading ? (
            <p className="text-slate-600">Loading top products...</p>
          ) : topProducts.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl p-4">
              No top products found for this keyword yet. Generate products first or try another keyword.
            </div>
          ) : (
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div
                  key={product._id}
                  className="border border-slate-200 rounded-2xl p-5 bg-slate-50 flex flex-col md:flex-row gap-4 md:items-center"
                >
                  <div
                    className={`text-2xl font-bold min-w-[60px] ${index === 0
                      ? "text-yellow-500"
                      : index === 1
                        ? "text-slate-500"
                        : index === 2
                          ? "text-amber-700"
                          : "text-emerald-600"
                      }`}
                  >
                    #{index + 1}
                  </div>

                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full md:w-32 h-28 object-contain bg-white rounded-xl p-2"
                  />

                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-800 mb-1">
                      {product.title}
                    </h3>
                    <p className="text-slate-700">
                      <span className="font-semibold">Price:</span> {product.priceText}
                    </p>
                    <p className="text-slate-700">
                      <span className="font-semibold">Rating:</span> {product.rating}
                    </p>
                    <p className="text-slate-700">
                      <span className="font-semibold">Reviews:</span> {product.reviewCount}
                    </p>
                    <p className="text-slate-700">
                      <span className="font-semibold">Score:</span> {product.score}
                    </p>
                    <p className="text-slate-700">
                      <span className="font-semibold">Source:</span> {product.sourceSite}
                    </p>
                  </div>

                  {product.productUrl ? (
                    <a
                      href={product.productUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-700 transition"
                    >
                      Open Source
                    </a>
                  ) : (
                    <button
                      disabled
                      className="inline-block bg-slate-400 text-white px-4 py-2 rounded-xl cursor-not-allowed"
                    >
                      No Link
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TopProductsPage;