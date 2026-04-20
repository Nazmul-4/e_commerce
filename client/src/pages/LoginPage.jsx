import { Link } from "react-router-dom";

function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-slate-800 mb-6">
          Login
        </h1>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-slate-800 text-white py-3 rounded-xl hover:bg-slate-900 transition"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-center text-slate-600 mt-6">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-slate-900 font-semibold">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;