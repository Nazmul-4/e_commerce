import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api, { getAuthConfig } from "../services/api";
import { getSelectedJobId, saveSelectedJobId } from "../utils/selectedJob";

function ProductsPage() {
  const [searchHistory, setSearchHistory] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      const { data } = await api.get(`/search/${jobId}/products`, getAuthConfig());
      setProducts(data.products || []);
      setSelectedJobId(jobId);
      saveSelectedJobId(jobId);
    } catch (error) {
      console.error("Failed to fetch products:", error.message);
      setProducts([]);
    } finally {
      setLoading(false);
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
          await fetchProductsByJob(savedJobId);
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

                  <button
                    onClick={() => fetchProductsByJob(job._id)}
                    className="bg-slate-800 text-white px-4 py-2 rounded-xl hover:bg-slate-900 transition"
                  >
                    View Products
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Products</h2>

          {!selectedJobId ? (
            <p className="text-slate-600">Select a search job first.</p>
          ) : loading ? (
            <p className="text-slate-600">Loading products...</p>
          ) : products.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl p-4">
              No products found. Try keywords like <b>shirt</b>, <b>bag</b>, <b>ring</b>.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-5"
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-40 object-contain bg-slate-100 rounded-xl mb-4 p-2"
                  />

                  <h3 className="text-lg font-bold text-slate-800 mb-2">
                    {product.title}
                  </h3>

                  <p className="text-emerald-600 font-bold text-lg mb-1">
                    {product.priceText}
                  </p>

                  <p className="text-sm text-slate-600 mb-1">
                    ⭐ {product.rating} ({product.reviewCount} reviews)
                  </p>

                  <p className="text-sm text-slate-600 mb-2">
                    Score: <span className="font-semibold">{product.score}</span>
                  </p>

                  <span className="inline-block bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-xs mb-3">
                    {product.sourceSite}
                  </span>

                  <div>
                    <a
                      href={product.productUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="block text-center bg-slate-800 text-white py-2 rounded-xl hover:bg-slate-900 transition"
                    >
                      View Product
                    </a>
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

export default ProductsPage;