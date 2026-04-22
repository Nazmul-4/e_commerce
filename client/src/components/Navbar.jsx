import { Link, useLocation } from "react-router-dom";
import robot from "../assets/robot.png";

function Navbar() {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const isActive = (path) => {
    if (path === "/products") {
      return location.pathname === "/products" || location.pathname.startsWith("/products/");
    }

    if (path === "/top-products") {
      return location.pathname === "/top-products" || location.pathname.startsWith("/top-products/");
    }

    return location.pathname === path;
  };

  const navItemClass = (path) =>
    `px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-300 ${
      isActive(path)
        ? "bg-white text-slate-950 shadow-lg"
        : "text-white/75 hover:text-white hover:bg-white/10"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        
        {/* LOGO AREA */}
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 group">
            
            {/* Glow */}
            <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-xl opacity-70 group-hover:opacity-100 transition" />

            {/* Robot Image */}
            <img
              src={robot}
              alt="AI Robot"
              className="relative h-16 w-16 object-contain z-10 
              transition-transform duration-500 
              group-hover:scale-110"
            />

            {/* Magnifying Glass Animation Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-6 h-6 border-2 border-cyan-400 rounded-full 
              animate-[scanMove_3s_ease-in-out_infinite]" />
            </div>

            {/* Eye Scan Effect */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-10 h-[2px] bg-gradient-to-r from-transparent via-cyan-300 to-transparent 
              animate-[scanLine_2s_linear_infinite]" />
            </div>
          </div>

          <div>
            <h1 className="text-white text-lg md:text-xl font-bold">
              Country Product Analyzer
            </h1>
            <p className="text-white/45 text-xs">
              AI scraping & product intelligence
            </p>
          </div>
        </div>

        {/* NAV */}
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
            className="ml-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-red-500 to-rose-500 text-white text-sm font-semibold hover:opacity-95 transition shadow-lg"
          >
            Logout
          </button>
        </div>
      </div>

      {/* CUSTOM ANIMATIONS */}
      <style>
        {`
          @keyframes scanLine {
            0% { transform: translateY(-10px); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateY(10px); opacity: 0; }
          }

          @keyframes scanMove {
            0% { transform: translate(-6px, -6px); }
            50% { transform: translate(6px, 6px); }
            100% { transform: translate(-6px, -6px); }
          }
        `}
      </style>
    </header>
  );
}

export default Navbar;