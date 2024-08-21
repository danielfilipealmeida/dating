'use client'

import { createContext, useState } from "react";
import { COOKIES } from "../enums";


const AppDataContext = createContext({});

/**
 * Parses a string that should be the result of `document.cookie` into an object,
 * with int and float values parsed
 * @param cookies
 * @returns 
 */
export const parseCookiesString = (cookies: string): object => {
  const splittedCookies = cookies.split(';').map(cookie => {
    return cookie.trim().split('=')
  })
  let result = {}

  splittedCookies.forEach((value) => {
    const parsedValue = +value[1]

    result[value[0]] = isNaN(parsedValue) ? value[1]:parsedValue
  })

  return result
}

/**
 * Returns an object with only the requested elements
 * @param input 
 * @param elementsToKeep 
 * @returns 
 */
export const pickFromObject = (input: object, elementsToKeep: string[]): object => {
  let result = {}
  Object.keys(input).forEach((value: string) => {
    if (elementsToKeep.includes(value)) {
      result[value] = input[value]
    }
  })
  return result
}

export function AppDataProvider({children}: {
  children: React.ReactNode
}) {
  const [appData, setAppData] = useState(
    typeof document === "undefined" ? {} :
    pickFromObject(
      parseCookiesString(document.cookie),
      [
        COOKIES.CurrentUser as unknown as string,
        COOKIES.Token as unknown as string,
        COOKIES.TokenExpiration as unknown as string,
      ]
    )
  )

  return (
      <AppDataContext.Provider value={{appData, setAppData}}>
        {children}
      </AppDataContext.Provider>
  )
}

export default AppDataContext