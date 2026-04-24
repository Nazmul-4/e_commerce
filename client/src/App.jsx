import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage";
import TopProductsPage from "./pages/TopProductsPage";
import SearchJobProductsPage from "./pages/SearchJobProductsPage";
import SearchJobTopProductsPage from "./pages/SearchJobTopProductsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import FavoritesPage from "./pages/FavoritesPage";

function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={token ? "/dashboard" : "/login"} replace />}
        />

        <Route
          path="/login"
          element={token ? <Navigate to="/dashboard" replace /> : <LoginPage />}
        />

        <Route
          path="/register"
          element={
            token ? <Navigate to="/dashboard" replace /> : <RegisterPage />
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <ProductsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/products/:jobId"
          element={
            <ProtectedRoute>
              <SearchJobProductsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/top-products"
          element={
            <ProtectedRoute>
              <TopProductsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/top-products/:jobId"
          element={
            <ProtectedRoute>
              <SearchJobTopProductsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <FavoritesPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;