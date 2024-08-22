const jwt = require('jsonwebtoken')
const assert = require('node:assert').strict;
const secret = process.env.APP_SECRET
const tokenDuration = process.env.TOKEN_DURATION

export function generateToken(tokenData: object): any {
    return jwt.sign(tokenData, secret, { expiresIn: tokenDuration })
}

export function verifyToken(token: string): any {
    try {
        return jwt.verify(token, secret)
    } catch (err) {
        throw new Error('Invalid or expired token')
    }
}

/**
 * Extract and returns the token from the Authorization Header if it exists, 
 * else returns null
 * @param context 
 * @returns 
 */
export const getTokenFromAuthorizationHeader = (context): string | null => {
    try {
        const token: string = context.request.headers.get('authorization')
        assert.equal(!!token, true)
        return token
    }
    catch (err) {
        console.error(err.message)
        return null
    }
}

/**
 * Checks the Authorization header variable and return the user id if
 * @param context 
 * @returns 
 */
export const getTokenData = (context): object => {
    try {
        const token: string | null = getTokenFromAuthorizationHeader(context)
        assert.equal(!!token, true)
        assert.equal(token.split(" ")[0].toLowerCase(), 'bearer')

        return verifyToken(token.split(" ")[1])
    }
    catch (err) {
        console.error(err.message)

        return null
    }
}

/**
 * This is only available on dev and it is used for development purposes.
 * will return if the header contains the super user code in order to allow the user in
 * @param context 
 * @returns 
 */
export const checkAuthTokenForSuperuser = (context): bool => {
    const token = getTokenFromAuthorizationHeader(context)
    if (!token) {
        return null
    }

    return process.env.NODE_ENV === 'development' &&
        !!process.env.SUPERUSER_TOKEN &&
        token == process.env.SUPERUSER_TOKEN
}
