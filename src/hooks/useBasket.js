import { useState } from "react";
import { sellProducts } from "../api/product";
import { toast } from "react-toastify";

export function useBasket() {
  const [basket, setBasket] = useState([]);

  // Add product to basket
  const handleAddToBasket = (product) => {
    const key = product.id || product.barcode || product.name;

    setBasket((prev) => {
      const existing = prev.find((p) => p.key === key);

      if (existing) {
        return prev.map((p) =>
          p.key === key ? { ...p, count: p.count + 1 } : p
        );
      }

      return [...prev, { ...product, key, count: 1 }];
    });
  };

  const handleIncrease = (product) => {
    setBasket((prev) =>
      prev.map((p) =>
        p.key === product.key ? { ...p, count: p.count + 1 } : p
      )
    );
  };

  const handleDecrease = (product) => {
    setBasket((prev) =>
      prev
        .map((p) =>
          p.key === product.key ? { ...p, count: p.count - 1 } : p
        )
        .filter((p) => p.count > 0)
    );
  };

  const handleRemove = (product) => {
    setBasket((prev) => prev.filter((p) => p.key !== product.key));
  };

  const handleSell = async (onSuccess) => {
    if (basket.length === 0) {
      toast.info("Basket is empty");
      return;
    }

    try {
      // Transform basket to ProductSellDto
      const productsToSell = basket.map((p) => ({
        ...(p.id ? { externalId: p.id.toString() } : {}),
        barcode: p.barcode,
        quantity: p.count,
      }));

      await sellProducts(productsToSell);

      toast.success("Products sold successfully");

      // Empty basket
      setBasket([]);
      
      // Execute passed success callback (e.g. refresh products)
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to sell products");
      console.error(error);
    }
  };

  return {
    basket,
    handleAddToBasket,
    handleIncrease,
    handleDecrease,
    handleRemove,
    handleSell,
  };
}
