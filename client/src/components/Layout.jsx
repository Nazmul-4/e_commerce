import { Link, useNavigate } from "react-router-dom";

function Layout({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen flex bg-slate-100">

      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white p-6 hidden md:flex flex-col">
        <h1 className="text-2xl font-bold mb-8">Analyzer</h1>

        <Link to="/dashboard" className="mb-3 hover:text-blue-400">
          Dashboard
        </Link>

        <Link to="/products" className="mb-3 hover:text-blue-400">
          Products
        </Link>

        <Link to="/top-products" className="mb-3 hover:text-blue-400">
          Top Products
        </Link>

        <button
          onClick={handleLogout}
          className="mt-auto bg-red-500 px-4 py-2 rounded-xl hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Main */}
      <div className="flex-1 p-6">
        {children}
      </div>

    </div>
  );
}

export default Layout;