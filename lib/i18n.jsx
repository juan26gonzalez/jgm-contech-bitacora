"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  convertQty,
  convertUnitLabel,
  convertUnitPriceCopToDisplay,
  convertLengthM,
  convertTempC,
  convertStrengthMpa,
  convertForceKn,
  getUnitSystem,
} from "./units";

export const PREFS_STORAGE_KEY = "jgm_contech_ui_prefs_v1";

export const DEFAULT_EXCHANGE_RATES_COP = {
  COP: 1,
  USD: 4350,
  EUR: 4680,
};

const AppPreferencesContext = createContext(null);

export function AppPreferencesProvider({ children }) {
  const [lang, setLangState] = useState("es");
  const [currency, setCurrencyState] = useState("COP");
  const [darkTheme, setDarkThemeState] = useState(false);
  const [rates, setRates] = useState(DEFAULT_EXCHANGE_RATES_COP);
  const [fxLive, setFxLive] = useState(false);
  const [fxSource, setFxSource] = useState("fallback-reference");
  const [fxUpdatedAt, setFxUpdatedAt] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PREFS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.lang === "en" || parsed.lang === "es") setLangState(parsed.lang);
        if (parsed.currency === "COP" || parsed.currency === "USD" || parsed.currency === "EUR") {
          setCurrencyState(parsed.currency);
        }
        if (typeof parsed.darkTheme === "boolean") setDarkThemeState(parsed.darkTheme);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", darkTheme ? "dark" : "light");
    }
  }, [darkTheme]);

  useEffect(() => {
    let active = true;
    fetch("/api/fx-rates")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active || !data) return;
        const usd = Number(data.copPerUsd);
        const eur = Number(data.copPerEur);
        if (Number.isFinite(usd) && usd > 1000 && Number.isFinite(eur) && eur > 1000) {
          setRates({ COP: 1, USD: usd, EUR: eur });
          setFxLive(Boolean(data.ok));
          setFxSource(String(data.source || "live"));
          setFxUpdatedAt(String(data.updatedAt || ""));
        }
      })
      .catch(() => {
        // retain fallback rates cleanly
      });
    return () => {
      active = false;
    };
  }, []);

  const persistPrefs = useCallback((nextLang, nextCurr, nextDark) => {
    try {
      localStorage.setItem(
        PREFS_STORAGE_KEY,
        JSON.stringify({ lang: nextLang, currency: nextCurr, darkTheme: nextDark })
      );
    } catch {
      // ignore
    }
  }, []);

  const setLang = useCallback(
    (next) => {
      setLangState(next);
      persistPrefs(next, currency, darkTheme);
    },
    [currency, darkTheme, persistPrefs]
  );

  const toggleLang = useCallback(() => {
    const next = lang === "es" ? "en" : "es";
    setLang(next);
  }, [lang, setLang]);

  const setCurrency = useCallback(
    (next) => {
      setCurrencyState(next);
      persistPrefs(lang, next, darkTheme);
    },
    [lang, darkTheme, persistPrefs]
  );

  const setDarkTheme = useCallback(
    (next) => {
      const val = Boolean(next);
      setDarkThemeState(val);
      persistPrefs(lang, currency, val);
    },
    [lang, currency, persistPrefs]
  );

  const toggleTheme = useCallback(() => {
    setDarkTheme(!darkTheme);
  }, [darkTheme, setDarkTheme]);

  const unitSystem = getUnitSystem(lang);

  const formatNumber = useCallback(
    (val, decimals = 2) => {
      const n = Number(val || 0);
      return n.toLocaleString(lang === "en" ? "en-US" : "es-CO", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
    },
    [lang]
  );

  const formatMoney = useCallback(
    (copAmount, compact = false) => {
      const fx = rates[currency] || 1;
      const converted = Number(copAmount || 0) / fx;
      const decimals = currency === "COP" ? 0 : 2;
      if (compact && Math.abs(converted) >= 1_000_000) {
        const prefix = currency === "USD" ? "US$" : currency === "EUR" ? "€" : "$";
        return `${prefix}${(converted / 1_000_000).toFixed(2)}M`;
      }
      if (currency === "USD") {
        return `US$${converted.toLocaleString("en-US", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}`;
      }
      if (currency === "EUR") {
        return `€${converted.toLocaleString("de-DE", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}`;
      }
      return `$${Math.round(converted).toLocaleString("es-CO")}`;
    },
    [currency, rates]
  );

  const formatUnitMoney = useCallback(
    (copPerMetricUnit, metricUnit) => {
      const val = convertUnitPriceCopToDisplay(copPerMetricUnit, metricUnit, currency, rates, lang);
      const decimals = currency === "COP" ? 0 : 2;
      if (currency === "USD") {
        return `US$${val.toLocaleString("en-US", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}`;
      }
      if (currency === "EUR") {
        return `€${val.toLocaleString("de-DE", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}`;
      }
      return `$${Math.round(val).toLocaleString("es-CO")}`;
    },
    [currency, lang, rates]
  );

  const formatQty = useCallback(
    (qtyMetric, metricUnit, decimals = 2) => {
      const val = convertQty(qtyMetric, metricUnit, lang);
      return val.toLocaleString(lang === "en" ? "en-US" : "es-CO", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
    },
    [lang]
  );

  const convertQtyValue = useCallback(
    (qtyMetric, metricUnit) => convertQty(qtyMetric, metricUnit, lang),
    [lang]
  );

  const unitLabel = useCallback(
    (metricUnit) => convertUnitLabel(metricUnit, lang),
    [lang]
  );

  const formatTemp = useCallback(
    (celsius) => {
      const v = convertTempC(celsius, lang);
      return `${v.toFixed(1)} ${lang === "en" ? "°F" : "°C"}`;
    },
    [lang]
  );

  const formatStrength = useCallback(
    (mpa) => {
      const v = convertStrengthMpa(mpa, lang);
      return lang === "en" ? `${Math.round(v).toLocaleString("en-US")} PSI` : `${Number(mpa || 0).toFixed(1)} MPa`;
    },
    [lang]
  );

  const formatForce = useCallback(
    (kn) => {
      const v = convertForceKn(kn, lang);
      return lang === "en" ? `${v.toFixed(1)} kip` : `${Number(kn || 0).toFixed(1)} kN`;
    },
    [lang]
  );

  const formatLength = useCallback(
    (meters, decimals = 2) => {
      const v = convertLengthM(meters, lang);
      return `${v.toFixed(decimals)} ${lang === "en" ? "ft" : "m"}`;
    },
    [lang]
  );

  return (
    <AppPreferencesContext.Provider
      value={{
        lang,
        setLang,
        toggleLang,
        currency,
        setCurrency,
        unitSystem,
        darkTheme,
        setDarkTheme,
        toggleTheme,
        rates,
        fxLive,
        fxSource,
        fxUpdatedAt,
        formatNumber,
        formatMoney,
        formatUnitMoney,
        formatQty,
        convertQtyValue,
        unitLabel,
        formatTemp,
        formatStrength,
        formatForce,
        formatLength,
      }}
    >
      {children}
    </AppPreferencesContext.Provider>
  );
}

export function useAppPreferences() {
  const ctx = useContext(AppPreferencesContext);
  if (!ctx) {
    return {
      lang: "es",
      setLang: () => {},
      toggleLang: () => {},
      currency: "COP",
      setCurrency: () => {},
      unitSystem: "metric",
      darkTheme: false,
      setDarkTheme: () => {},
      toggleTheme: () => {},
      rates: DEFAULT_EXCHANGE_RATES_COP,
      fxLive: false,
      fxSource: "fallback",
      fxUpdatedAt: "",
      formatNumber: (v, d = 2) => Number(v || 0).toFixed(d),
      formatMoney: (v) => `$${Math.round(Number(v || 0)).toLocaleString("es-CO")}`,
      formatUnitMoney: (v) => `$${Math.round(Number(v || 0)).toLocaleString("es-CO")}`,
      formatQty: (v, _u, d = 2) => Number(v || 0).toFixed(d),
      convertQtyValue: (v) => Number(v || 0),
      unitLabel: (u) => String(u || "und"),
      formatTemp: (c) => `${Number(c || 0).toFixed(1)} °C`,
      formatStrength: (m) => `${Number(m || 0).toFixed(1)} MPa`,
      formatForce: (k) => `${Number(k || 0).toFixed(1)} kN`,
      formatLength: (m, d = 2) => `${Number(m || 0).toFixed(d)} m`,
    };
  }
  return ctx;
}
