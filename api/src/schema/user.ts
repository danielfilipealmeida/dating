import { QueryFieldBuilder } from '@pothos/core'
import { builder } from '../builder'
import { prisma } from '../db'
import { hashString } from '../lib'

export enum Sex {
  MALE,
  FEMALE
}

builder.enumType(Sex, {
  name: 'Sex'
})

builder.inputType('UserPreferences', {
  fields: (t) => ({
    distance: t.int({required: true}),
    sex: t.stringList({required: true})
  })
})

class UserPreferencesOutput {
  distance: number;
  sex: string[];

  constructor(distance: number, sex:string[]) {
    this.distance = distance || 20;
    this.sex = sex || [];
  }
}
  
builder.objectType(UserPreferencesOutput, {
  name: 'UserPreferencesOutput',
  description: "the configuration of the search of a user",
  fields: (t) => ({
    distance: t.int({required: true}),
    sex: t.stringList({required: true})
  }),
})

builder.prismaObject('User', {
  fields: (t) => ({
    id: t.exposeInt('id'),
    name: t.exposeString('name', { nullable: true }),
    email: t.exposeString('email'),
    bio: t.exposeString('bio'),
    sex: t.exposeString('sex'),
    preferences: t.field({
      type: 'UserPreferencesOutput',
      resolve: (data) => {
        return new UserPreferencesOutput(data.preferences.distance || 20 , data.preferences.sex)
        return data
      }
    }),
    pictures: t.relation('pictures')
  }),
})

builder.prismaObject('File', {
  fields: (t) => ({
    id: t.exposeID('id'),
    path: t.exposeString('path'),
    user: t.relation('user')
  })
})

export const UserUniqueInput = builder.inputType('UserUniqueInput', {
  fields: (t) => ({
    id: t.int(),
    email: t.string(),
  }),
})

const UserCreateInput = builder.inputType('UserCreateInput', {
  fields: (t) => ({
    email: t.string({ required: true }),
    password: t.string(),
    sex: t.string()
  }),
})

const SetUserLocationInput = builder.inputType('SetUserLocationInput', {
  fields: (t) => ({
    id: t.string({ required: true }),
    latitude: t.float({ required: true }),
    longitude: t.float({ required: true }),
  }),
})

const SetUserDataInput = builder.inputType('SetUserDataInput', {
  fields: (t) => ({
    id: t.id({ required: true }),
    bio: t.string({ required: true }),
    name: t.string({ required: true }),
    preferences: t.field({
      type: 'UserPreferences',
      required: true
    })
  })
})

const AuthenticationResponse = builder.objectRef<{
  success: boolean,
  id?: number,
  message?: string
}>('AuthenticationResponse')
AuthenticationResponse.implement({
  fields: (t) => ({
    success: t.exposeBoolean('success'), 
    id: t.exposeID('id'),
    message: t.exposeString('message'),
  })
})

builder.queryFields((t) => ({
  authenticate: t.field({
    type: AuthenticationResponse,
    args: {
      email: t.string({required: true}),
      password: t.string({required: true})
    },
    resolve: async (parent, args) => {
      try {
        const hashedPassword = hashString(args.password)
        const data = await prisma.user.findUnique({where:{
          email: args.email,
          password: hashedPassword
        }})
        if (!data) {
          throw new Error("Authentication failed")
        }
        return {
          success: true,
          id: data.id,
          message: "Successful Authentication"
        }
      }
      catch (err) {
        return {
          success: false,
          message: err.message
        }
      }
    }
  }),
  allUsers: t.prismaField({
    type: ['User'],
    resolve: (query) => prisma.user.findMany({ ...query }),
  }),
  user: t.prismaField({
    type: "User",
    args: {
      id: t.id({required: true})
    },
    resolve: async (query, root, args, ctx) => {
      const result = await prisma.user.findFirst({ where: { id: parseInt(args.id)}})
      return result
    }
  }),
  people: t.prismaField({
    type: ['User'],
    args: {
      id: t.id({required: true}),
      radius: t.int({required: true})
    },
    resolve: async (query, root, args, ctx) => {
      /*
      Todo:
      - create a table with a list of possible connections
      - return always that table when some of the connections haven't been voted
      - when the table is empty, generate a new set of records using the existing query
      */
      const radius = parseFloat(args.radius) / 111
      const result = await prisma.$queryRaw`WITH user_geom AS (
            SELECT coords
            FROM "User"
            WHERE id = ${parseInt(args.id)}
        )
        SELECT 
          u2.id,
          u2.name,
          u2.bio
        FROM user_geom, "User" AS u2
        WHERE ST_DWithin(user_geom.coords, u2.coords, ${radius}) and id != ${parseInt(args.id)} 
        ORDER BY RANDOM()
        LIMIT ${parseInt(process.env.MAX_PEOPLE_PER_SEARCH)};`

      return result
    }
  })
}))

builder.mutationFields((t) => ({
  signupUser: t.prismaField({
    type: 'User',
    args: {
      data: t.arg({
        type: UserCreateInput,
        required: true,
      }),
    },
    resolve: (query, parent, args) => {
      const hashedPassword = hashString(args.data.password)
      return prisma.user.create({
        ...query,
        data: {
          email: args.data.email,
          password: hashedPassword,
          sex: args.data.sex
        },
      })
    },
  }),
  setUserLocation: t.prismaField({
    type: 'User',
    args: {
      data: t.arg({
        type: SetUserLocationInput,
        required: true,
      }),
    },
    resolve: async (query, parent, args) => {
      const updateResult = await prisma.$executeRaw`UPDATE "User" SET coords=ST_SetSRID(ST_MakePoint(${args.data.longitude}, ${args.data.latitude}), 4326) WHERE id = ${args.data.id}::int`

      return prisma.user.findUnique({where: {id: parseInt(args.data.id)}})
    },
  }),
  setUserData: t.prismaField({
    type: 'User',
    args: {
      data: t.arg({
        type: SetUserDataInput,
        required: true
      }),
    },
    resolve: async (query, parent, args) => {
      const updateResult = prisma.user.update({
        where: {
          id: parseInt(args.data.id)
        },
        data: {
          bio: args.data.bio,
          name: args.data.name,
          preferences: {
            sex: args.data?.preferences?.sex || [],
            distance: args.data?.preferences?.distance || 20
          }
        }
      })

      return updateResult
    }
  }),
  addFile: t.prismaField({
    type: "File",
    args: {
      userId: t.id({required: true}),
      url: t.string({required: true}),
      path: t.string({requierd: true})
    },
    resolve: async (query, parent,args) => {
      // check if the user has less than the max number of allowed files
      const user = await prisma.user.findFirstOrThrow({
        where: {
          id:  parseInt(args.userId)
        },
        include: {
          pictures: true
        }
      })
      if (user.pictures.length >= process.env.MAX_PICTURES_PER_USER) {
        throw new Error("User already uploaded allowed all pictures")
      }

      return prisma.file.create({
        ...query,
        data: {
          userId: parseInt(args.userId),
          path: args.path
        }
      })   
    }
  })
}))
