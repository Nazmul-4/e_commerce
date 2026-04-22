import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

const avatarOptions = [
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Jasper",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Midnight",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Sasha",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Leo",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Luna",
];

function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    country: "BD",
    avatar: avatarOptions[0],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleAvatarSelect = (avatar) => {
    setForm((prev) => ({
      ...prev,
      avatar,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      setLoading(true);
      await api.post("/auth/register", form);
      setMessage("Account created successfully!");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950 flex items-center justify-center px-4">
      <div className="absolute -top-28 -right-24 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="absolute top-1/3 -left-24 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="absolute -bottom-24 right-1/3 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.45)] p-8 md:p-9">
          <div className="flex flex-col items-center text-center mb-7">
            <div className="w-16 h-16 rounded-[22px] bg-gradient-to-br from-fuchsia-500 via-violet-500 to-cyan-500 flex items-center justify-center text-white font-extrabold text-xl shadow-[0_14px_30px_rgba(168,85,247,0.35)]">
              CP
            </div>

            <h2 className="text-white text-3xl font-bold mt-4 tracking-tight">
              Create Account
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Start exploring multi-country product insights
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Choose Avatar
              </label>

              <div className="grid grid-cols-3 gap-3">
                {avatarOptions.map((avatar, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleAvatarSelect(avatar)}
                    className={`relative rounded-2xl p-2 border transition ${
                      form.avatar === avatar
                        ? "border-cyan-400 bg-cyan-500/10 shadow-[0_0_0_1px_rgba(34,211,238,0.4)]"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    }`}
                  >
                    <img
                      src={avatar}
                      alt={`Avatar ${index + 1}`}
                      className="w-full h-20 object-contain rounded-xl bg-slate-900/70"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-900/80 text-white border border-white/10 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-2">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-900/80 text-white border border-white/10 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-900/80 text-white border border-white/10 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-2">Country</label>
              <select
                name="country"
                value={form.country}
                onChange={handleChange}
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-900/80 text-white border border-white/10 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition"
              >
                <option value="BD">🇧🇩 Bangladesh</option>
                <option value="IN">🇮🇳 India</option>
                <option value="CN">🇨🇳 China</option>
              </select>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 text-red-300 px-4 py-3 text-sm">
                {error}
              </div>
            )}

            {message && (
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-300 px-4 py-3 text-sm">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-500 hover:opacity-95 text-white font-semibold py-3.5 rounded-2xl transition shadow-[0_16px_40px_rgba(168,85,247,0.35)] disabled:opacity-50"
            >
              {loading ? "Creating..." : "Register"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-violet-400 hover:text-violet-300 font-semibold transition"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;