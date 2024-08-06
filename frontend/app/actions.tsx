"use server"

import client from "@/app/lib/apolloClient";
import gql from "graphql-tag";

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
        debugger
        return {
            error: true,
            message: err.message
        }
    }  
}


export async function authenticate(formData: FormData) {
    try {
        const result = await client.query({
            query: gql`authenticate(data:$data) {
                id
                data
            }`
        })
    }
    catch(err: any) {

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