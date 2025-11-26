import React from "react";

export default function Header({ page, user, onAddProduct, onReportClick }) {
  return (
    <div className="flex justify-between items-center p-4 bg-white shadow-md">
        <div className="flex items-center gap-4">
            {page === "products" && (
            <>
                <button
                onClick={onAddProduct}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                Add Product
                </button>

                <div className="relative">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                        Reports
                    </button>
                    <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg hidden group-hover:block">
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
                </div>
            </>
        )}
        <div>
            <p className="font-semibold text-gray-700">
            {user.firstName} {user.lastName} ({user.role})
            </p>
        </div>
      </div>
    </div>
  );
}
