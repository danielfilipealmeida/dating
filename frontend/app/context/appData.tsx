'use client'

import { createContext, useState } from "react";

const AppDataContext = createContext({});

export function AppDataProvider({children}: {
  children: React.ReactNode
}) {
    const [appData, setAppData] = useState({})

    return (
        <AppDataContext.Provider value={{appData, setAppData}}>
          {children}
        </AppDataContext.Provider>
    )
}

export default AppDataContext