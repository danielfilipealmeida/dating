const assert = require('node:assert').strict;
import { builder } from '../builder'
import { prisma } from '../db'
import { checkAuthTokenForSuperuser, getTokenData, getTokenFromAuthorizationHeader, generateToken } from '../jwt';
import { hashString } from '../lib'
import { getFileLocalPath } from './uploads'
const fs = require('node:fs');

export enum Sex {
  MALE,
  FEMALE
}

builder.enumType(Sex, {
  name: 'Sex'
})

builder.inputType('UserPreferences', {
  fields: (t) => ({
    distance: t.int({ required: true }),
    sex: t.stringList({ required: true })
  })
})

class UserPreferencesOutput {
  distance: number;
  sex: string[];

  constructor(distance: number, sex: string[]) {
    this.distance = distance || 20;
    this.sex = sex || [];
  }
}

builder.objectType(UserPreferencesOutput, {
  name: 'UserPreferencesOutput',
  description: "the configuration of the search of a user",
  fields: (t) => ({
    distance: t.int({ required: true }),
    sex: t.stringList({ required: true })
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
        return new UserPreferencesOutput(data.preferences?.distance, data.preferences?.sex)
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

builder.queryFields((t) => ({
  authenticate: t.field({
    type: "String",
    args: {
      email: t.string({ required: true }),
      password: t.string({ required: true })
    },
    resolve: async (parent, args) => {
      try {
        const hashedPassword = hashString(args.password)
        const data = await prisma.user.findUnique({
          where: {
            email: args.email,
            password: hashedPassword
          }
        })
        if (!data) {
          throw new Error("Authentication failed")
        }

         return generateToken({userId: data.id})
      }
      catch (err) {
        console.error(err.message)
        throw new Error("Authentication failed")
      }
    }
  }),
  refreshToken: t.field({
    type: "String",
    authScopes: {
      isAuthenticated: true,
    },
    args: {
      token: t.string({required: true}),
      id: t.id({required: true}),
    },
    resolve: async (parent, args, context) => {
      const {userId} = getTokenData(context)

      assert.equal(parseInt(userId), parseInt(args.id))
      assert.equal(args.token, getTokenFromAuthorizationHeader(context).split(" ")[1])

      return generateToken({userId: args.id})
    }
  }),
  allUsers: t.prismaField({
    type: ['User'],
    authScopes: {
      superuser: true
    },
    resolve: (query) => prisma.user.findMany({ ...query }),
  }),
  user: t.prismaField({
    type: "User",
    authScopes: {
      isAuthenticated: true,
      superuser: true
    },
    args: {
      id: t.id({ required: true })
    },
    resolve: async (query, root, args, context) => {
      const result = await prisma.user.findFirst({
         where: { id: parseInt(args.id) } ,
         include: {
          pictures: true
         }
        })
      return result
    }
  }),
  people: t.prismaField({
    type: ['User'],
    authScopes: {
      isAuthenticated: true,
      superuser: true
    },
    args: {
      id: t.id({ required: true }),
      radius: t.int({ required: true })
    },
    resolve: async (query, root, args, context) => {
      if (!checkAuthTokenForSuperuser(context)) {
        const {userId} = getTokenData(context)
        if (userId!=args.id) {
          throw new Error('Access denied, cannot read information of another user')
        }
      }
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

      return prisma.user.findUnique({ where: { id: parseInt(args.data.id) } })
    },
  }),
  setUserData: t.prismaField({
    type: 'User',
    authScopes: {
      isAuthenticated: true,
      superuser: true
    },
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
      userId: t.id({ required: true }),
      url: t.string({ required: true }),
      path: t.string({ requierd: true })
    },
    resolve: async (query, parent, args) => {
      // check if the user has less than the max number of allowed files
      const user = await prisma.user.findFirstOrThrow({
        where: {
          id: parseInt(args.userId)
        },
        include: {
          pictures: true
        }
      })
      if (user.pictures.length >= process.env.MAX_PICTURES_PER_USER) {
        throw new Error("User already uploaded allowed all pictures")
      }

      // check if the file exists
      const storePath = getFileLocalPath(args.path)
      if (!fs.existsSync(storePath)) {
        throw new Error("File doesn't exists.")
      }
        
      return prisma.file.create({
        ...query,
        data: {
          userId: parseInt(args.userId),
          path: args.path
        }
      })
    }
  }),
  removeUserFile: t.field({
    type: 'Boolean',
    args: {
      userId: t.id({ required: true }),
      id: t.id({ required: true })
    },
    resolve: async (query, parent, args) => {
      try {
            
        // then, if it did not fail, delete the record
        const deletedFileRecord = await prisma.file.delete({
          where: {
            id: parseInt(args.params.variables.id),
            userId: parseInt(args.params.variables.userId)
          }
        })

        const storePath = getFileLocalPath(deletedFileRecord.path)
        await fs.unlink(storePath, (err) => {
          if (err) {
            console.error(err.message)
            return false
          }
        })
       
        return deletedFileRecord &&
          deletedFileRecord.userId == parseInt(args.params.variables.userId) &&
          deletedFileRecord.id == parseInt(args.params.variables.id)
      }
      catch (err) {
        console.error(err.message)
        return false
      }
    }
  })
}))
