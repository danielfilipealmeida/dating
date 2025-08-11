import SchemaBuilder from '@pothos/core'
import PrismaPlugin from '@pothos/plugin-prisma'
import type PrismaTypes from '@pothos/plugin-prisma/generated'
import { DateTimeResolver } from 'graphql-scalars'
import { prisma } from './db'
import ScopeAuthPlugin from '@pothos/plugin-scope-auth';
import { checkAuthTokenForSuperuser, getTokenData } from './jwt'
import { TokenDataType } from './schema/user'


export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes
  Context: {
    userId: number|null
  }
  AuthScopes: {
    public: boolean,
    isAuthenticated: boolean,
    superuser: boolean
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
      const {userId} = getTokenData(context) as TokenDataType
      const isSuperUser = checkAuthTokenForSuperuser(context)
      return {
        public: true,
        isAuthenticated: !!userId || isSuperUser,
        superuser: isSuperUser
      }
    }
  }
})

builder.queryType({})
builder.mutationType({})

builder.addScalarType('DateTime', DateTimeResolver, {})
