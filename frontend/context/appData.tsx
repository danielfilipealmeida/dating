import App from "next/app";
import { createContext, useContext, useState } from "react";
import { AppDataContextType } from "../app/types/context";

const Context = createContext({});

export function AppDataProvider({children} : {children: React.ReactNode}) {
    const [appData, setAppData] = useState<object>({})

    return (
        <Context.Provider value={[appData, setAppData]}>
          {children}
        </Context.Provider>
    )
}

export function useAppDataContext(): AppDataContextType {
    return useContext(Context) as AppDataContextType;
  }
