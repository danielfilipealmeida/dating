import { builder } from '../builder'
import { prisma } from '../db'

builder.prismaObject('User', {
  fields: (t) => ({
    id: t.exposeInt('id'),
    name: t.exposeString('name', { nullable: true }),
    email: t.exposeString('email'),
    bio: t.exposeString('bio')
  }),
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
    name: t.string(),
  }),
})

const SetUserLocationInput = builder.inputType('SetUserLocationInput', {
  fields: (t) => ({
    id: t.id({ required: true }),
    latitude: t.float({ required: true }),
    longitude: t.float({ required: true }),
  }),
})

const setUserDataInput = builder.inputType('setUserDataInput', {
  fields: (t) => ({
    id: t.id({ required: true }),
    bio: t.string({ required: true })
  })
})

builder.queryFields((t) => ({
  allUsers: t.prismaField({
    type: ['User'],
    resolve: (query) => prisma.user.findMany({ ...query }),
  }),
  user: t.prismaField({
    type: "User",
    args: {
      id: t.id({required: true})
    },
    resolve: (query, root, args, ctx) => {
      return prisma.user.findFirst({ where: { id: parseInt(args.id)}})
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
      return prisma.user.create({
        ...query,
        data: {
          email: args.data.email,
          name: args.data.name,
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
        type: setUserDataInput,
        required: true
      }),
    },
    resolve: async (query, parent, args) => {
      const updateResult = await prisma.user.update({
        where: {
          id: args.data.id
        },
        data: {
          bio: args.data.bio
        }
      })
      return prisma.user.findUnique({where: {id: parseInt(args.data.id)}})
    }
  })
}))

/*
TODO:
- setUserData - sets all profile fields besides the coordinates

*/
