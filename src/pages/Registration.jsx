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
      toast.success("Регистрация прошла успешно! Пожалуйста, войдите.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response.data.error);
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
          Создать аккаунт
        </h2>

        <Input
          label="Имя"
          value={data.firstName}
          onChange={handleChange}
          name="firstName"
        />
        <Input
          label="Фамилия"
          value={data.lastName}
          onChange={handleChange}
          name="lastName"
        />
        <Input
          label="Почта"
          value={data.email}
          onChange={handleChange}
          name="email"
          type="email"
        />
        <Input
          label="Пароль"
          value={data.password}
          onChange={handleChange}
          name="password"
          type="password"
        />

        <Button type="submit">{loading ? "Регистрация..." : "Зарегистрироваться"}</Button>

        <p className="text-center text-sm mt-4">
          Уже есть аккаунт?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Войти
          </Link>
        </p>
      </form>
    </div>
  );
}
