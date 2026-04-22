import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const navItemClass = (path) =>
    `px-4 py-2 rounded-2xl text-sm font-semibold transition-all duration-200 ${
      location.pathname === path
        ? "bg-white text-slate-950 shadow-lg"
        : "text-white/75 hover:text-white hover:bg-white/10"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600 shadow-[0_10px_30px_rgba(59,130,246,0.35)] flex items-center justify-center text-white font-extrabold text-lg">
            CP
          </div>

          <div>
            <h1 className="text-white text-lg md:text-xl font-bold tracking-tight">
              Country Product Analyzer
            </h1>
            <p className="text-white/45 text-xs md:text-sm">
              Premium product insights dashboard
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link to="/dashboard" className={navItemClass("/dashboard")}>
            Dashboard
          </Link>

          <Link to="/products" className={navItemClass("/products")}>
            Products
          </Link>

          <Link to="/top-products" className={navItemClass("/top-products")}>
            Top Products
          </Link>

          <button
            onClick={handleLogout}
            className="ml-0 lg:ml-2 px-4 py-2 rounded-2xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-all duration-200 shadow-lg shadow-red-500/20"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;