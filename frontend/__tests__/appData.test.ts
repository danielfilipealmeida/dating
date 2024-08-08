import { parseCookiesString, pickFromObject } from '../app/context/appData'
import { expect, describe, it } from 'vitest'

describe('AppData', () => {
    describe('parseCookiesString', () => {
        it('should parse correctly the input cookie string', () => {
            const testCookieString = "ajs_anonymous_id=some_value; currentUser=60; anotherVariable=xxx; aFloat=1.222"
            const result = parseCookiesString(testCookieString)
           
            expect(result).toStrictEqual(
                {
                    ajs_anonymous_id: "some_value",
                    currentUser: 60,
                    anotherVariable: "xxx",
                    aFloat:1.222
                }
            )
        })
    })

    describe('pickFromObject', () => {
        it('should keep only the requested elements of an object', () => {
            const input = {
                hello: "world",
                helter: "skelter"
            }
            const result = pickFromObject(input, ["helter"])

            expect(result).toStrictEqual({helter: "skelter"})
        })
    })
})