import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api, { getAuthConfig } from "../services/api";
import { saveSelectedJobId } from "../utils/selectedJob";

function SearchJobTopProductsPage() {
  const { jobId } = useParams();

  const [topProducts, setTopProducts] = useState([]);
  const [jobInfo, setJobInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const fallbackImage =
    "https://via.placeholder.com/400x300?text=Product+Image";

  const fetchJobAndTopProducts = async () => {
    try {
      saveSelectedJobId(jobId);

      const historyRes = await api.get("/search/my-history", getAuthConfig());
      const jobs = historyRes.data.searchJobs || [];
      const currentJob = jobs.find((job) => job._id === jobId) || null;
      setJobInfo(currentJob);

      const topRes = await api.get(`/search/${jobId}/top-products`, getAuthConfig());
      setTopProducts(topRes.data.topProducts || []);
    } catch (error) {
      console.error("Failed to fetch top products page data:", error.message);
      setTopProducts([]);
      setJobInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async () => {
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
    fetchJobAndTopProducts();
  }, [jobId]);

  const getRankStyles = (index, sourceSite = "") => {
    const source = sourceSite.toLowerCase();

    if (index === 0) {
      return {
        badge: "from-yellow-400 via-amber-400 to-orange-500",
        ring: "ring-yellow-400/40",
        text: "text-yellow-300",
        label: "🥇 Best Overall",
        glow: "from-yellow-400/25 via-orange-400/10 to-transparent",
      };
    }

    if (index === 1) {
      return {
        badge: "from-slate-300 via-slate-400 to-slate-500",
        ring: "ring-slate-300/30",
        text: "text-slate-200",
        label: "🥈 Runner Up",
        glow: "from-slate-300/20 via-slate-300/10 to-transparent",
      };
    }

    if (index === 2) {
      return {
        badge: "from-amber-600 via-orange-500 to-yellow-700",
        ring: "ring-orange-400/30",
        text: "text-amber-300",
        label: "🥉 Top Pick",
        glow: "from-orange-400/20 via-amber-400/10 to-transparent",
      };
    }

    if (source.includes("star tech")) {
      return {
        badge: "from-cyan-400 via-blue-500 to-violet-600",
        ring: "ring-cyan-400/20",
        text: "text-cyan-300",
        label: "Star Tech Ranked",
        glow: "from-cyan-400/20 via-blue-400/10 to-transparent",
      };
    }

    if (source.includes("ucc")) {
      return {
        badge: "from-violet-500 via-fuchsia-500 to-purple-600",
        ring: "ring-violet-400/20",
        text: "text-violet-300",
        label: "UCC Ranked",
        glow: "from-violet-400/20 via-fuchsia-400/10 to-transparent",
      };
    }

    return {
      badge: "from-emerald-400 via-cyan-400 to-blue-500",
      ring: "ring-cyan-400/20",
      text: "text-cyan-300",
      label: "Top Ranked",
      glow: "from-cyan-400/20 via-blue-400/10 to-transparent",
    };
  };

  const getSourceBadgeClass = (sourceSite = "") => {
    const source = sourceSite.toLowerCase();

    if (source.includes("star tech")) {
      return "bg-cyan-500/15 text-cyan-300 border border-cyan-400/20";
    }

    if (source.includes("ucc")) {
      return "bg-violet-500/15 text-violet-300 border border-violet-400/20";
    }

    return "bg-white/10 text-slate-300 border border-white/10";
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.35)] p-6 md:p-8">
          <div className="absolute -top-16 -right-12 h-44 w-44 rounded-full bg-fuchsia-500/10 blur-3xl" />
          <div className="absolute -bottom-14 -left-8 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="relative flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
            <div>
              <p className="text-fuchsia-400 text-xs md:text-sm font-semibold tracking-[0.18em] uppercase mb-3">
                Ranking Analytics
              </p>

              <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-3">
                Top Products
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

            <button
              onClick={handleDownloadReport}
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-500 via-violet-500 to-purple-600 text-white px-6 py-3.5 hover:opacity-95 transition font-semibold shadow-[0_16px_40px_rgba(168,85,247,0.35)]"
            >
              Download Report
            </button>
          </div>
        </div>

        <div className="rounded-[32px] bg-slate-900 border border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.35)] p-6 md:p-8">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Top Ranked Products
              </h2>
              <p className="text-slate-400 text-sm mt-2">
                Cross-source ranking with detail-enriched premium cards.
              </p>
            </div>

            {!loading && topProducts.length > 0 && (
              <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-slate-300 text-sm">
                Showing <span className="text-white font-semibold">{topProducts.length}</span> ranked products
              </div>
            )}
          </div>

          {loading ? (
            <div className="rounded-[28px] bg-slate-950/40 p-8 text-center text-slate-300">
              Loading top products...
            </div>
          ) : topProducts.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-2xl p-4">
              No top products found for this search job.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {topProducts.map((product, index) => {
                const styles = getRankStyles(index, product.sourceSite);

                return (
                  <div
                    key={product._id}
                    className={`group relative overflow-visible rounded-[30px] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 px-5 pt-5 pb-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(0,0,0,0.45)] transition-all duration-300 ring-1 ${styles.ring}`}
                  >
                    <div className={`absolute inset-0 rounded-[30px] bg-gradient-to-br ${styles.glow} pointer-events-none`} />
                    <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/5 blur-2xl" />
                    <div className="absolute -bottom-12 -left-8 h-28 w-28 rounded-full bg-cyan-500/10 blur-2xl" />

                    <div className="relative">
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r ${styles.badge} shadow`}
                        >
                          <span>#{index + 1}</span>
                        </div>

                        <div className="text-right">
                          <p className={`text-xs font-semibold ${styles.text}`}>
                            {styles.label}
                          </p>
                        </div>
                      </div>

                      <div className="relative h-[220px] mb-4 flex items-center justify-center">
                        <div className="absolute inset-x-4 bottom-6 h-10 rounded-full bg-cyan-400/15 blur-2xl opacity-60 group-hover:opacity-90 transition duration-300" />
                        <div className="absolute inset-0 rounded-[24px] bg-white/95 shadow-inner" />

                        <div className="relative z-10 flex items-center justify-center w-full h-full">
                          <img
                            src={product.image}
                            alt={product.title}
                            onError={(e) => {
                              e.currentTarget.src = fallbackImage;
                            }}
                            className="h-44 w-auto max-w-[85%] object-contain transition-all duration-500 ease-out group-hover:-translate-y-10 group-hover:scale-[1.18] group-hover:rotate-[-8deg] drop-shadow-[0_18px_35px_rgba(15,23,42,0.25)]"
                          />
                        </div>
                      </div>

                      <h3 className="text-white text-lg font-bold leading-7 min-h-[56px] mb-3 line-clamp-2">
                        {product.title}
                      </h3>

                      <div className="flex items-center justify-between mb-4">
                        <p className="text-2xl font-extrabold text-emerald-400">
                          {product.priceText}
                        </p>

                        <div
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getSourceBadgeClass(
                            product.sourceSite
                          )}`}
                        >
                          {product.sourceSite}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-4">
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

                        <div className="rounded-2xl bg-white/5 border border-white/10 p-3">
                          <p className="text-slate-400 text-xs mb-1">Brand</p>
                          <p className="text-white font-bold text-sm">
                            {product.brand || "N/A"}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-white/5 border border-white/10 p-3">
                          <p className="text-slate-400 text-xs mb-1">Stock</p>
                          <p className="text-white font-bold text-sm line-clamp-1">
                            {product.availability || "Unknown"}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-white/5 border border-white/10 p-3 col-span-2">
                          <p className="text-slate-400 text-xs mb-1">Score</p>
                          <p className="text-cyan-300 font-extrabold text-lg">
                            {product.score}
                          </p>
                        </div>
                      </div>

                      {product.shortSpecs?.length > 0 && (
                        <div className="mb-5 rounded-2xl bg-white/5 border border-white/10 p-3">
                          <p className="text-slate-400 text-xs mb-2">Quick Specs</p>
                          <ul className="space-y-1 text-sm text-slate-200">
                            {product.shortSpecs.slice(0, 3).map((spec, specIndex) => (
                              <li key={specIndex} className="line-clamp-1">
                                • {spec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {product.productUrl ? (
                        <a
                          href={product.productUrl}
                          target="_blank"
                          rel="noreferrer"
                          className={`w-full inline-flex items-center justify-center rounded-2xl bg-gradient-to-r ${styles.badge} text-white px-5 py-3.5 hover:opacity-95 transition font-semibold shadow`}
                        >
                          Open Source
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
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchJobTopProductsPage;