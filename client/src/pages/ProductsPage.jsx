import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api, { getAuthConfig } from "../services/api";
import { saveSelectedJobId } from "../utils/selectedJob";

function ProductsPage() {
  const navigate = useNavigate();

  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    const loadPage = async () => {
      try {
        const { data } = await api.get("/search/my-history", getAuthConfig());
        const jobs = data.searchJobs || [];
        setSearchHistory(jobs);
      } catch (error) {
        console.error("Failed to fetch search history:", error.message);
      }
    };

    loadPage();
  }, []);

  const handleOpenProductsPage = (jobId) => {
    saveSelectedJobId(jobId);
    navigate(`/products/${jobId}`);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
        <div className="rounded-[32px] bg-slate-900 border border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.35)] p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Product Explorer
          </h2>
          <p className="text-slate-400 mb-6">
            Choose a search job to open its own product page.
          </p>

          {searchHistory.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-white/10 bg-slate-950/40 p-8 text-center text-slate-400">
              No search jobs found.
            </div>
          ) : (
            <div className="space-y-3">
              {searchHistory.map((job) => (
                <div
                  key={job._id}
                  className="rounded-[24px] border border-white/10 bg-slate-950/50 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 transition"
                >
                  <div>
                    <p className="font-semibold text-white capitalize">
                      {job.keyword}
                    </p>
                    <p className="text-sm text-slate-400">
                      {job.country} • {job.currency} • {job.status}
                    </p>
                  </div>

                  <button
                    onClick={() => handleOpenProductsPage(job._id)}
                    className="rounded-2xl bg-slate-800 text-white px-4 py-2.5 hover:bg-slate-700 transition font-medium"
                  >
                    View Products
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;