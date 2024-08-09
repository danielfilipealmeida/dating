"use server"

import client from "@/app/lib/apolloClient";
import gql from "graphql-tag";
import { cookies } from 'next/headers'

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
                    password: formData.get('password')
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


export async function authenticate(formData: FormData) {
    try {
        const { data } = await client.query({
            query: gql`query Authenticate($email: String, $password: String) {
                authenticate(email:$email, password: $password) {
                    success
                    id
                    message
                }
            }`,
            variables: {
                email: formData.get('email'),
                password: formData.get('password')
            }
        })
        
        if (!data.authenticate.success) {
            throw new Error(data.authenticate.message)
        }
        
        // set the cookie
        cookies().set('currentUser', data.authenticate.id)

        return {
            success: true
        }
    }
    catch(err: any) {
        return {
            success: false,
            message: err.message
        }
    }
}

/**
 * Queries the API for the user Data.
 * @param id
 * @returns the User data
 */
export async function getUserData(id: number) {
    try {
        const {data} = await client.query({
            query: gql`query User($id: ID!) {
                user(id: $id) {
                    email
                    id
                    name
                    bio
                }
            }`,
            variables: {
                id: id
            }
        })
        
        return data.user
    }
    catch(err) {
        return {}
    }
}

export async function updateUserData(formData:FormData) {
    try {
        const {data} = await client.mutate({
            mutation: gql`mutation UpdateUser($data: SetUserDataInput!) {
                setUserData(data: $data) {
                    id
                    name
                    bio
                }
            }`,
            variables: {
                data: {
                    id: formData.get('id'),
                    bio: formData.get('bio'),
                    name: formData.get('name')
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