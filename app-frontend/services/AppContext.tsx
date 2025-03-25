import React, { createContext, useContext, useState, ReactNode } from "react";
import { AppMode } from "./api";

interface AppContextType {
  appMode: AppMode;
  setAppMode: (mode: AppMode) => void;
}

const defaultContext: AppContextType = {
  appMode: "customer",
  setAppMode: () => {},
};

export const AppContext = createContext<AppContextType>(defaultContext);

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [appMode, setAppMode] = useState<AppMode>("customer");

  return (
    <AppContext.Provider value={{ appMode, setAppMode }}>
      {children}
    </AppContext.Provider>
  );
};
