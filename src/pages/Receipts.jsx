import React, { useState } from "react";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { useOutboundDocuments } from "../hooks/useOutboundDocuments";
import { FaChevronDown, FaChevronUp, FaSearch, FaCalendarAlt, FaUndo } from "react-icons/fa";
import GoodReturnModal from "../components/GoodReturnModal";
import { translateUnit } from "../utils/unitTranslations";
import { getProductImageUrl } from "../utils/imageUtils";


const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

export default function Receipts() {
  const { user } = useAuth();
  const {
    documents,
    search,
    setSearch,
    page,
    setPage,
    totalPages,
    totalElements,
    loading,
    paymentType,
    setPaymentType,
    createdFrom,
    setCreatedFrom,
    createdTo,
    setCreatedTo,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
  } = useOutboundDocuments();

  const [expandedId, setExpandedId] = useState(null);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [selectedDocForReturn, setSelectedDocForReturn] = useState(null);

  const handleOpenReturnModal = (e, doc) => {
    e.stopPropagation();
    setSelectedDocForReturn(doc);
    setIsReturnModalOpen(true);
  };


  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "ASC" ? "DESC" : "ASC");
    } else {
      setSortBy(field);
      setSortDirection("DESC");
    }
    setPage(0);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header page="receipts" user={user} />

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Продажи</h2>
            <p className="text-gray-500 mt-1">Всего найдено: {totalElements}</p>
          </div>

          <div className="flex flex-wrap gap-3 items-end">
            {/* Search */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <FaSearch size={14} />
              </span>
              <input
                type="text"
                placeholder="Поиск (Email, №, товар)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all w-64"
              />
            </div>

            {/* Payment Type */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Тип оплаты</label>
              <select
                value={paymentType || ""}
                onChange={(e) => setPaymentType(e.target.value || null)}
                className="px-3 py-2 border border-gray-200 rounded-xl shadow-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer"
              >
                <option value="">Все типы</option>
                <option value="CASH">Наличные</option>
                <option value="CARD">Карта</option>
                <option value="QR">QR</option>
              </select>
            </div>

            {/* Date From */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">С</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                  <FaCalendarAlt size={12} />
                </span>
                <input
                  type="date"
                  value={createdFrom}
                  onChange={(e) => setCreatedFrom(e.target.value)}
                  className="pl-9 pr-3 py-2 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Date To */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">По</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                  <FaCalendarAlt size={12} />
                </span>
                <input
                  type="date"
                  value={createdTo}
                  onChange={(e) => setCreatedTo(e.target.value)}
                  className="pl-9 pr-3 py-2 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">№ Документа</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleSort("createdAt")}>
                    Дата {sortBy === "createdAt" && (sortDirection === "ASC" ? "↑" : "↓")}
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Продавец</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Тип оплаты</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleSort("totalIncome")}>
                    Сумма {sortBy === "totalIncome" && (sortDirection === "ASC" ? "↑" : "↓")}
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Маржа</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading && (
                  <tr>
                    <td colSpan="7" className="px-6 py-10 text-center">
                      <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </td>
                  </tr>
                )}

                {!loading && documents.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-6 py-10 text-center text-gray-400">
                      Ничего не найдено
                    </td>
                  </tr>
                )}

                {documents.map((doc) => (
                  <React.Fragment key={doc.externalId}>
                    <tr
                      className={`hover:bg-blue-50/30 transition-colors cursor-pointer ${expandedId === doc.externalId ? "bg-blue-50/50" : ""}`}
                      onClick={() => toggleExpand(doc.externalId)}
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">{doc.documentNumber}</td>
                      <td className="px-6 py-4 text-gray-600">{formatDate(doc.createdAt)}</td>
                      <td className="px-6 py-4 text-gray-600">{doc.seller}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          doc.paymentType === "CASH" 
                            ? "bg-green-100 text-green-700" 
                            : doc.paymentType === "QR"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-blue-100 text-blue-700"
                        }`}>
                          {doc.paymentType === "CASH" ? "Наличные" : doc.paymentType === "QR" ? "Каспи QR" : "Карта"}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{doc.totalIncome?.toLocaleString()} ₸</td>
                      <td className="px-6 py-4 text-green-600 font-medium">+{doc.margin?.toLocaleString()} ₸</td>
                      <td className="px-6 py-4 text-right">
                        {expandedId === doc.externalId ? <FaChevronUp className="text-gray-400 inline" /> : <FaChevronDown className="text-gray-400 inline" />}
                      </td>
                    </tr>

                    {/* Expandable Goods List */}
                    {expandedId === doc.externalId && (
                      <tr className="bg-gray-50/80">
                        <td colSpan="7" className="px-8 py-4">
                          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                            <table className="w-full text-sm">
                              <thead className="bg-gray-50/50 text-gray-500">
                                <tr>
                                  <th className="px-4 py-2 font-semibold">Товар</th>
                                  <th className="px-4 py-2 font-semibold">Артикул / ШК</th>
                                  <th className="px-4 py-2 font-semibold text-center">Кол-во</th>
                                  <th className="px-4 py-2 font-semibold text-right">Цена</th>
                                  <th className="px-4 py-2 font-semibold text-right">Сумма</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                {doc.outboundGoods?.map((good) => (
                                  <tr key={good.externalId} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 flex items-center gap-3">
                                      {good.photoUrl ? (
                                        <img src={getProductImageUrl(good.photoUrl)} alt={good.name} className="w-8 h-8 rounded-md object-cover border border-gray-100" />
                                      ) : (
                                        <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center text-gray-400 text-[10px]">N/A</div>
                                      )}
                                      <span className="font-medium">{good.name}</span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-500">
                                      <div className="text-xs uppercase">{good.sku}</div>
                                      <div className="text-[10px] text-gray-400">{good.barcode}</div>
                                    </td>
                                    <td className="px-4 py-3 text-center">{good.quantity} {translateUnit(good.unit)}</td>
                                    <td className="px-4 py-3 text-right">{good.sellingPrice?.toLocaleString()} ₸</td>
                                    <td className="px-4 py-3 text-right font-medium">{(good.sellingPrice * good.quantity)?.toLocaleString()} ₸</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            <div className="px-4 py-3 bg-gray-50 flex items-center justify-between border-t border-gray-100">
                              <div className="flex flex-col gap-1">
                                {doc.comment && (
                                  <div className="text-blue-700 text-xs italic">
                                    <strong>Комментарий:</strong> {doc.comment}
                                  </div>
                                )}
                              </div>
                              <button
                                onClick={(e) => handleOpenReturnModal(e, doc)}
                                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded-xl transition-all text-xs border border-red-100"
                              >
                                <FaUndo size={10} />
                                Оформить возврат
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Страница {page + 1} из {totalPages || 1}
            </div>
            <div className="flex gap-2">
              <button
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Назад
              </button>
              <button
                disabled={page + 1 >= totalPages}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Вперед
              </button>
            </div>
          </div>
        </div>
      </main>

      <GoodReturnModal
        isOpen={isReturnModalOpen}
        onClose={() => setIsReturnModalOpen(false)}
        document={selectedDocForReturn}
        onSuccess={() => {
          // No need to refresh receipts per user comment: 
          // "Original receipt should not updated... The receipts for returned goods will be in another page."
        }}
      />
    </div>
  );
}
