'use server'

import { useMutation } from "@apollo/client";
import gql from 'graphql-tag';
import SIGNUP_USER from './graphql/signupUser.graphql'
import assert from "node:assert/strict";

//import {signIn} from '@/auth'

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


export async function signup(formData: FormData) {
  assert.equal(formData.get('password'), formData.get('password2'))

  console.log(formData)
  /*
  const SIGNUP_USER = gql`{
  }`
  */
  const [signupUser] = useMutation(SIGNUP_USER);

  const {data} = await signupUser({
    variables: {
      data: {
        email: formData.get('email'),
        password: formData.get('password')
      }
    }
  })
  
}