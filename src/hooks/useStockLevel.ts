import { useState, useEffect, useCallback } from 'react';

type VariantStock = {
  variation: { name: string; option: string }[];
  stock: number | null;
};

type StockData = {
  stock: number | null;
  variants: VariantStock[];
};

const STOCK_API_URL =
  process.env.GATSBY_STOCK_API_URL ||
  'https://r4kiikf3r9.execute-api.us-east-2.amazonaws.com/default/whipworks-stock';

const STOCK_API_MODE = process.env.GATSBY_STOCK_API_MODE || 'live';

/**
 * Fetches stock levels from Snipcart via the whipworks-stock Lambda proxy.
 *
 * @param productId - The Snipcart product ID (e.g. "concho", "coreless-paracord")
 * @returns { stockData, isLoading, error, getStockForVariant }
 */
const useStockLevel = (productId: string) => {
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const res = await fetch(
          `${STOCK_API_URL}?productId=${encodeURIComponent(productId)}&mode=${STOCK_API_MODE}`
        );
        if (!res.ok) {
          setStockData(null);
          return;
        }
        const data = await res.json();
        setStockData(data);
      } catch {
        setError('Failed to fetch stock');
        setStockData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStock();
  }, [productId]);

  /**
   * Get the stock level for a specific variant selection.
   * Pass a record of { "Color": "Silver" } or { "Color": "Black", "Length": "1000 Feet" }
   * Returns the stock number, or null if not tracked.
   */
  const getStockForVariant = useCallback(
    (selections: Record<string, string>): number | null => {
      if (!stockData || stockData.variants.length === 0) return null;

      const selectionEntries = Object.entries(selections);
      if (selectionEntries.length === 0) return stockData.stock;

      const match = stockData.variants.find((v) =>
        selectionEntries.every(([name, option]) =>
          v.variation.some(
            (vr) =>
              vr.name.toLowerCase() === name.toLowerCase() &&
              vr.option.toLowerCase() === option.toLowerCase()
          )
        )
      );

      if (match) return match.stock;
      return null;
    },
    [stockData]
  );

  return { stockData, isLoading, error, getStockForVariant };
};

export default useStockLevel;
