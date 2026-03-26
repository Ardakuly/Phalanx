import React from "react";
import { useInventarization } from "../context/InventarizationContext";
import { FaSnowflake } from "react-icons/fa";

export default function FrozenStockBadge() {
  const { isStockFrozen } = useInventarization();

  if (!isStockFrozen) return null;

  return (
    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2 border border-blue-200 animate-pulse">
      <FaSnowflake className="text-blue-500" />
      <span className="text-xs font-bold uppercase tracking-wider">Товар заморожен</span>
    </div>
  );
}
