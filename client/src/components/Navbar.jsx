import { Link, useLocation, useNavigate } from "react-router-dom";
import robot from "../assets/robot.png";
import { getSelectedJobId } from "../utils/selectedJob";
import api from "../services/api"; // ✅ COOKIE PART: needed for backend logout

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    // ✅ COOKIE PART START
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed:", error.message);
    } finally {
      localStorage.clear();
      navigate("/login");
    }
    // ✅ COOKIE PART END
  };

  const handleTopProductsClick = (e) => {
    e.preventDefault();

    const selectedJobId = getSelectedJobId();

    if (selectedJobId) {
      navigate(`/top-products/${selectedJobId}`);
    } else {
      navigate("/top-products");
    }
  };

  const handleProductsClick = (e) => {
    e.preventDefault();

    const selectedJobId = getSelectedJobId();

    if (selectedJobId) {
      navigate(`/products/${selectedJobId}`);
    } else {
      navigate("/products");
    }
  };

  const isActive = (path) => {
    if (path === "/products") {
      return (
        location.pathname === "/products" ||
        location.pathname.startsWith("/products/")
      );
    }

    if (path === "/top-products") {
      return (
        location.pathname === "/top-products" ||
        location.pathname.startsWith("/top-products/")
      );
    }

    return location.pathname === path;
  };

  const navItemClass = (path) =>
    `px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-300 ${
      isActive(path)
        ? "bg-white text-slate-950 shadow-[0_10px_30px_rgba(255,255,255,0.18)]"
        : "text-white/75 hover:text-white hover:bg-white/10"
    }`;

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="logo-wrapper relative h-16 w-16 shrink-0">
              <div className="logo-aura absolute inset-0 rounded-full bg-cyan-400/20 blur-2xl" />
              <div className="logo-rotating-ring absolute inset-0 rounded-full border border-cyan-400/20" />

              <div className="logo-float relative h-16 w-16">
                <img
                  src={robot}
                  alt="AI Scraper Robot"
                  className="relative z-20 h-16 w-16 object-contain drop-shadow-[0_8px_24px_rgba(34,211,238,0.25)]"
                />

                <div className="pointer-events-none absolute left-1/2 top-1/2 z-30 h-10 w-10 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full">
                  <div className="logo-scan-line absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />
                </div>

                <div className="logo-focus-pulse absolute right-0 top-3 z-10 h-5 w-5 rounded-full border border-cyan-300/60" />
                <div className="logo-focus-pulse-delayed absolute right-[-2px] top-[10px] z-10 h-6 w-6 rounded-full border border-blue-300/40" />
              </div>
            </div>

            <div>
              <h1 className="text-white text-lg md:text-xl font-bold tracking-tight">
                Country Product Analyzer
              </h1>
              <p className="text-white/45 text-xs md:text-sm">
                AI scraping & product intelligence
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link to="/dashboard" className={navItemClass("/dashboard")}>
              Dashboard
            </Link>

            <a
              href="/products"
              onClick={handleProductsClick}
              className={navItemClass("/products")}
            >
              Products
            </a>

            <a
              href="/top-products"
              onClick={handleTopProductsClick}
              className={navItemClass("/top-products")}
            >
              Top Products
            </a>

            <Link to="/favorites" className={navItemClass("/favorites")}>
              Favorites
            </Link>

            <button
              onClick={handleLogout}
              className="ml-0 lg:ml-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-red-500 to-rose-500 text-white text-sm font-semibold hover:opacity-95 transition-all duration-300 shadow-[0_10px_30px_rgba(239,68,68,0.28)]"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <style>
        {`
          .logo-wrapper {
            transform-style: preserve-3d;
          }

          .logo-wrapper:hover {
            transform: perspective(800px) rotateX(6deg) rotateY(-8deg);
            transition: transform 350ms ease;
          }

          .logo-aura {
            animation: logoAuraBreath 2.8s ease-in-out infinite;
          }

          .logo-float {
            animation: logoFloat 3.4s ease-in-out infinite;
            transform-origin: center;
          }

          .logo-rotating-ring {
            animation: logoRotate 8s linear infinite;
          }

          .logo-scan-line {
            animation: logoScan 2s linear infinite;
          }

          .logo-focus-pulse {
            animation: logoPulse 1.8s ease-out infinite;
          }

          .logo-focus-pulse-delayed {
            animation: logoPulse 1.8s ease-out infinite 0.6s;
          }

          @keyframes logoFloat {
            0% {
              transform: translateY(0px) rotate(0deg) scale(1);
            }
            25% {
              transform: translateY(-2px) rotate(-1deg) scale(1.01);
            }
            50% {
              transform: translateY(-4px) rotate(0deg) scale(1.02);
            }
            75% {
              transform: translateY(-2px) rotate(1deg) scale(1.01);
            }
            100% {
              transform: translateY(0px) rotate(0deg) scale(1);
            }
          }

          @keyframes logoAuraBreath {
            0%, 100% {
              opacity: 0.35;
              transform: scale(0.92);
            }
            50% {
              opacity: 0.8;
              transform: scale(1.12);
            }
          }

          @keyframes logoRotate {
            0% {
              transform: rotate(0deg) scale(0.92);
              opacity: 0.5;
            }
            50% {
              opacity: 0.8;
            }
            100% {
              transform: rotate(360deg) scale(0.92);
              opacity: 0.5;
            }
          }

          @keyframes logoScan {
            0% {
              top: -2px;
              opacity: 0;
            }
            15% {
              opacity: 1;
            }
            50% {
              opacity: 1;
            }
            100% {
              top: 100%;
              opacity: 0;
            }
          }

          @keyframes logoPulse {
            0% {
              transform: scale(0.6);
              opacity: 0.9;
            }
            70% {
              transform: scale(1.8);
              opacity: 0;
            }
            100% {
              transform: scale(1.8);
              opacity: 0;
            }
          }
        `}
      </style>
    </>
  );
}

export default Navbar;