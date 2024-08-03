'use client'

import { createContext, useState } from "react";

const AppDataContext = createContext({});

export function AppDataProvider({children}: {
  children: React.ReactNode
}) {
    const [data, setData] = useState({})

    return (
        <AppDataContext.Provider value={[data, setData]}>
          {children}
        </AppDataContext.Provider>
    )
}

export default AppDataContext