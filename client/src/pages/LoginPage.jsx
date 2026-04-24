import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const { data } = await api.post("/auth/login", form);

      // ✅ COOKIE PART START
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("user", JSON.stringify(data.user));
      // ✅ COOKIE PART END

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950 flex items-center justify-center px-4">
      <div className="absolute -top-28 -left-24 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="absolute -bottom-28 left-1/3 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.45)] p-8 md:p-9">
          <div className="flex flex-col items-center text-center mb-7">
            <div className="w-16 h-16 rounded-[22px] bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600 flex items-center justify-center text-white font-extrabold text-xl shadow-[0_14px_30px_rgba(59,130,246,0.35)]">
              CP
            </div>

            <h2 className="text-white text-3xl font-bold mt-4 tracking-tight">
              Welcome Back
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Sign in to continue managing product insights
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-300 mb-2">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-900/80 text-white border border-white/10 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-2">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-900/80 text-white border border-white/10 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
              />
            </div>

            {error && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 text-red-300 px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600 hover:opacity-95 text-white font-semibold py-3.5 rounded-2xl transition shadow-[0_16px_40px_rgba(59,130,246,0.35)] disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-semibold transition">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;