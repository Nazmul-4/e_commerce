import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api, { getAuthConfig } from "../services/api";
import { saveSelectedJobId } from "../utils/selectedJob";

function SearchJobProductsPage() {
  const { jobId } = useParams();

  const [products, setProducts] = useState([]);
  const [jobInfo, setJobInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchJobAndProducts = async () => {
    try {
      saveSelectedJobId(jobId);

      const historyRes = await api.get("/search/my-history", getAuthConfig());
      const jobs = historyRes.data.searchJobs || [];
      const currentJob = jobs.find((job) => job._id === jobId) || null;
      setJobInfo(currentJob);

      const productRes = await api.get(`/search/${jobId}/products`, getAuthConfig());
      setProducts(productRes.data.products || []);
    } catch (error) {
      console.error("Failed to fetch products page data:", error.message);
      setProducts([]);
      setJobInfo(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobAndProducts();
  }, [jobId]);

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.35)] p-6 md:p-8">
          <div className="absolute -top-16 -right-12 h-44 w-44 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute -bottom-14 -left-8 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative">
            <p className="text-cyan-400 text-xs md:text-sm font-semibold tracking-[0.18em] uppercase mb-3">
              Product Analytics
            </p>

            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-3">
              Products Page
            </h1>

            {jobInfo ? (
              <div className="flex flex-wrap items-center gap-2 text-sm md:text-base text-slate-300">
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  Keyword:{" "}
                  <span className="text-white font-semibold capitalize">
                    {jobInfo.keyword}
                  </span>
                </span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  {jobInfo.country}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  {jobInfo.currency}
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  {jobInfo.status}
                </span>
              </div>
            ) : (
              <p className="text-slate-400">Loading search job details...</p>
            )}
          </div>
        </div>

        <div className="rounded-[32px] bg-slate-900 border border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.35)] p-6 md:p-8">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Products
              </h2>
              <p className="text-slate-400 text-sm mt-2">
                Premium SaaS product cards with clean analytics-focused styling.
              </p>
            </div>

            {!loading && products.length > 0 && (
              <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-slate-300 text-sm">
                Showing <span className="text-white font-semibold">{products.length}</span> products
              </div>
            )}
          </div>

          {loading ? (
            <div className="rounded-[28px] bg-slate-950/40 p-8 text-center text-slate-300">
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-2xl p-4">
              No products found for this search job.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {products.map((product, index) => (
                <div
                  key={product._id}
                  className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(0,0,0,0.45)] transition-all duration-300"
                >
                  <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/5 blur-2xl" />
                  <div className="absolute -bottom-12 -left-8 h-28 w-28 rounded-full bg-cyan-500/10 blur-2xl" />

                  <div className="relative">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600 shadow">
                        <span>#{index + 1}</span>
                      </div>

                      <div className="text-right">
                        <p className="text-cyan-300 text-xs font-semibold">
                          Product Insight
                        </p>
                      </div>
                    </div>

                    <div className="rounded-[24px] bg-white/95 p-4 mb-4 shadow-inner">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-44 object-contain group-hover:scale-[1.04] transition duration-300"
                      />
                    </div>

                    <h3 className="text-white text-lg font-bold leading-7 min-h-[56px] mb-3 line-clamp-2">
                      {product.title}
                    </h3>

                    <div className="flex items-center justify-between mb-4">
                      <p className="text-2xl font-extrabold text-emerald-400">
                        {product.priceText}
                      </p>

                      <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-semibold">
                        {product.sourceSite}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-5">
                      <div className="rounded-2xl bg-white/5 border border-white/10 p-3">
                        <p className="text-slate-400 text-xs mb-1">Rating</p>
                        <p className="text-white font-bold text-base">
                          ⭐ {product.rating}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-white/5 border border-white/10 p-3">
                        <p className="text-slate-400 text-xs mb-1">Reviews</p>
                        <p className="text-white font-bold text-base">
                          {product.reviewCount}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-white/5 border border-white/10 p-3 col-span-2">
                        <p className="text-slate-400 text-xs mb-1">Score</p>
                        <p className="text-cyan-300 font-extrabold text-lg">
                          {product.score}
                        </p>
                      </div>
                    </div>

                    {product.productUrl ? (
                      <a
                        href={product.productUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600 text-white px-5 py-3.5 hover:opacity-95 transition font-semibold shadow"
                      >
                        View Product
                      </a>
                    ) : (
                      <button
                        disabled
                        className="w-full inline-flex items-center justify-center rounded-2xl bg-slate-700 text-white px-5 py-3.5 cursor-not-allowed"
                      >
                        No Link
                      </button>
                    )}
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

export default SearchJobProductsPage;