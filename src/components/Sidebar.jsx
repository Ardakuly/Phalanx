import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi"; // menu icons

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const links = [
    { name: "Products", path: "/products" },
    { name: "Admin", path: "/admin" },
  ];

  return (
    <>
      {/* Toggle button */}
      <button
        className="fixed top-4 left-4 z-50 bg-blue-600 text-white p-2 rounded-md md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg transform transition-transform duration-300 z-40
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 w-64`}
      >
        <div className="p-6">
          <h2 className="text-xl font-bold mb-6">Phalanx POS</h2>
          <nav className="flex flex-col gap-3">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-4 py-2 rounded-lg hover:bg-blue-100 ${
                  location.pathname === link.path ? "bg-blue-200 font-semibold" : ""
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Overlay when sidebar is open on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-25 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}
