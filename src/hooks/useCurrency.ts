import { useState, useCallback } from "react";

export type Currency = "USD" | "INR";

const EXCHANGE_RATES: Record<Currency, number> = {
  USD: 1,
  INR: 83.5, // Approximate exchange rate
};

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: "$",
  INR: "₹",
};

export const useCurrency = (defaultCurrency: Currency = "USD") => {
  const [currency, setCurrency] = useState<Currency>(defaultCurrency);

  const convert = useCallback(
    (amountInUSD: number): number => {
      return Math.round(amountInUSD * EXCHANGE_RATES[currency]);
    },
    [currency]
  );

  const format = useCallback(
    (amountInUSD: number): string => {
      const converted = convert(amountInUSD);
      const symbol = CURRENCY_SYMBOLS[currency];
      
      if (currency === "INR") {
        return `${symbol}${converted.toLocaleString("en-IN")}`;
      }
      return `${symbol}${converted.toLocaleString("en-US")}`;
    },
    [currency, convert]
  );

  const parsePrice = useCallback(
    (priceString: string): number | null => {
      // Extract numeric value from strings like "$150", "~$100", "Free", etc.
      const match = priceString.match(/\$?\s*(\d+(?:,\d+)*(?:\.\d+)?)/);
      if (match) {
        return parseFloat(match[1].replace(/,/g, ""));
      }
      return null;
    },
    []
  );

  const formatPriceString = useCallback(
    (priceString: string): string => {
      if (priceString.toLowerCase() === "free") return "Free";
      
      const amount = parsePrice(priceString);
      if (amount === null) return priceString;

      // Preserve any prefix like "~" for approximate values
      const prefix = priceString.match(/^[~≈]/)?.[0] || "";
      return `${prefix}${format(amount)}`;
    },
    [parsePrice, format]
  );

  const symbol = CURRENCY_SYMBOLS[currency];

  return {
    currency,
    setCurrency,
    convert,
    format,
    formatPriceString,
    symbol,
  };
};
