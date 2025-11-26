import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { signIn } from "../api/auth";

import Input from "../components/Input";
import Button from "../components/Button";

export default function Login() {
  const navigate = useNavigate();
  const [data, setData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await signIn(data);
      console.log(response);
      localStorage.setItem("token", response.accessToken);
      toast.success("Login successful!");
      navigate("/dashboard"); // replace with your dashboard route
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl w-full max-w-md shadow-lg"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">Log In</h2>

        <Input
          label="Email"
          value={data.email}
          onChange={handleChange}
          name="email"
          type="email"
        />
        <Input
          label="Password"
          value={data.password}
          onChange={handleChange}
          name="password"
          type="password"
        />

        <Button type="submit">{loading ? "Logging in..." : "Log In"}</Button>

        <p className="text-center text-sm mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Create Account
          </Link>
        </p>
      </form>
    </div>
  );
}
