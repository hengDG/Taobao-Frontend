import {
  createContext,
  useContext,
  type ReactNode,
} from "react";

export type Language = "en" | "km";

export type LocalizedText = {
  en: string;
  km: string;
};

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
};

const LanguageContext =
  createContext<LanguageContextValue | null>(
    null,
  );

type LanguageProviderProps = {
  children: ReactNode;
  value: LanguageContextValue;
};

export function LanguageProvider({
  children,
  value,
}: LanguageProviderProps) {
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context =
    useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider",
    );
  }

  return context;
}

export function getLocalizedText(
  text: LocalizedText,
  language: Language,
) {
  return text[language];
}