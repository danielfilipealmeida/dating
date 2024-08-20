import SchemaBuilder from '@pothos/core'
import PrismaPlugin from '@pothos/plugin-prisma'
import type PrismaTypes from '@pothos/plugin-prisma/generated'
import { DateTimeResolver } from 'graphql-scalars'
import { prisma } from './db'
import ScopeAuthPlugin from '@pothos/plugin-scope-auth';
import { checkAuthTokenForSuperuser, getTokenData } from './jwt'


export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes
  Context: {
    userId: number|null
  }
  AuthScopes: {
    public: boolean,
  }
  Scalars: {
    DateTime: {
      Input: Date
      Output: Date
    }
  }
}>({
  plugins: [PrismaPlugin, ScopeAuthPlugin],
  prisma: {
    client: prisma,
  },
  scopeAuth: {
    authScopes: async (context) => {
      const {userId} = getTokenData(context)
      const isSuperUser = checkAuthTokenForSuperuser(context)
      return {
        isAuthenticated: !!userId || isSuperUser,
        superuser: isSuperUser
      }
    }
  }
})

builder.queryType({})
builder.mutationType({})

builder.addScalarType('DateTime', DateTimeResolver, {})
