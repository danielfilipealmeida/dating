"use server"

import client from "@/app/lib/apolloClient";
import gql from "graphql-tag";
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { COOKIES } from "./enums";

/**
 * Server action responsible for signin up a new user.
 * Will call the SignupUser graphql mutation
 * @param formData 
 * @returns 
 */
export async function signUp(formData: FormData) {
    try {
         const { data } = await client.mutate({
            mutation: gql`mutation SignupUser($data: UserCreateInput!) {
                signupUser(data: $data) {
                    id
                }
            }`,
            variables: {
                data: {
                    email: formData.get('email'),
                    password: formData.get('password'),
                    sex: formData.get('sex')
                }
            }        
        })
        
        return data
    }
    catch(err: any) {
         return {
            error: true,
            message: err.message
        }
    }  
}

/**
 * Server-action for handling user authentication.
 * Will send email and password and get an updated token if the credentials are correct.
 * This token is used for all the other grapqhl operations when a user is required to be logged in.
 * If authentication fails, also removes the cookies
 *  
 * @param formData 
 * @returns 
 */
export async function authenticate(formData: FormData) {
    try {
        const { data } = await client.query({
            query: gql`query Authenticate($email: String, $password: String) {
                authenticate(email:$email, password: $password) 
            }`,
            variables: {
                email: formData.get('email'),
                password: formData.get('password')
            }
        })
        
        if (!data.authenticate) {
            throw new Error("Authentication failed")
        }
        
        const parsedTokens = jwt.verify(data.authenticate, process.env.APP_SECRET)

        // set the cookies
        cookies().set(COOKIES.Token as unknown as string, data.authenticate)
        cookies().set(COOKIES.TokenExpiration as unknown as string, parsedTokens.exp)
        cookies().set(COOKIES.CurrentUser as unknown as string, parsedTokens.userId)

        return {
            success: true
        }
    }
    catch(err: any) {
        console.error(err.message)
        // delete all user and token related cookies just in case
        logout()

        return {
            success: false,
            message: "Login failed"
        }
    }
}

/**
 * Queries the API for the user Data.
 * @param id
 * @returns the User data
 */
export async function getUserData(id: number, token: string) {
    try {
        handleTokenRefreshAndExpiration()
        const {data} = await client.query({
            query: gql`query User($id: ID!) {
                user(id: $id) {
                    email
                    id
                    name
                    bio
                    preferences {
                        sex
                        distance
                    }
                }
            }`,
            variables: {
                id: id
            }
        })
        
        return data.user
    }
    catch(err) {
        console.error(err.message)
        return {}
    }
}

/**
 * Server action responsible for updating User's data.
 * @param formData 
 * @returns 
 */
export async function updateUserData(formData:FormData) {
    try {
        const {data} = await client.mutate({
            mutation: gql`mutation UpdateUser($data: SetUserDataInput!) {
                setUserData(data: $data) {
                    id
                    name
                    bio
                    preferences {
                        sex
                        distance
                    }
                }
            }`,
            variables: {
                data: {
                    id: formData.get('id'),
                    bio: formData.get('bio'),
                    name: formData.get('name'),
                    preferences: {
                        sex: formData.getAll('preferences.sex'),
                        distance: parseInt(formData.get('preferences.distance')),
                    }
                }
            }
        })
        
        return data.setUserData
    }
    catch(err) {
        console.log(err.message)
        return {
            error: "Error updating User"
        }
    }
}

/**
 * 
 * @param token 
 * @param userId 
 */
export async function refreshToken(token: string, userId: number) {
    try {
        const {data} = await client.query({
            query: gql`query RefreshToken($token: String!, $id: ID!) {
                refreshToken(token: $token, id: $id)
            }`,
            variables: {
                token: token,
                id: userId
            }
        })

        const parsedTokens = jwt.verify(data.refreshToken, process.env.APP_SECRET)

        cookies().set(COOKIES.Token as unknown as string, data.refreshToken)
        cookies().set(COOKIES.TokenExpiration as unknown as string, parsedTokens.exp)
        cookies().set(COOKIES.CurrentUser as unknown as string, parsedTokens.userId)
    }
    catch(err) {
        console.error(err.message)
        logout()
    }
}

/**
 * Deletes the cookies and forces the user logout
 */
export async function logout() {
    cookies().delete(COOKIES.CurrentUser as unknown as string)
    cookies().delete(COOKIES.Token as unknown as string)
    cookies().delete(COOKIES.TokenExpiration as unknown as string)
}

/**
 * Checks the expiration time of a token and act accordingly:
 * - refresh if the current timestamp is in the refresh zone, updates the token afterwards
 * - logs out if the token has expired
 * 
 * Notes:
 * - Date.now() returns a timestamp in milliseconds
 * - expire is a timestamp in seconds
 * - refresh_interval argument is in minutes
 * 
 * @param refresh_interval the duration of the token refresh window in minutes
 * @returns 
 */
export async function handleTokenRefreshAndExpiration(refresh_interval=10) {
    const expire = parseInt((cookies().get(COOKIES.TokenExpiration)).value)

    // check as expired
    if ((Math.round(Date.now() / 1000)) > expire) {
        await logout()
        throw new Error("Token expired. Please login again!")
    }

    // check if is isn't yet time to. converts the refresh interval from minutes to milliseconds
    if (Math.round(Date.now() / 1000) < expire - (refresh_interval * 60)) {
        return
    }

    const token = (cookies().get(COOKIES.Token)).value
    const userId = (cookies().get(COOKIES.CurrentUser)).value

    // refresh the token
    await refreshToken(token, parseInt(userId))
}
