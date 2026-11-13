"use client";

import { AppPreferencesProvider } from "../lib/i18n";

export default function Providers({ children }) {
  return <AppPreferencesProvider>{children}</AppPreferencesProvider>;
}
