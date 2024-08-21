import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';
import { COOKIES } from "../enums";
import { cookies } from "next/headers";


const httpLink = createHttpLink({
    uri: `http://${process.env.NEXT_PUBLIC_API_HOST}:${process.env.NEXT_PUBLIC_API_PORT}`,
  });

const authLink = setContext((_, { headers }) => {
    const token = cookies().get(COOKIES.Token as unknown as string)
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token.value}` : "",
      }
    }
  });

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
})

export default client