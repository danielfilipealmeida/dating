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
        debugger
        if (!data.authenticate.success) {
            throw new Error(data.authenticate.message)
        }
        
        // set the cookie
        cookies().set('currentUser', data.authenticate.id)

        return {
            success: true
        }

        //router.push('/edit')
    }
    catch(err: any) {
        return {
            success: false,
            message: err.message
        }
    }
}

/*
export async function signIn(formData: FormData) {
  
}

export async function authenticate(_currentState:unknown, formData: FormData) {
    try {
        await signIn(formData)
    }
    catch (error) {
      if (error) {
        switch (error.type) {
          case 'CredentialsSignin':
            return 'Invalid credentials.'
          default:
            return 'Something went wrong.'
        }
      }
      throw error
    }   
}

*/