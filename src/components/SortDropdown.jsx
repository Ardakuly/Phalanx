import { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";

export default function SortDropdown({ sortBy, sortDirection, onSortChange }) {
  const [openSort, setOpenSort] = useState(false);
  const sortRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setOpenSort(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const sortOptions = [
    { value: "createdAt:DESC", label: "Новые" },
    { value: "createdAt:ASC", label: "Старые" },
    { value: "name:ASC", label: "Имя A→Z" },
    { value: "name:DESC", label: "Имя Z→A" },
    { value: "sellingPrice:ASC", label: "Цена: низкая→высокая" },
    { value: "sellingPrice:DESC", label: "Цена: высокая→низкая" },
    { value: "stockBalance:ASC", label: "Остаток: низкий→высокий" },
    { value: "stockBalance:DESC", label: "Остаток: высокий→низкий" }
  ];

  const currentSortLabel = sortOptions.find(o => o.value === `${sortBy}:${sortDirection}`)?.label || "Новые";

  return (
    <div className="relative w-1/4" ref={sortRef}>
      <div 
        onClick={() => setOpenSort(!openSort)}
        className="border p-2 rounded w-full bg-white flex justify-between items-center cursor-pointer hover:border-blue-400 transition-colors"
        style={{ height: '42px' }}
      >
        <span className="text-gray-700 truncate text-sm">{currentSortLabel}</span>
        <FaChevronDown className="text-gray-400 shrink-0 ml-2" size={12}/>
      </div>

      {openSort && (
        <div className="absolute z-10 w-[120%] right-0 mt-1 bg-white border rounded shadow-lg overflow-hidden">
          {sortOptions.map(opt => (
            <div 
              key={opt.value}
              className={`px-3 py-2 cursor-pointer text-sm hover:bg-blue-50 transition-colors ${opt.value === `${sortBy}:${sortDirection}` ? "bg-blue-100 font-medium text-blue-700" : "text-gray-700"}`}
              onClick={() => {
                const [f, d] = opt.value.split(":");
                onSortChange(f, d);
                setOpenSort(false);
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
