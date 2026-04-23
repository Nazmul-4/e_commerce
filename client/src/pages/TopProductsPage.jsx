import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api, { getAuthConfig } from "../services/api";

function SearchJobProductsPage() {
  const { jobId } = useParams();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedSource, setSelectedSource] = useState("all");
  const [sortBy, setSortBy] = useState("score");

  const fallbackImage =
    "https://via.placeholder.com/400x300?text=Product+Image";

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await api.get(`/search/${jobId}/products`, getAuthConfig());
      const data = res.data.products || [];
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [jobId]);

  // Apply filters
  useEffect(() => {
    let result = [...products];

    // Price filter
    if (minPrice) {
      result = result.filter((p) => p.priceValue >= Number(minPrice));
    }

    if (maxPrice) {
      result = result.filter((p) => p.priceValue <= Number(maxPrice));
    }

    // Source filter
    if (selectedSource !== "all") {
      result = result.filter(
        (p) => p.sourceSite.toLowerCase() === selectedSource
      );
    }

    // Sorting
    if (sortBy === "priceLow") {
      result.sort((a, b) => a.priceValue - b.priceValue);
    } else if (sortBy === "priceHigh") {
      result.sort((a, b) => b.priceValue - a.priceValue);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "reviews") {
      result.sort((a, b) => b.reviewCount - a.reviewCount);
    } else {
      result.sort((a, b) => b.score - a.score);
    }

    setFilteredProducts(result);
  }, [products, minPrice, maxPrice, selectedSource, sortBy]);

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">

        {/* FILTER PANEL */}
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-4 flex flex-wrap gap-4 items-center">

          <input
            type="number"
            placeholder="Min Price"
            className="px-3 py-2 rounded-xl bg-white/5 text-white"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />

          <input
            type="number"
            placeholder="Max Price"
            className="px-3 py-2 rounded-xl bg-white/5 text-white"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />

          <select
            className="px-3 py-2 rounded-xl bg-white/5 text-white"
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
          >
            <option value="all">All Sources</option>
            <option value="star tech">Star Tech</option>
            <option value="ucc">UCC</option>
          </select>

          <select
            className="px-3 py-2 rounded-xl bg-white/5 text-white"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="score">Sort by Score</option>
            <option value="priceLow">Price Low → High</option>
            <option value="priceHigh">Price High → Low</option>
            <option value="rating">Rating</option>
            <option value="reviews">Reviews</option>
          </select>

        </div>

        {/* PRODUCTS */}
        {loading ? (
          <p className="text-white">Loading...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-yellow-400">No products found</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-slate-900 border border-white/10 rounded-2xl p-4"
              >
                <img
                  src={product.image}
                  onError={(e) => (e.target.src = fallbackImage)}
                  className="h-40 w-full object-contain"
                />

                <h3 className="text-white mt-3">{product.title}</h3>

                <p className="text-green-400 font-bold mt-2">
                  {product.priceText}
                </p>

                <p className="text-sm text-gray-400">
                  ⭐ {product.rating} | {product.reviewCount} reviews
                </p>

                <p className="text-xs text-cyan-400 mt-1">
                  {product.sourceSite}
                </p>

                <p className="text-xs text-white mt-1">
                  Score: {product.score}
                </p>

                <a
                  href={product.productUrl}
                  target="_blank"
                  className="block mt-3 bg-blue-500 text-white text-center py-2 rounded-lg"
                >
                  View Product
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchJobProductsPage;