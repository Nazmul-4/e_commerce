import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);

  const fallbackImage =
    "https://via.placeholder.com/400x300?text=Product+Image";

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favoriteProducts") || "[]");
    setFavorites(saved);
  }, []);

  const removeFavorite = (productId) => {
    const updated = favorites.filter((product) => product._id !== productId);
    localStorage.setItem("favoriteProducts", JSON.stringify(updated));
    setFavorites(updated);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="mb-8 rounded-[32px] bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 p-6 md:p-8">
          <p className="text-rose-400 text-xs md:text-sm font-semibold tracking-[0.18em] uppercase mb-3">
            Saved Products
          </p>

          <h1 className="text-3xl md:text-5xl font-bold text-white">
            Favorite Products
          </h1>

          <p className="text-slate-400 mt-3">
            All products you saved with the heart button will appear here.
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="rounded-[28px] bg-slate-900 border border-white/10 p-10 text-center">
            <h2 className="text-white text-2xl font-bold mb-2">
              No favorite products yet
            </h2>
            <p className="text-slate-400">
              Go to Top Products and click the heart button on any product.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {favorites.map((product) => (
              <div
                key={product._id}
                className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-rose-500/15 text-rose-300 border border-rose-400/20 text-xs font-semibold">
                    ♥ Favorite
                  </span>

                  <button
                    onClick={() => removeFavorite(product._id)}
                    className="px-3 py-1 rounded-full bg-red-500 text-white text-xs font-semibold hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>

                <div className="rounded-[24px] bg-white/95 p-4 mb-4">
                  <img
                    src={product.image}
                    alt={product.title}
                    onError={(e) => {
                      e.currentTarget.src = fallbackImage;
                    }}
                    className="w-full h-44 object-contain group-hover:scale-105 transition"
                  />
                </div>

                <h3 className="text-white text-lg font-bold leading-7 min-h-[56px] mb-3 line-clamp-2">
                  {product.title}
                </h3>

                <div className="flex items-center justify-between mb-4">
                  <p className="text-2xl font-extrabold text-emerald-400">
                    {product.priceText}
                  </p>

                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-semibold">
                    {product.sourceSite}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  <Info label="Rating" value={`⭐ ${product.rating}`} />
                  <Info label="Reviews" value={product.reviewCount} />
                  <Info label="Score" value={product.score} wide />
                </div>

                <a
                  href={product.productUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-rose-500 via-fuchsia-500 to-violet-600 text-white px-5 py-3.5 font-semibold"
                >
                  Open Product
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
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
      <p className="text-white font-bold text-sm">{value}</p>
    </div>
  );
}

export default FavoritesPage;