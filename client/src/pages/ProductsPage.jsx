import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api, { getAuthConfig } from "../services/api";

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
    } catch (error) {
      console.error("Failed to fetch products:", error.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSearchHistory();
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
            <p className="text-slate-600">No products found.</p>
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
                    className="w-full h-40 object-contain bg-white rounded-xl mb-4 p-3"
                  />

                  <h3 className="text-lg font-bold text-slate-800 mb-2">
                    {product.title}
                  </h3>

                  <p className="text-slate-700 mb-1">
                    <span className="font-semibold">Price:</span> {product.priceText}
                  </p>

                  <p className="text-slate-700 mb-1">
                    <span className="font-semibold">Rating:</span> {product.rating}
                  </p>

                  <p className="text-slate-700 mb-1">
                    <span className="font-semibold">Reviews:</span> {product.reviewCount}
                  </p>

                  <p className="text-slate-700 mb-1">
                    <span className="font-semibold">Score:</span> {product.score}
                  </p>

                  <p className="text-slate-700 mb-3">
                    <span className="font-semibold">Source:</span> {product.sourceSite}
                  </p>

                  {product.productUrl ? (
                    <a
                      href={product.productUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block bg-slate-800 text-white px-4 py-2 rounded-xl hover:bg-slate-900 transition"
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

export default ProductsPage;