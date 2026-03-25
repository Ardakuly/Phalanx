import { BrowserRouter, Routes, Route } from "react-router-dom";
import Product from "./pages/Product";
import Admin from "./pages/Admin";
import Leftover from "./pages/Leftover";
import AppLayout from "./components/AppLayout";
import Login from "./pages/Login";
import Register from "./pages/Registration";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Product />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/leftovers"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AppLayout>
                  <Leftover />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AppLayout>
                  <Admin />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Login />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
