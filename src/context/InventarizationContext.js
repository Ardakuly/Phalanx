import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { getActiveInventarization } from "../api/inventarization";
import { useAuth } from "./AuthContext";

const InventarizationContext = createContext();

export const useInventarization = () => useContext(InventarizationContext);

export const InventarizationProvider = ({ children }) => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [activeInventarization, setActiveInventarization] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Guard against concurrent in-flight requests that could cause race conditions
  const isFetchingRef = useRef(false);

  const fetchActiveInventarization = useCallback(async () => {
    if (isFetchingRef.current) return;
    
    isFetchingRef.current = true;
    setLoading(true);
    try {
      const data = await getActiveInventarization();
      setActiveInventarization(data);
    } catch (error) {
      console.error("Failed to fetch active inventarization", error);
      setActiveInventarization(null);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    // Wait for auth to resolve before fetching inventarization state.
    // This prevents showing the "Start" screen incorrectly during page load.
    if (authLoading) return;

    if (isAuthenticated) {
      fetchActiveInventarization();
    } else {
      setActiveInventarization(null);
      setLoading(false);
    }
  }, [authLoading, isAuthenticated, fetchActiveInventarization]);

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
