import React, { useState, useEffect, useRef } from "react";
import { FaUserCircle, FaChevronDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useInventarization } from "../context/InventarizationContext";
import FrozenStockBadge from "./FrozenStockBadge";

export default function Header({ page, user, onAddProduct, onReportClick }) {
  const [openReports, setOpenReports] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const ref = useRef(null);

  // close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpenReports(false);
        setOpenProfile(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navigate = useNavigate();
  const { isStockFrozen } = useInventarization();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isEmployer = user?.role === "EMPLOYER";

  return (
    <div className="flex justify-between items-center p-4 bg-white shadow-md" ref={ref}>

      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-gray-700">Point-of-Sale</h1>
        <FrozenStockBadge />
      </div>

      <div className="flex items-center gap-6">

        {/* PRODUCTS PAGE BUTTONS - only for EMPLOYER */}
        {page === "products" && isEmployer && (
          <div className="flex items-center gap-4">

            <button
              onClick={onAddProduct}
              disabled={isStockFrozen}
              className={`text-white px-4 py-2 rounded-lg ${
                isStockFrozen ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              Добавить продукт
            </button>

            {/* REPORTS DROPDOWN */}
            <div className="relative">
              <button
                onClick={() => {
                  setOpenReports(prev => !prev);
                  setOpenProfile(false);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                Отчёты <FaChevronDown size={14} />
              </button>

              {openReports && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg">
                  <div
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => onReportClick("leftover")}
                  >
                    Остаток
                  </div>
                  <div
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => onReportClick("transactions")}
                  >
                    Продажи
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* USER PROFILE + LOGOUT */}
        <div className="relative">
          <div
            className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80"
            onClick={() => {
              setOpenProfile(prev => !prev);
              setOpenReports(false);
            }}
          >
            <FaUserCircle size={26} className="text-gray-600" />
            <p className="font-semibold text-gray-700 flex items-center gap-2">
              {user.firstName} {user.lastName} <FaChevronDown size={14} className="text-gray-500" />
            </p>
          </div>

          {openProfile && (
            <div className="absolute right-0 mt-2 w-36 bg-white shadow-lg rounded-lg overflow-hidden">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}