import React, { useState, useEffect } from "react";
import { 
  startInventarization, 
  updateCount, 
  completeInventarization 
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
  Barcode
} from "lucide-react";
import { useBarcodeScanner } from "../hooks/useBarcodeScanner";

export default function Inventarization() {
  const { activeInventarization, setActiveInventarization, fetchActiveInventarization } = useInventarization();
  const [loading, setLoading] = useState(false);
  const [completeData, setCompleteData] = useState(null);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [savingId, setSavingId] = useState(null);

  // Sync items when active inventarization changes
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
    }
    setLoading(false);
  };

  const handleUpdateCount = async (productId, quantity) => {
    if (!activeInventarization) return;
    
    setSavingId(productId);
    try {
      await updateCount(activeInventarization.id, productId, quantity);
      
      // Update local state
      setItems(prev => prev.map(item => 
        item.productId === productId ? { ...item, countedQuantity: quantity } : item
      ));
    } catch (e) {
      toast.error("Не удалось сохранить количество");
    }
    setSavingId(null);
  };

  const handleComplete = async () => {
    if (!window.confirm("Вы уверены, что хотите завершить инвентаризацию? Это разморозит товары.")) return;
    
    setLoading(true);
    try {
      const data = await completeInventarization(activeInventarization.id);
      setCompleteData(data);
      setActiveInventarization(null); // This will transition UI to summary
      toast.success("Инвентаризация завершена!");
    } catch (e) {
      toast.error(e.response?.data?.error || "Не удалось завершить инвентаризацию");
    }
    setLoading(false);
  };

  // Barcode scanner support
  const handleBarcodeScanned = (barcode) => {
    const item = items.find(i => i.barcode === barcode);
    if (item) {
      const newQty = (item.countedQuantity || 0) + 1;
      handleUpdateCount(item.productId, newQty);
      toast.success(`Сканировано: ${item.productName}`);
      setSearch(""); // Clear search to show the scanned item
    } else {
      toast.warn(`Товар со штрихкодом ${barcode} не найден в этом списке`);
    }
  };
  useBarcodeScanner(handleBarcodeScanned);

  const filteredItems = items.filter(item => {
    const searchLower = search.toLowerCase();
    return (
        item.productName.toLowerCase().includes(searchLower) || 
        (item.barcode && String(item.barcode).includes(search))
    );
  });

  // RENDERING SCREENS
  
  // 1. START SCREEN
  if (!activeInventarization && !completeData) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-gray-100 italic-gradient">
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

  // 2. COUNTING SCREEN
  if (activeInventarization) {
    return (
      <div className="p-6 h-full flex flex-col bg-gray-50">
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
                {filteredItems.map(item => {
                  const hasDiscrepancy = item.countedQuantity !== undefined && item.countedQuantity !== item.expectedQuantity;
                  
                  return (
                    <tr 
                      key={item.productId} 
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
                          value={item.countedQuantity || ""}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            // Update locally first for snappiness
                            setItems(prev => prev.map(p => p.productId === item.productId ? { ...p, countedQuantity: val } : p));
                          }}
                          onBlur={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            handleUpdateCount(item.productId, val);
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {savingId === item.productId ? (
                        <span className="inline-flex items-center gap-2 text-blue-500 text-xs font-bold">
                          <Loader2 size={14} className="animate-spin" /> Сохранение
                        </span>
                      ) : item.countedQuantity !== undefined ? (
                         <span className="inline-flex items-center gap-1 text-green-500 text-xs font-bold">
                           <Save size={14} /> Сохранено
                         </span>
                      ) : (
                        <span className="text-gray-300 text-xs font-medium uppercase italic">Ожидает</span>
                      )}
                    </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
            <p className="text-sm text-gray-500 font-medium">
                Показано <span className="text-gray-900 font-bold">{filteredItems.length}</span> из <span className="text-gray-900 font-bold">{items.length}</span> товаров
            </p>
            <div className="flex gap-4 items-center">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                    <div className="w-3 h-3 bg-red-100 rounded-sm"></div> Найдено расхождение
                </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. SUMMARY SCREEN
  if (completeData) {
    const discrepancies = completeData.discrepancies || [];
    
    return (
      <div className="p-6 max-w-5xl mx-auto h-full flex flex-col">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 mb-6">
            <div className="bg-green-600 p-8 text-white flex justify-between items-center">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <CheckCircle size={32} />
                        <h1 className="text-3xl font-extrabold tracking-tight">Инвентаризация завершена</h1>
                    </div>
                    <p className="opacity-90 font-medium">ID Инвентаризации: #{completeData.id} • Склад обновлен, товары разморожены.</p>
                </div>
                <button 
                  onClick={() => setCompleteData(null)}
                  className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-bold backdrop-blur-md transition-all border border-white/20"
                >
                    Вернуться в начало
                </button>
            </div>

            <div className="p-8 grid grid-cols-3 gap-6">
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-2">Всего товаров</p>
                    <p className="text-3xl font-black text-gray-900">{completeData.items?.length || 0}</p>
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
            
            <div className="px-8 pb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <AlertCircle className="text-amber-500" />
                    Расхождения по товарам
                </h2>
                
                <div className="border border-gray-200 rounded-2xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Товар</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Ожидаемое</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Фактическое</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Разница</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {completeData.items?.map(item => {
                                const diff = item.countedQuantity - item.expectedQuantity;
                                const hasDiff = diff !== 0;
                                
                                return (
                                    <tr key={item.productId} className={hasDiff ? "bg-amber-50/30" : ""}>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-gray-800">{item.productName}</p>
                                        </td>
                                        <td className="px-6 py-4 text-center font-mono text-gray-600">{item.expectedQuantity}</td>
                                        <td className="px-6 py-4 text-center font-mono text-gray-800 font-bold">{item.countedQuantity}</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-black ${
                                                diff > 0 ? "bg-green-100 text-green-700" : 
                                                diff < 0 ? "bg-red-100 text-red-700" : 
                                                "bg-gray-100 text-gray-500"
                                            }`}>
                                                {diff > 0 ? `+${diff}` : diff}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>
    );
  }

  return null;
}
