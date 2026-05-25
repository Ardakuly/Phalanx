import { useState } from "react";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import AddProductModal from "../components/AddProductModal";
import Basket from "../components/Basket";
import SortDropdown from "../components/SortDropdown";
import { useAuth } from "../context/AuthContext";
import { useProducts } from "../hooks/useProducts";
import { useBasket } from "../hooks/useBasket";
import { useBarcodeScanner } from "../hooks/useBarcodeScanner";
import { getProductByBarcode } from "../api/product";
import { toast } from "react-toastify";
import { downloadLeftoverReport, downloadTransactionsReport } from "../api/report";



export default function Products() {
  const { user } = useAuth();
  const [openModal, setOpenModal] = useState(false);
  const [unknownBarcode, setUnknownBarcode] = useState("");

  const {
    products,
    search,
    setSearch,
    page,
    setPage,
    totalPages,
    loading,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    fetchProducts,
  } = useProducts();

  const handleSortChange = (newSortBy, newSortDirection) => {
    setSortBy(newSortBy);
    setSortDirection(newSortDirection);
    setPage(0);
  };

  const {
    basket,
    handleAddToBasket,
    handleIncrease,
    handleDecrease,
    handleRemove,
    handleSell,
  } = useBasket();

  const handleBarcodeScanned = async (barcode) => {
    try {
      // First, try to find in already loaded products to save a network request
      let productToAdd = products.find(p => p.barcode === barcode);

      if (!productToAdd) {
        // Not in current list, fetch from API
        productToAdd = await getProductByBarcode(barcode);
      }

      if (productToAdd) {
        handleAddToBasket(productToAdd);
        toast.success(`Сканирован: ${productToAdd.name}`);
      }
    } catch (e) {
      toast.error(
        <div>
          <p className="mb-2">Продукт со штрихкодом {barcode} не найден</p>
          <button 
            onClick={() => {
              setUnknownBarcode(barcode);
              setOpenModal(true);
              toast.dismiss(); // optional, but good to close the toast if they click it
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-sm w-full font-medium transition-colors"
          >
            Добавить продукт
          </button>
        </div>,
        { autoClose: 5000, closeOnClick: false }
      );
    }
  };

  useBarcodeScanner(handleBarcodeScanned);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      <Header
        page="products"
        user={user}
        onAddProduct={() => setOpenModal(true)}
        onReportClick={
            async (type) => {
                try {
                    if (type === "leftover") {
                        await downloadLeftoverReport();
                    } else if (type === "transactions") {
                        await downloadTransactionsReport();
                    }
                } catch (e) {
                    toast.error("Failed to download report");
                }
            }
        }
      />

      <div className="flex p-4 gap-6 flex-1 overflow-hidden">

        {/* LEFT SIDE */}
        <div className="flex-1 overflow-y-auto p-2">

          {/* SEARCH + SORT */}
          <div className="flex gap-3 mb-3 items-center">
            <input
              type="text"
              placeholder="Поиск продуктов по имени и штрихкоду"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border p-2 rounded w-4/5"
            />

            <SortDropdown 
              sortBy={sortBy} 
              sortDirection={sortDirection} 
              onSortChange={handleSortChange} 
            />
          </div>

          {loading && (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {!loading && products.length === 0 && (
            <div className="text-center py-10 bg-white rounded-xl shadow-md mt-4 text-gray-500">
              <p className="text-lg">Продукты не найдены</p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 mt-4">
            {products.map((prod) => (
              <ProductCard
                key={prod.barcode}
                product={prod}
                onAdd={() => handleAddToBasket(prod)}
              />
            ))}
          </div>

          {/* PAGINATION */}
          <div className="p-4 mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
            <p className="text-sm text-gray-500 font-medium">
              Страница <span className="text-gray-900 font-bold">{page + 1}</span> из <span className="text-gray-900 font-bold">{totalPages || 1}</span>
            </p>
            <div className="flex gap-2">
              <button
                disabled={page === 0 || loading}
                onClick={() => setPage((p) => p - 1)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Назад
              </button>
              <button
                disabled={page + 1 >= totalPages || loading}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Вперед
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: BASKET */}
        <Basket
          basket={basket}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
          onRemove={handleRemove}
          onSell={(pt) => handleSell(fetchProducts, pt)}
        />
      </div>

      <AddProductModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setUnknownBarcode("");
        }}
        onSuccess={fetchProducts}
        initialBarcode={unknownBarcode}
      />
    </div>
  );
}