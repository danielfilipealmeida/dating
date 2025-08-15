import { createYoga } from 'graphql-yoga'
import { createServer } from 'http'
import { schema } from './schema'
import { GraphQLError } from 'graphql'

const yoga = createYoga({
  graphqlEndpoint: '/',
  schema,
  context: (req) => {
    return {
      req,
    }
  },
  maskedErrors: {
    maskError(error: any, message: string) {
      // If it's one of your known errors, preserve its message
      if (error.originalError instanceof Error) {
        return new GraphQLError(error.originalError.message);
      }
      // For unknown errors, show the generic message
      return new GraphQLError(message);
    }
  }
})

const server = createServer(yoga)

server.listen(4000, () => {
  console.log(`\
🚀 Server ready at: http://127.0.0.1:4000
⭐️ See sample queries: http://pris.ly/e/ts/graphql#using-the-graphql-api
  `)
})
