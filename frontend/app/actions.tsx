"use server"

import client from "../app/lib/apolloClient";
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
        
        parseAndStoreTokenData(data.authenticate);

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
 * Extracts the token from the data received from the server and stores it in the cookies.
 * Also extracts the expiration time and the user id from the token and stores them in cookies.
 * This is used for the user authentication and authorization. 
 * @param {string} data - the token received from the server
 * @returns {void}
 * @throws {Error} if the token is invalid or expired
 */
function parseAndStoreTokenData(data: string) {
    const parsedTokens = jwt.verify(data, process.env.APP_SECRET as jwt.Secret);

    // set the cookies
    cookies().set(COOKIES.Token, data);
    if (typeof parsedTokens === "object" &&
        parsedTokens !== null &&
        "exp" in parsedTokens &&
        "userId" in parsedTokens) {
        cookies().set(COOKIES.TokenExpiration, String(parsedTokens.exp));
        cookies().set(COOKIES.CurrentUser, String(parsedTokens.userId));
    }
}

/**
 * Queries the API for the user Data.
 * @param id
 * @returns the User data
 */
export async function getUserData(id: string, token: string) {
    try {
        handleTokenRefreshAndExpiration()
        const {data} = await client.query({
            query: gql`query User($id: ID!) {
                user(id: $id) {
                    email
                    id
                    name
                    sex
                    bio
                    preferences {
                        sex
                        distance
                    }
                    pictures {
                        path
                    }
                }
            }`,
            variables: {
                id: id
            }
        })
        
        return data.user
    }
    catch(err: any) {
        console.error(err.message as string)
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
                        distance: parseInt((formData.get('preferences.distance') ?? Number(process.env.DEFAULT_RADIUS)).toString()),
                    }
                }
            }
        })
        
        return data.setUserData
    }
    catch(err: any) {
        console.log(err.message as string)
        return {
            error: "Error updating User"
        }
    }
}

/**
 * Refreshes the token for the user.
 * This is done by calling the RefreshToken graphql query. 
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

        parseAndStoreTokenData(data.refreshToken);
    }
    catch(err: any) {
        console.error(err.message as string)
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
    const tokenExpirationCookie = cookies().get(COOKIES.TokenExpiration);
    if (!tokenExpirationCookie || !tokenExpirationCookie.value) {
        await logout();
        throw new Error("Token expiration not found. Please login again!");
    }
    const expire = parseInt(tokenExpirationCookie.value);

    // check as expired
    if ((Math.round(Date.now() / 1000)) > expire) {
        await logout()
        throw new Error("Token expired. Please login again!")
    }

    // check if is isn't yet time to. converts the refresh interval from minutes to milliseconds
    if (Math.round(Date.now() / 1000) < expire - (refresh_interval * 60)) {
        return
    }

    const tokenCookie = cookies().get(COOKIES.Token);
    const userIdCookie = cookies().get(COOKIES.CurrentUser);

    if (!tokenCookie || !tokenCookie.value || !userIdCookie || !userIdCookie.value) {
        await logout();
        throw new Error("Token or user ID not found. Please login again!");
    }

    const token = tokenCookie.value;
    const userId = userIdCookie.value;

    // refresh the token
    await refreshToken(token, parseInt(userId))
}


/**
 * Calls the Vote mutation to cast a vote for a user.
 * 
 * @param voterId - the ID of the user casting the vote
 * @param votedForId - the ID of the user being voted for
 * @param like - true if the vote is a like, false if it is a dislike
 * 
 * @returns the mutation result
 * 
 * @throws Error if the vote fails
 */
export async function vote(voterId: string, votedForId: string, like: boolean) {
    try {
        const { data } = await client.mutate({
            mutation: gql`mutation Vote($voterId: String!, $votedForId: String!, $like: Boolean!) {
                vote(votedId: $voterId, votedForId: $votedForId, like: $like) {
                    id
                    voterId
                    votedForId
                    like
                }
            }`,
            variables: {
                voterId,
                votedForId,
                like
            }
        });

        return data.vote;
    } catch (err: any) {
        console.error(err.message);
        throw new Error("Failed to cast vote");
    }
}