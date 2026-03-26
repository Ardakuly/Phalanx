import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getActiveInventarization } from "../api/inventarization";

const InventarizationContext = createContext();

export const useInventarization = () => useContext(InventarizationContext);

export const InventarizationProvider = ({ children }) => {
  const [activeInventarization, setActiveInventarization] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchActiveInventarization = useCallback(async () => {
    try {
      const data = await getActiveInventarization();
      setActiveInventarization(data);
    } catch (error) {
      console.error("Failed to fetch active inventarization", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActiveInventarization();
  }, [fetchActiveInventarization]);

  const isStockFrozen = !!activeInventarization;

  const value = {
    activeInventarization,
    setActiveInventarization,
    isStockFrozen,
    fetchActiveInventarization,
    loading,
  };

  return (
    <InventarizationContext.Provider value={value}>
      {children}
    </InventarizationContext.Provider>
  );
};
