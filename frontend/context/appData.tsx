import { createContext, useContext, useState } from "react";


const Context = createContext({});

export function AppDataProvider({children}) {
    const [appData, setAppData] = useState<object>({})

    return (
        <Context.Provider value={[appData, setAppData]}>
          {children}
        </Context.Provider>
    )
}

export function useAppDataContext() {
    return useContext(Context)
  }