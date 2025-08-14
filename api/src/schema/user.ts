import assert = require('node:assert');
import { $Enums } from '@prisma/client';
import { builder } from '../builder'
import { prisma } from '../db'
import { checkAuthTokenForSuperuser, getTokenData, getTokenFromAuthorizationHeader, generateToken } from '../jwt';
import { hashString } from '../lib'
import { getFileLocalPath } from './uploads'
import fs from 'node:fs';

interface UserPreferences {
  distance: number;
  sex: string[];
}

export interface TokenDataType {
  userId: number | string;
  email: string;
  isSuperuser: boolean;
}


export enum Sex {
  MALE,
  FEMALE
}

builder.enumType(Sex, {
  name: 'Sex'
})

const UserPreferencesInput = builder.inputType('UserPreferences', {
  fields: (t) => ({
    distance: t.int(),
    sex: t.stringList()
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
    distance: t.int({
      resolve: (parent) => parent.distance
    }),
    sex: t.stringList({
      resolve: (parent) => parent.sex
    })
  }),
})

const UserType = builder.prismaObject('User', {
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name', { nullable: true }),
    email: t.exposeString('email'),
    bio: t.exposeString('bio'),
    sex: t.exposeString('sex'),
    preferences: t.field({
      type: UserPreferencesOutput,
      resolve: (data) => {
        const preferences: UserPreferences = (data.preferences) as unknown as UserPreferences;
        return new UserPreferencesOutput(preferences?.distance, preferences?.sex)
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
      type: UserPreferencesInput,
      required: true
    })
  })
})

// Define the Vote input type
const VoteInput = builder.inputType('VoteInput', {
  fields: (t) => ({
    voterId: t.id({ required: true }),
    votedForId: t.id({ required: true }),
    like: t.boolean({ required: true })
  })
})

builder.queryFields((t) => ({
  authenticate: t.field({
    type: "String",
    args: {
      email: t.arg.string(),
      password: t.arg.string()
    },
    resolve: async (parent, args) => {
      try {
        const hashedPassword = hashString(String(args.password))
        const data = await prisma.user.findUnique({
          where: {
            email: String(args.email),
            password: hashedPassword
          }
        })
        if (!data) {
          throw new Error("Authentication failed")
        }

         return generateToken({userId: data.id})
      }
      catch (err: any) {
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
      token: t.arg.string({}),
      id: t.arg.id({required: true}),
    },
    resolve: async (parent, args, context) => {
      const {userId}: TokenDataType = getTokenData(context) as TokenDataType;

      assert.equal(parseInt(userId as string), parseInt(args.id))
      assert.equal(args.token, getTokenFromAuthorizationHeader(context)!.split(" ")[1])

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
      id: t.arg.id({ required: true })
    },
    resolve: async (query, root, args, context) => {
      const result = await prisma.user.findFirst({
         where: { id: args.id } ,
         include: {
          pictures: true
         }
        })
      return result
    }
  }),
  people: t.prismaField({
    type: [UserType],
    authScopes: {
      isAuthenticated: true,
      superuser: true
    },
    args: {
      id: t.arg.id({ required: true }),
      radius: t.arg.int({ required: true })
    },
    resolve: async (query, root, args, context) => {
      if (!checkAuthTokenForSuperuser(context)) {
        const {userId} : TokenDataType = getTokenData(context) as TokenDataType
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
      const radius = args.radius / 111
      const result = await prisma.$queryRaw`WITH user_geom AS (
            SELECT coords
            FROM "User"
            WHERE id = ${parseInt(args.id)}
        )
        SELECT 
          u2.id,
          u2.name,
          u2.bio,
          u2.email,
          u2.sex,
          u2.preferences
        FROM user_geom, "User" AS u2
        WHERE ST_DWithin(user_geom.coords, u2.coords, ${radius}) and id != ${parseInt(args.id)} 
        ORDER BY RANDOM()
        LIMIT ${parseInt(process.env.MAX_PEOPLE_PER_SEARCH || "100")};`

      return result as any
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
      const hashedPassword = hashString(args.data.password || "")
      return prisma.user.create({
        ...query,
        data: { 
          email: args.data.email,
          password: hashedPassword,
          sex: args.data.sex as $Enums.Sex,
        },
      });
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

      return prisma.user.findUnique({ where: { id: args.data.id } })
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
      const updateResult = await prisma.user.update({
        where: {
          id: args.data.id
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
      userId: t.arg.id({ required: true }),
      url: t.arg.string({ required: true }),
      path: t.arg.string({ required: true })
    },
    resolve: async (query, parent, args) => {
      // check if the user has less than the max number of allowed files
      const user = await prisma.user.findFirstOrThrow({
        where: {
          id: args.userId
        },
        include: {
          pictures: true
        }
      })
      if (user.pictures.length >= parseInt(process.env.MAX_PICTURES_PER_USER || "1")) {
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
          userId: args.userId,
          path: args.path
        }
      })
    }
  }),
  removeUserFile: t.field({
    type: 'Boolean',
    args: {
      userId: t.arg.id({ required: true }),
      id: t.arg.id({ required: true })
    },
    resolve: async (parent, args) => {
      try {
            
        // then, if it did not fail, delete the record
        const deletedFileRecord = await prisma.file.delete({
          where: {
            id: args.id,
            userId: args.userId
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
          deletedFileRecord.userId == args.userId &&
          deletedFileRecord.id == args.id
      }
      catch (err: any) {
        console.error(err.message)
        return false
      }
    }
  }),
}))
