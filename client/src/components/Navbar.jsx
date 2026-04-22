import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="bg-slate-900 text-white px-6 py-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-xl font-bold">Country Product Analyzer</h1>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/dashboard"
            className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition"
          >
            Dashboard
          </Link>

          <Link
            to="/products"
            className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition"
          >
            Products
          </Link>

          <Link
            to="/top-products"
            className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition"
          >
            Top Products
          </Link>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;