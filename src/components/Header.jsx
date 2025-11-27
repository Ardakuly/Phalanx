import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa"; // install if needed: npm install react-icons

export default function Header({ page, user, onAddProduct, onReportClick }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex justify-between items-center p-4 bg-white shadow-md">

      {/* LEFT — Logo or Title (if required later) */}
      <h1 className="text-xl font-semibold text-gray-700">Point-of-Sale</h1>

      {/* RIGHT — Buttons + Profile */}
      <div className="flex items-center gap-6">

        {page === "products" && (
          <div className="flex items-center gap-4">

            {/* ADD PRODUCT */}
            <button
              onClick={onAddProduct}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Add Product
            </button>

            {/* REPORTS DROPDOWN */}
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Reports
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg">
                  <div
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => onReportClick("leftover")}
                  >
                    Leftover
                  </div>
                  <div
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => onReportClick("transactions")}
                  >
                    Transactions
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* USER PROFILE */}
        <div className="flex items-center gap-2 cursor-pointer">
          <FaUserCircle size={26} className="text-gray-600" />
          <p className="font-semibold text-gray-700">
            {user.firstName} {user.lastName}
          </p>
        </div>

      </div>
    </div>
  );
}
