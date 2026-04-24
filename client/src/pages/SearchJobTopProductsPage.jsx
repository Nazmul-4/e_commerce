import { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import api, { getAuthConfig } from "../services/api";
import { getSelectedJobId, saveSelectedJobId } from "../utils/selectedJob";

function SearchJobTopProductsPage() {
  const topProductsSectionRef = useRef(null);

  const [searchHistory, setSearchHistory] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState("");
  const [selectedSource, setSelectedSource] = useState("all");
  const [sortBy, setSortBy] = useState("scoreHigh");

  const [compareProducts, setCompareProducts] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState([]);

  const fallbackImage =
    "https://via.placeholder.com/400x300?text=Product+Image";

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favoriteProducts") || "[]");
    setFavoriteIds(saved.map((item) => item._id));
  }, []);

  const saveFavoriteProducts = (items) => {
    localStorage.setItem("favoriteProducts", JSON.stringify(items));
    setFavoriteIds(items.map((item) => item._id));
  };

  const toggleFavorite = (product) => {
    const saved = JSON.parse(localStorage.getItem("favoriteProducts") || "[]");
    const exists = saved.some((item) => item._id === product._id);

    if (exists) {
      saveFavoriteProducts(saved.filter((item) => item._id !== product._id));
    } else {
      saveFavoriteProducts([...saved, product]);
    }
  };

  const toggleCompare = (product) => {
    const exists = compareProducts.some((item) => item._id === product._id);

    if (exists) {
      setCompareProducts(compareProducts.filter((item) => item._id !== product._id));
      return;
    }

    if (compareProducts.length >= 4) {
      alert("You can compare maximum 4 products.");
      return;
    }

    setCompareProducts([...compareProducts, product]);
  };

  const scrollToTopProductsSection = () => {
    topProductsSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const fetchTopProductsByJob = async (jobId, shouldScroll = false) => {
    try {
      setLoading(true);

      const { data } = await api.get(
        `/search/${jobId}/top-products`,
        getAuthConfig()
      );

      setTopProducts(data.topProducts || []);
      setSelectedJobId(jobId);
      saveSelectedJobId(jobId);

      if (shouldScroll) {
        setTimeout(scrollToTopProductsSection, 150);
      }
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

      let fileName = "top_products_report.csv";
      const contentDisposition = response.headers["content-disposition"];

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.+?)"?$/);
        if (match && match[1]) fileName = match[1];
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
        setLoading(true);

        const { data } = await api.get("/search/my-history", getAuthConfig());
        const jobs = data.searchJobs || [];
        setSearchHistory(jobs);

        if (jobs.length === 0) {
          setTopProducts([]);
          setLoading(false);
          return;
        }

        const savedJobId = getSelectedJobId();
        const jobExists = jobs.some((job) => job._id === savedJobId);
        const defaultJobId = jobExists ? savedJobId : jobs[0]._id;

        await fetchTopProductsByJob(defaultJobId, false);
      } catch (error) {
        console.error("Failed to fetch search history:", error.message);
        setLoading(false);
      }
    };

    loadPage();
  }, []);

  const filteredTopProducts = useMemo(() => {
    let result = [...topProducts];

    if (searchText.trim()) {
      const q = searchText.toLowerCase().trim();

      result = result.filter(
        (product) =>
          product.title?.toLowerCase().includes(q) ||
          product.sourceSite?.toLowerCase().includes(q) ||
          product.brand?.toLowerCase?.().includes(q)
      );
    }

    if (selectedSource !== "all") {
      result = result.filter(
        (product) => product.sourceSite?.toLowerCase() === selectedSource
      );
    }

    if (sortBy === "scoreLow") {
      result.sort((a, b) => (a.score || 0) - (b.score || 0));
    } else if (sortBy === "priceLow") {
      result.sort((a, b) => (a.priceValue || 0) - (b.priceValue || 0));
    } else if (sortBy === "priceHigh") {
      result.sort((a, b) => (b.priceValue || 0) - (a.priceValue || 0));
    } else if (sortBy === "rating") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "reviews") {
      result.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
    } else {
      result.sort((a, b) => (b.score || 0) - (a.score || 0));
    }

    return result;
  }, [topProducts, searchText, selectedSource, sortBy]);

  const analytics = useMemo(() => {
    const total = filteredTopProducts.length;
    const avgPrice =
      total > 0
        ? Math.round(
            filteredTopProducts.reduce(
              (sum, product) => sum + (product.priceValue || 0),
              0
            ) / total
          )
        : 0;

    const bestRating =
      total > 0
        ? Math.max(...filteredTopProducts.map((product) => product.rating || 0))
        : 0;

    const highestScore =
      total > 0
        ? Math.max(...filteredTopProducts.map((product) => product.score || 0))
        : 0;

    return {
      total,
      avgPrice,
      bestRating,
      highestScore,
    };
  }, [filteredTopProducts]);

  const highlightText = (text = "") => {
    if (!searchText.trim()) return text;

    const regex = new RegExp(`(${searchText})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      part.toLowerCase() === searchText.toLowerCase() ? (
        <mark key={index} className="bg-yellow-300 text-slate-950 rounded px-1">
          {part}
        </mark>
      ) : (
        part
      )
    );
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

  const getRankStyles = (index, sourceSite = "") => {
    const source = sourceSite.toLowerCase();

    if (index === 0) {
      return {
        badge: "from-yellow-400 via-amber-400 to-orange-500",
        ring: "ring-yellow-400/40",
        glow: "from-yellow-400/25 via-orange-400/10 to-transparent",
      };
    }

    if (index === 1) {
      return {
        badge: "from-slate-300 via-slate-400 to-slate-500",
        ring: "ring-slate-300/30",
        glow: "from-slate-300/20 via-slate-300/10 to-transparent",
      };
    }

    if (index === 2) {
      return {
        badge: "from-amber-600 via-orange-500 to-yellow-700",
        ring: "ring-orange-400/30",
        glow: "from-orange-400/20 via-amber-400/10 to-transparent",
      };
    }

    if (source.includes("ucc")) {
      return {
        badge: "from-violet-500 via-fuchsia-500 to-purple-600",
        ring: "ring-violet-400/20",
        glow: "from-violet-400/20 via-fuchsia-400/10 to-transparent",
      };
    }

    return {
      badge: "from-cyan-400 via-blue-500 to-violet-600",
      ring: "ring-cyan-400/20",
      glow: "from-cyan-400/20 via-blue-400/10 to-transparent",
    };
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
        <div className="rounded-[32px] bg-slate-900 border border-white/10 p-6 md:p-8">
          <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-5 mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Job Selector
              </h2>
              <p className="text-slate-400 text-sm mt-2">
                Select a search job and jump directly to the ranked products.
              </p>
            </div>

            {selectedJobId && (
              <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-slate-300 text-sm">
                Active job selected
              </div>
            )}
          </div>

          {searchHistory.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-white/10 bg-slate-950/40 p-8 text-center text-slate-400">
              No search jobs found.
            </div>
          ) : (
            <div className="space-y-3">
              {searchHistory.map((job) => (
                <div
                  key={job._id}
                  className={`rounded-[24px] border p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 transition ${
                    selectedJobId === job._id
                      ? "border-emerald-500/40 bg-emerald-500/5"
                      : "border-white/10 bg-slate-950/50"
                  }`}
                >
                  <div>
                    <p className="font-semibold text-white capitalize">
                      {job.keyword}
                    </p>
                    <p className="text-sm text-slate-400">
                      {job.country} • {job.currency} • {job.status}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => fetchTopProductsByJob(job._id, true)}
                      className="rounded-2xl bg-emerald-600 text-white px-4 py-2.5 hover:bg-emerald-700 transition font-semibold"
                    >
                      View Top Products
                    </button>

                    <button
                      onClick={() => handleDownloadReport(job._id)}
                      className="rounded-2xl bg-purple-600 text-white px-4 py-2.5 hover:bg-purple-700 transition font-semibold"
                    >
                      Download Report
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          ref={topProductsSectionRef}
          className="rounded-[32px] bg-slate-900 border border-white/10 p-6 md:p-8"
        >
          <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-5 mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Top Ranked Products
              </h2>
              <p className="text-slate-400 text-sm mt-2">
                Compare, favorite, search, filter, and analyze ranked products.
              </p>
            </div>

            {compareProducts.length >= 2 && (
              <button
                onClick={() => setShowCompare(true)}
                className="rounded-2xl bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white px-5 py-3 font-semibold shadow"
              >
                Compare {compareProducts.length} Products
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="rounded-3xl bg-white/5 border border-white/10 p-5">
              <p className="text-slate-400 text-sm">Total Products</p>
              <h3 className="text-white text-3xl font-bold mt-2">
                {analytics.total}
              </h3>
            </div>

            <div className="rounded-3xl bg-white/5 border border-white/10 p-5">
              <p className="text-slate-400 text-sm">Avg Price</p>
              <h3 className="text-emerald-400 text-3xl font-bold mt-2">
                ৳{analytics.avgPrice.toLocaleString()}
              </h3>
            </div>

            <div className="rounded-3xl bg-white/5 border border-white/10 p-5">
              <p className="text-slate-400 text-sm">Best Rating</p>
              <h3 className="text-yellow-300 text-3xl font-bold mt-2">
                ⭐ {analytics.bestRating}
              </h3>
            </div>

            <div className="rounded-3xl bg-white/5 border border-white/10 p-5">
              <p className="text-slate-400 text-sm">Highest Score</p>
              <h3 className="text-cyan-300 text-3xl font-bold mt-2">
                {analytics.highestScore}
              </h3>
            </div>
          </div>

          <div className="mb-6 rounded-[28px] bg-slate-950/50 border border-white/10 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Live search products..."
                className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 outline-none"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />

              <select
                className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white outline-none"
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
              >
                <option value="all" className="bg-slate-900">
                  All Sources
                </option>
                <option value="star tech" className="bg-slate-900">
                  Star Tech
                </option>
                <option value="ucc" className="bg-slate-900">
                  UCC
                </option>
              </select>

              <select
                className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white outline-none"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="scoreHigh" className="bg-slate-900">
                  Score High → Low
                </option>
                <option value="scoreLow" className="bg-slate-900">
                  Score Low → High
                </option>
                <option value="priceLow" className="bg-slate-900">
                  Price Low → High
                </option>
                <option value="priceHigh" className="bg-slate-900">
                  Price High → Low
                </option>
                <option value="rating" className="bg-slate-900">
                  Rating High → Low
                </option>
                <option value="reviews" className="bg-slate-900">
                  Reviews High → Low
                </option>
              </select>

              <button
                onClick={() => {
                  setSearchText("");
                  setSelectedSource("all");
                  setSortBy("scoreHigh");
                }}
                className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition font-semibold"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {loading ? (
            <div className="rounded-[28px] bg-slate-950/40 p-8 text-center text-slate-300">
              Loading top products...
            </div>
          ) : filteredTopProducts.length === 0 ? (
            <div className="rounded-[28px] bg-slate-950/40 p-8 text-center text-yellow-400">
              No products found
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredTopProducts.map((product, index) => {
                const styles = getRankStyles(index, product.sourceSite);
                const isCompared = compareProducts.some(
                  (item) => item._id === product._id
                );
                const isFavorite = favoriteIds.includes(product._id);

                return (
                  <div
                    key={product._id}
                    className={`group relative overflow-visible rounded-[30px] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 px-5 pt-5 pb-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(0,0,0,0.45)] transition-all duration-300 ring-1 ${styles.ring}`}
                  >
                    <div
                      className={`absolute inset-0 rounded-[30px] bg-gradient-to-br ${styles.glow} pointer-events-none`}
                    />

                    <div className="relative">
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r ${styles.badge}`}
                        >
                          #{index + 1}
                        </div>

                        <button
                          onClick={() => toggleFavorite(product)}
                          className={`h-10 w-10 rounded-full border transition ${
                            isFavorite
                              ? "bg-red-500 text-white border-red-400"
                              : "bg-white/5 text-white border-white/10"
                          }`}
                        >
                          ♥
                        </button>
                      </div>

                      <div className="relative h-[220px] mb-4 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-[24px] bg-white/95 shadow-inner" />

                        <img
                          src={product.image}
                          alt={product.title}
                          onError={(e) => {
                            e.currentTarget.src = fallbackImage;
                          }}
                          className="relative z-10 h-44 w-auto max-w-[85%] object-contain transition-all duration-500 ease-out group-hover:-translate-y-10 group-hover:scale-[1.18] group-hover:rotate-[-8deg]"
                        />
                      </div>

                      <h3 className="text-white text-lg font-bold leading-7 min-h-[56px] mb-3 line-clamp-2">
                        {highlightText(product.title)}
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
                        <Info label="Rating" value={`⭐ ${product.rating}`} />
                        <Info label="Reviews" value={product.reviewCount} />
                        <Info label="Brand" value={product.brand || "N/A"} />
                        <Info label="Stock" value={product.availability || "Unknown"} />
                        <Info label="Score" value={product.score} wide />
                      </div>

                      {product.shortSpecs?.length > 0 && (
                        <div className="mb-5 rounded-2xl bg-white/5 border border-white/10 p-3">
                          <p className="text-slate-400 text-xs mb-2">
                            Quick Specs
                          </p>
                          <ul className="space-y-1 text-sm text-slate-200">
                            {product.shortSpecs.slice(0, 3).map((spec, i) => (
                              <li key={i} className="line-clamp-1">
                                • {spec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => toggleCompare(product)}
                          className={`rounded-2xl px-4 py-3 font-semibold transition ${
                            isCompared
                              ? "bg-emerald-500 text-white"
                              : "bg-white/5 text-white border border-white/10"
                          }`}
                        >
                          {isCompared ? "Selected" : "Compare"}
                        </button>

                        <a
                          href={product.productUrl}
                          target="_blank"
                          rel="noreferrer"
                          className={`inline-flex items-center justify-center rounded-2xl bg-gradient-to-r ${styles.badge} text-white px-4 py-3 font-semibold`}
                        >
                          Open
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {showCompare && (
        <CompareModal
          products={compareProducts}
          onClose={() => setShowCompare(false)}
        />
      )}
    </div>
  );
}

function Info({ label, value, wide }) {
  return (
    <div
      className={`rounded-2xl bg-white/5 border border-white/10 p-3 ${
        wide ? "col-span-2" : ""
      }`}
    >
      <p className="text-slate-400 text-xs mb-1">{label}</p>
      <p className="text-white font-bold text-sm line-clamp-1">{value}</p>
    </div>
  );
}

function CompareModal({ products, onClose }) {
  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-6xl rounded-[32px] bg-slate-900 border border-white/10 p-6 shadow-2xl max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-2xl font-bold">
            Product Comparison
          </h2>

          <button
            onClick={onClose}
            className="rounded-2xl bg-red-500 text-white px-4 py-2 font-semibold"
          >
            Close
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="rounded-3xl bg-slate-950 border border-white/10 p-4"
            >
              <img
                src={product.image}
                alt={product.title}
                className="h-36 w-full object-contain bg-white rounded-2xl p-3 mb-4"
              />

              <h3 className="text-white font-bold text-base mb-3 line-clamp-3">
                {product.title}
              </h3>

              <div className="space-y-2 text-sm">
                <CompareRow label="Price" value={product.priceText} />
                <CompareRow label="Rating" value={product.rating} />
                <CompareRow label="Reviews" value={product.reviewCount} />
                <CompareRow label="Score" value={product.score} />
                <CompareRow label="Source" value={product.sourceSite} />
                <CompareRow label="Brand" value={product.brand || "N/A"} />
              </div>

              {product.shortSpecs?.length > 0 && (
                <div className="mt-4">
                  <p className="text-slate-400 text-xs mb-2">Specs</p>
                  <ul className="text-slate-200 text-xs space-y-1">
                    {product.shortSpecs.slice(0, 4).map((spec, index) => (
                      <li key={index}>• {spec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CompareRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-2">
      <span className="text-slate-400">{label}</span>
      <span className="text-white font-semibold text-right">{value}</span>
    </div>
  );
}

export default SearchJobTopProductsPage;