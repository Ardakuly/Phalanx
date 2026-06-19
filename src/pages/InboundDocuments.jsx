import React, { useState } from "react";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { useInboundDocuments } from "../hooks/useInboundDocuments";
import { FaChevronDown, FaChevronUp, FaSearch, FaCalendarAlt, FaEdit, FaTrash } from "react-icons/fa";
import { translateUnit } from "../utils/unitTranslations";
import InboundGoodEditModal from "../components/InboundGoodEditModal";
import { updateInboundGood, deleteInboundGood } from "../api/inboundDocument";
import { toast } from "react-toastify";
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

export default function InboundDocuments() {
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
    createdFrom,
    setCreatedFrom,
    createdTo,
    setCreatedTo,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    fetchDocuments,
  } = useInboundDocuments();

  const [expandedId, setExpandedId] = useState(null);
  const [selectedGood, setSelectedGood] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

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

  const calculateDocumentTotal = (goods) => {
    if (!goods) return 0;
    return goods.reduce((sum, good) => sum + (good.purchasedPrice * good.quantity), 0);
  };

  const calculateDocumentItemsCount = (goods) => {
    if (!goods) return 0;
    return goods.reduce((sum, good) => sum + good.quantity, 0);
  };

  const handleEditClick = (e, good) => {
    e.stopPropagation();
    setSelectedGood(good);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = async (e, good) => {
    e.stopPropagation();
    const confirmed = window.confirm(`Вы уверены, что хотите удалить товар "${good.name}"?`);
    if (!confirmed) return;

    try {
      await deleteInboundGood(good.externalId);
      toast.success("Товар успешно удален");
      fetchDocuments();
    } catch (error) {
      toast.error(error.response?.data?.error || "Ошибка при удалении товара");
    }
  };

  const handleEditSubmit = async (formData) => {
    setIsSubmittingEdit(true);
    try {
      await updateInboundGood(formData);
      toast.success("Товар успешно обновлен");
      setIsEditModalOpen(false);
      // Trigger a refresh of the list
      setPage(0);
      setSearch(search + " "); // force refresh if on page 0
      setTimeout(() => setSearch(search), 0);
    } catch (error) {
      toast.error(error.response?.data?.error || "Ошибка при обновлении товара");
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header page="inbound-documents" user={user} />

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Входящие товары</h2>
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
                placeholder="Поиск (№ документа, товар)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all w-64"
              />
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
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Кол-во товаров</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Сумма закупа</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading && (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center">
                      <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </td>
                  </tr>
                )}

                {!loading && documents.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-gray-400">
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
                      <td className="px-6 py-4 text-gray-600">{calculateDocumentItemsCount(doc.inboundGoods)} ед.</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{calculateDocumentTotal(doc.inboundGoods)?.toLocaleString()} ₸</td>
                      <td className="px-6 py-4 text-right">
                        {expandedId === doc.externalId ? <FaChevronUp className="text-gray-400 inline" /> : <FaChevronDown className="text-gray-400 inline" />}
                      </td>
                    </tr>

                    {/* Expandable Goods List */}
                    {expandedId === doc.externalId && (
                      <tr className="bg-gray-50/80">
                        <td colSpan="5" className="px-8 py-4">
                          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                            <table className="w-full text-sm">
                              <thead className="bg-gray-50/50 text-gray-500">
                                <tr>
                                  <th className="px-4 py-2 font-semibold">Товар</th>
                                  <th className="px-4 py-2 font-semibold">Артикул / ШК</th>
                                  <th className="px-4 py-2 font-semibold text-center">Кол-во</th>
                                  <th className="px-4 py-2 font-semibold text-right">Цена закупа</th>
                                  <th className="px-4 py-2 font-semibold text-right">Цена продажи</th>
                                  <th className="px-4 py-2 font-semibold text-right">Сумма (Закуп)</th>
                                  <th className="px-4 py-2 font-semibold text-center">Действия</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                {doc.inboundGoods?.map((good) => (
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
                                    <td className="px-4 py-3 text-right">{good.purchasedPrice?.toLocaleString()} ₸</td>
                                    <td className="px-4 py-3 text-right text-blue-600">{good.sellingPrice?.toLocaleString()} ₸</td>
                                    <td className="px-4 py-3 text-right font-medium">{(good.purchasedPrice * good.quantity)?.toLocaleString()} ₸</td>
                                    <td className="px-4 py-3 text-center">
                                      <div className="flex items-center justify-center gap-1">
                                        <button
                                          onClick={(e) => handleEditClick(e, good)}
                                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                          title="Редактировать товар"
                                        >
                                          <FaEdit size={14} />
                                        </button>
                                        <button
                                          onClick={(e) => handleDeleteClick(e, good)}
                                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                          title="Удалить товар"
                                        >
                                          <FaTrash size={14} />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
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

      <InboundGoodEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        good={selectedGood}
        onSubmit={handleEditSubmit}
        submitting={isSubmittingEdit}
      />
    </div>
  );
}
