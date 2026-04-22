import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api, { getAuthConfig } from "../services/api";
import { getSelectedJobId, saveSelectedJobId } from "../utils/selectedJob";

function TopProductsPage() {
  const [searchHistory, setSearchHistory] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(false);

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
          <h2 className="text-2xl font-bold mb-4">Choose Search Job</h2>

          {searchHistory.map((job) => (
            <div key={job._id} className="flex justify-between p-4 border rounded-xl">
              <div>
                <p className="font-semibold">{job.keyword}</p>
                <p className="text-sm text-slate-500">{job.country} • {job.status}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => fetchTopProductsByJob(job._id)}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-xl"
                >
                  View Top Products
                </button>

                <button
                  onClick={() => handleDownloadReport(job._id)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-xl"
                >
                  Download Report
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Top Products</h2>

          {topProducts.map((product, index) => (
            <div key={product._id} className="border p-5 rounded-xl mb-4">

              {/* ✅ NEW BADGE */}
              {index === 0 && (
                <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs mb-2 inline-block">
                  🥇 Best Product
                </div>
              )}

              <h3 className="font-bold text-lg">{product.title}</h3>
              <p>Price: {product.priceText}</p>
              <p>Rating: {product.rating}</p>
              <p>Score: {product.score}</p>

              <a href={product.productUrl} target="_blank" rel="noreferrer">
                View
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TopProductsPage;