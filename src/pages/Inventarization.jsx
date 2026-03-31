import React, { useState, useEffect, memo } from "react";
import {
  startInventarization,
  updateCount,
  completeInventarization,
  getInventarizations
} from "../api/inventarization";
import { useInventarization } from "../context/InventarizationContext";
import { toast } from "react-toastify";
import {
  ClipboardList,
  Play,
  CheckCircle,
  AlertCircle,
  Search,
  Save,
  Loader2,
  ChevronRight,
  Barcode,
  History,
  Filter,
  Calendar,
  User,
  ArrowRight,
  Clock,
  ExternalLink,
  ChevronLeft,
  X
} from "lucide-react";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { useBarcodeScanner } from "../hooks/useBarcodeScanner";


const InventarizationRow = memo(({ item, savingId, onUpdate }) => {
  const isCounted = item.countedQuantity !== null && item.countedQuantity !== undefined;
  const hasDiscrepancy = isCounted && item.countedQuantity !== item.expectedQuantity;

  return (
    <tr
      className={`transition-colors ${hasDiscrepancy ? "bg-red-50/70 hover:bg-red-100/70" : "hover:bg-blue-50/30"}`}
    >
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          {hasDiscrepancy && <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" title="Расхождение" />}
          <div>
            <p className="font-bold text-gray-800">{item.productName}</p>
            <p className="text-xs text-gray-500 font-mono mt-0.5">{item.barcode}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <span className="text-lg font-mono text-gray-600 font-semibold">{item.expectedQuantity}</span>
      </td>
      <td className="px-6 py-4 text-center">
        <div className="inline-flex items-center gap-3">
          <input
            type="number"
            className="w-24 text-center border-2 border-gray-200 rounded-lg py-1.5 font-bold focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
            value={item.countedQuantity ?? ""}
            onChange={(e) => {
              const val = e.target.value === "" ? null : parseFloat(e.target.value);
              onUpdate(item.productId, val, false);
            }}
            onBlur={(e) => {
              if (e.target.value !== "") {
                onUpdate(item.productId, parseFloat(e.target.value) || 0, true);
              }
            }}
          />
        </div>
      </td>
      <td className="px-6 py-4 text-right">
        {savingId === item.productId ? (
          <span className="inline-flex items-center gap-2 text-blue-500 text-xs font-bold">
            <Loader2 size={14} className="animate-spin" /> Сохранение
          </span>
        ) : isCounted ? (
          <span className="inline-flex items-center gap-1 text-green-500 text-xs font-bold">
            <Save size={14} /> Сохранено
          </span>
        ) : (
          <span className="text-gray-300 text-xs font-medium uppercase italic">Ожидает</span>
        )}
      </td>
    </tr>
  );
});

export default function Inventarization() {
  const { user } = useAuth();
  const { activeInventarization, setActiveInventarization, loading: contextLoading } = useInventarization();

  const [loading, setLoading] = useState(false);
  const [completeData, setCompleteData] = useState(null);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [activeTab, setActiveTab] = useState("active");

  // History State
  const [historyData, setHistoryData] = useState({ items: [], totalPages: 0, totalElements: 0, currentPage: 0 });
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyFilters, setHistoryFilters] = useState({
    page: 0,
    pageSize: 10,
    status: null,
    conductedBy: "",
    startedFrom: "",
    startedTo: ""
  });
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);

  useEffect(() => {
    if (activeTab === "history") {
      fetchHistory();
    }
  }, [activeTab, historyFilters.page, historyFilters.status]);

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const data = await getInventarizations({
        ...historyFilters,
        conductedBy: historyFilters.conductedBy || null,
        startedFrom: historyFilters.startedFrom || null,
        startedTo: historyFilters.startedTo || null
      });
      setHistoryData(data);
    } catch (e) {
      toast.error("Не удалось загрузить историю");
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleApplyFilters = () => {
    setHistoryFilters(prev => ({ ...prev, page: 0 }));
    fetchHistory();
  };

  useEffect(() => {
    if (activeInventarization) {
      setItems(activeInventarization.items || []);
    } else {
      setItems([]);
    }
  }, [activeInventarization]);

  const handleStart = async () => {
    setLoading(true);
    try {
      const data = await startInventarization();
      setActiveInventarization(data);
      toast.success("Инвентаризация началась!");
    } catch (e) {
      toast.error(e.response?.data?.error || "Не удалось начать инвентаризацию");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (productId, quantity, persist = true) => {
    if (!activeInventarization) return;

    if (!persist) {
      setItems(prev =>
        prev.map(item =>
          item.productId === productId ? { ...item, countedQuantity: quantity } : item
        )
      );
      return;
    }

    const prevItems = items;
    setSavingId(productId);
    try {
      await updateCount(activeInventarization.id, productId, quantity);
    } catch (e) {
      toast.error("Не удалось сохранить количество — изменения отменены");
      setItems(prevItems);
    } finally {
      setSavingId(null);
    }
  };

  const handleComplete = async () => {
    if (!window.confirm("Вы уверены, что хотите завершить инвентаризацию? Это разморозит товары.")) return;

    setLoading(true);
    try {
      const data = await completeInventarization(activeInventarization.id);
      setCompleteData(data);
      setActiveInventarization(null);
      toast.success("Инвентаризация завершена!");
    } catch (e) {
      toast.error(e.response?.data?.error || "Не удалось завершить инвентаризацию");
    } finally {
      setLoading(false);
    }
  };

  const handleBarcodeScanned = (barcode) => {
    const item = items.find(i => i.barcode === barcode);
    if (item) {
      const newQty = (item.countedQuantity ?? 0) + 1;
      handleUpdate(item.productId, newQty, true);
      setItems(prev =>
        prev.map(p => p.productId === item.productId ? { ...p, countedQuantity: newQty } : p)
      );
      toast.success(`Сканировано: ${item.productName}`);
      setSearch("");
    } else {
      toast.warn(`Товар со штрихкодом ${barcode} не найден в этом списке`);
    }
  };
  useBarcodeScanner(handleBarcodeScanned);

  const filteredItems = items.filter(item => {
    const searchLower = search.toLowerCase();
    const barcodeMatch = item.barcode && String(item.barcode).includes(search);
    const nameMatch = item.productName.toLowerCase().includes(searchLower);
    return nameMatch || barcodeMatch;
  });

  const renderTabs = () => (
    <div className="flex bg-white mx-6 mt-6 p-1 rounded-2xl shadow-sm border border-gray-100 self-start">
      <button
        onClick={() => setActiveTab("active")}
        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === "active" ? "bg-blue-600 text-white shadow-md shadow-blue-100" : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"}`}
      >
        <Play size={18} className={activeTab === "active" ? "fill-current" : ""} />
        Текущая
      </button>
      <button
        onClick={() => setActiveTab("history")}
        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === "history" ? "bg-blue-600 text-white shadow-md shadow-blue-100" : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"}`}
      >
        <History size={18} />
        История
      </button>
    </div>
  );

  const renderHistory = () => (
    <div className="p-6 flex flex-col flex-1 overflow-hidden">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Статус</label>
          <select
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
            value={historyFilters.status || ""}
            onChange={(e) => setHistoryFilters(prev => ({ ...prev, status: e.target.value || null, page: 0 }))}
          >
            <option value="">Все статусы</option>
            <option value="CREATED">Создан</option>
            <option value="IN_PROGRESS">В процессе</option>
            <option value="COMPLETED">Завершен</option>
          </select>
        </div>
        <div className="md:col-span-3">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Провел</label>
          <input
            type="text"
            placeholder="Email или имя..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
            value={historyFilters.conductedBy}
            onChange={(e) => setHistoryFilters(prev => ({ ...prev, conductedBy: e.target.value }))}
          />
        </div>
        <div className="md:col-span-5 flex gap-2">
          <div className="flex-1">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">От</label>
            <input
              type="date"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
              value={historyFilters.startedFrom}
              onChange={(e) => setHistoryFilters(prev => ({ ...prev, startedFrom: e.target.value }))}
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">До</label>
            <input
              type="date"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
              value={historyFilters.startedTo}
              onChange={(e) => setHistoryFilters(prev => ({ ...prev, startedTo: e.target.value }))}
            />
          </div>
        </div>
        <button
          onClick={handleApplyFilters}
          className="md:col-span-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 h-[50px]"
        >
          <Filter size={18} />
          Применить
        </button>
      </div>

      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-gray-50 z-10">
              <tr className="border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">ID</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Статус</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Начато</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Завершено</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Провел</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Детали</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {historyLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-8">
                      <div className="h-4 bg-gray-100 rounded w-full"></div>
                    </td>
                  </tr>
                ))
              ) : historyData.items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400 font-medium">История пуста</td>
                </tr>
              ) : (
                historyData.items.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4 font-mono font-bold text-gray-400 text-sm">#{item.id}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${item.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                          item.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-500'
                        }`}>
                        {item.status === 'COMPLETED' ? 'Завершен' : item.status === 'IN_PROGRESS' ? 'В процессе' : 'Создан'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium font-mono">
                      {item.startedAt ? new Date(item.startedAt).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium font-mono">
                      {item.completedAt ? new Date(item.completedAt).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 font-bold truncate max-w-[200px]">
                      {item.conductedBy || "Система"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedHistoryItem(item)}
                        className="p-2.5 rounded-xl bg-gray-50 text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm"
                      >
                        <ArrowRight size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <p className="text-sm text-gray-500 font-medium">
            Страница <span className="text-gray-900 font-bold">{historyData.currentPage + 1}</span> из <span className="text-gray-900 font-bold">{historyData.totalPages || 1}</span>
          </p>
          <div className="flex gap-2">
            <button
              disabled={historyData.currentPage === 0 || historyLoading}
              onClick={() => setHistoryFilters(prev => ({ ...prev, page: prev.page - 1 }))}
              className="p-2 rounded-lg bg-white border border-gray-200 text-gray-600 disabled:opacity-50 hover:bg-gray-50 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              disabled={historyData.currentPage + 1 >= historyData.totalPages || historyLoading}
              onClick={() => setHistoryFilters(prev => ({ ...prev, page: prev.page + 1 }))}
              className="p-2 rounded-lg bg-white border border-gray-200 text-gray-600 disabled:opacity-50 hover:bg-gray-50 transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHistoryDetail = () => {
    if (!selectedHistoryItem) return null;
    
    // Use discrepancies array if available, otherwise filter from items
    const discrepancies = selectedHistoryItem.discrepancies?.length > 0 
      ? selectedHistoryItem.discrepancies 
      : (selectedHistoryItem.items || []).filter(item => {
          const expected = item.expectedQuantity ?? 0;
          const counted = item.countedQuantity ?? item.expectedQuantity ?? 0;
          return expected !== counted;
        });

    return (
      <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
          <div className="p-6 bg-white border-b border-gray-100 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <History className="text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-800">Инвентаризация #{selectedHistoryItem.id}</h2>
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${selectedHistoryItem.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                  {selectedHistoryItem.status === 'COMPLETED' ? 'Завершен' : 'В процессе'}
                </span>
              </div>
              <p className="text-sm text-gray-500 font-medium">Провел: {selectedHistoryItem.conductedBy || "Система"}</p>
            </div>
            <button
              onClick={() => setSelectedHistoryItem(null)}
              className="p-3 rounded-2xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8">
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-widest mb-3">
                  <Clock size={14} /> Временные отметки
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Начало:</span>
                    <span className="text-sm font-bold text-gray-700">{selectedHistoryItem.startedAt ? new Date(selectedHistoryItem.startedAt).toLocaleString() : "—"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Завершение:</span>
                    <span className="text-sm font-bold text-gray-700">{selectedHistoryItem.completedAt ? new Date(selectedHistoryItem.completedAt).toLocaleString() : "—"}</span>
                  </div>
                </div>
              </div>
              <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-widest mb-3">
                  <AlertCircle size={14} /> Итоги
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-red-500">Расхождения:</span>
                    <span className="text-xl font-black text-red-700">{discrepancies.length} поз.</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-red-500">Всего товаров:</span>
                    <span className="text-xl font-black text-red-700">{selectedHistoryItem.items?.length || 0} шт.</span>
                  </div>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-800 mb-4">Расхождения по товарам</h3>
            {discrepancies.length === 0 ? (
              <div className="bg-green-50 text-green-700 p-6 rounded-2xl border border-green-100 flex items-center justify-center gap-3 font-bold">
                <CheckCircle className="text-green-500" /> Расхождений не найдено.
              </div>
            ) : (
              <div className="border border-gray-100 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Товар</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Ож.</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Факт</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Разница</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {discrepancies.map((item, idx) => {
                      const diff = item.difference ?? (item.countedQuantity - item.expectedQuantity);
                      return (
                        <tr key={idx}>
                          <td className="px-6 py-4">
                            <p className="font-bold text-gray-800">{item.productName}</p>
                          </td>
                          <td className="px-6 py-4 text-center font-mono text-gray-500">{item.expectedQuantity}</td>
                          <td className="px-6 py-4 text-center font-mono text-gray-800 font-bold">{item.countedQuantity}</td>
                          <td className="px-6 py-4 text-right">
                            <span className={`px-2 py-1 rounded-lg text-sm font-black ${diff >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                              {diff > 0 ? `+${diff}` : diff}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderActive = () => {
    if (!activeInventarization && !completeData) {
      return (
        <div className="p-8 max-w-4xl mx-auto flex-1">
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-gray-100">
            <div className="bg-blue-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
              <ClipboardList size={48} className="text-blue-600" />
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">Инвентаризация</h1>
            <p className="text-xl text-gray-500 mb-10 max-w-lg mx-auto leading-relaxed">
              Готовы провести полную ревизию склада? Начало инвентаризации заморозит все продажи и операции с товарами до её завершения.
            </p>
            <button
              onClick={handleStart}
              disabled={loading}
              className="group relative bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 px-10 rounded-2xl transition-all shadow-xl hover:shadow-blue-200 flex items-center gap-3 mx-auto text-lg disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Play className="fill-current" />}
              Начать полную инвентаризацию
              <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      );
    }

    if (activeInventarization) {
      return (
        <div className="p-6 h-full flex flex-col flex-1">
          <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <ClipboardList className="text-blue-500" />
                Полная инвентаризация
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-md uppercase font-bold tracking-wider">В процессе</span>
              </h1>
              <p className="text-sm text-gray-500 mt-1">ID: #{activeInventarization.id} • Начато: {new Date(activeInventarization.startedAt).toLocaleString()}</p>
            </div>
            <button
              onClick={handleComplete}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-green-100 transition-all disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" /> : <CheckCircle size={20} />}
              Завершить инвентаризацию
            </button>
          </div>

          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Поиск товаров по имени или штрихкоду..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
              />
            </div>
            <div className="bg-white px-4 py-2 rounded-xl flex items-center gap-3 border border-gray-200 text-gray-600 shadow-sm">
              <Barcode className="text-blue-500" />
              <span className="text-sm font-medium">Сканер готов</span>
            </div>
          </div>

          <div className="flex-1 overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col">
            <div className="overflow-y-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-gray-50 z-10">
                  <tr className="border-b border-gray-200">
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Информация о товаре</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Ожидаемое</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Фактическое</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right w-40">Статус</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredItems.map(item => (
                    <InventarizationRow
                      key={item.productId}
                      item={item}
                      savingId={savingId}
                      onUpdate={handleUpdate}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
              <p className="text-sm text-gray-500 font-medium">
                Показано <span className="text-gray-900 font-bold">{filteredItems.length}</span> из <span className="text-gray-900 font-bold">{items.length}</span> товаров
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (completeData) {
      const allItems = completeData.items || [];
      const discrepancies = allItems.filter(item => (item.countedQuantity ?? item.expectedQuantity) !== item.expectedQuantity);

      return (
        <div className="p-6 max-w-5xl mx-auto flex-1 w-full">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 mb-6">
            <div className="bg-green-600 p-8 text-white flex justify-between items-center">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle size={32} />
                  <h1 className="text-3xl font-extrabold tracking-tight">Инвентаризация завершена</h1>
                </div>
                <p className="opacity-90 font-medium">ID Инвентаризации: #{completeData.id}</p>
              </div>
              <button
                onClick={() => setCompleteData(null)}
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-bold backdrop-blur-sm transition-all border border-white/20"
              >
                Вернуться
              </button>
            </div>

            <div className="p-8 grid grid-cols-3 gap-6">
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-2">Всего товаров</p>
                <p className="text-3xl font-black text-gray-900">{allItems.length}</p>
              </div>
              <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                <p className="text-sm text-red-500 font-bold uppercase tracking-wider mb-2">Расхождения</p>
                <p className="text-3xl font-black text-red-700">{discrepancies.length}</p>
              </div>
              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <p className="text-sm text-blue-500 font-bold uppercase tracking-wider mb-2">Провел</p>
                <p className="text-3xl font-black text-blue-700 truncate">{completeData.conductedBy || "Система"}</p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  if (contextLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header page="inventarization" user={user} />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header page="inventarization" user={user} />
      {renderTabs()}
      <div className="flex-1 flex flex-col overflow-hidden">
        {activeTab === "active" ? renderActive() : renderHistory()}
      </div>
      {renderHistoryDetail()}
    </div>
  );
}
