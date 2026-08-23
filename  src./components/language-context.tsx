import { createContext, useContext } from "react";

export type Language = "en" | "km";

export type LocalizedText = {
  en: string;
  km: string;
};

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined,
);

export function LanguageProvider({
  value,
  children,
}: {
  value: LanguageContextValue;
  children: React.ReactNode;
}) {
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }

  return context;
}

export function getLocalizedText(
  value: LocalizedText,
  language: Language,
): string {
  return value[language] ?? value.en;
}
