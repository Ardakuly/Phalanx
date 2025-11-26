import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { signUp } from "../api/auth";

import Input from "../components/Input";
import Button from "../components/Button";

export default function Register() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signUp(data);
      toast.success("Registration successful! Please login.");
      navigate("/login");
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
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Create Account
        </h2>

        <Input
          label="First Name"
          value={data.firstName}
          onChange={handleChange}
          name="firstName"
        />
        <Input
          label="Last Name"
          value={data.lastName}
          onChange={handleChange}
          name="lastName"
        />
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

        <Button type="submit">{loading ? "Registering..." : "Sign Up"}</Button>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Log In
          </Link>
        </p>
      </form>
    </div>
  );
}
