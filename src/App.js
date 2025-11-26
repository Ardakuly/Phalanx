import { BrowserRouter, Routes, Route } from "react-router-dom";
import Product from "./pages/Product";
import Admin from "./pages/Admin";
import AppLayout from "./components/AppLayout";
import Login from "./pages/Login";
import Register from "./pages/Registration";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/products"
          element={
            <AppLayout>
              <Product />
            </AppLayout>
          }
        />
        <Route
          path="/admin"
          element={
            <AppLayout>
              <Admin />
            </AppLayout>
          }
        />

        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
