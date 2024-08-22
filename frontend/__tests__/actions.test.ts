import { describe, expect, it, vi } from "vitest"


import client from "../app/lib/apolloClient";
import { signUp } from "../app/actions";
import gql from "graphql-tag";

describe('Actions', () => {
    describe('signUp', () => {
        it('Extracts data from the FormData', () => {
            const formData: FormData = new FormData()
            formData.set('email', 'the email')
            formData.set('password', 'the password'),
            formData.set('sex', 'MALE')

            const clientSpy = vi.spyOn(client, 'mutate')

            const result = signUp(formData)

            expect(clientSpy).toHaveBeenCalledTimes(1)
            expect(clientSpy).toHaveBeenCalledWith({
                mutation: gql`mutation SignupUser($data: UserCreateInput!) {
                    signupUser(data: $data) {
                        id
                    }
                }`,
                variables: {
                    data: {
                        email: "the email",
                        password: "the password",
                        sex: "MALE"
                    }
                }  
            })
        })
    })
})