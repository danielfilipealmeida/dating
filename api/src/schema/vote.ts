import { builder } from '../builder'
import { prisma } from '../db'
import { getUserIdFromToken } from '../lib'

builder.prismaObject('Vote', {
    fields: (t) => ({
        id: t.exposeID('id'),
        voterId: t.exposeString('voterId'),
        votedForId: t.exposeString('votedForId'),
        like: t.exposeBoolean('like')
    }),
});

builder.mutationFields((t) => ({
    vote: t.prismaField({
        type: 'Vote',
        authScopes: {
            isAuthenticated: true
        },
        args: {
            votedId: t.arg.string({ required: true }),
            votedForId: t.arg.string({ required: true }),
            like: t.arg.boolean({ required: true }),
        },
        resolve: async (query, root, args, context) => {
            const { votedId, votedForId, like } = args;
            const userId: string = getUserIdFromToken(context);
            if (!userId) {
                throw new Error("User not authenticated");
            }

            // confirm that tue user isn't trying to vote as another user
            if (userId !== votedId) {
                throw new Error("You can only vote as yourself.");
            }
            
            // Check if the user is trying to vote for themselves
            if (userId == votedForId) {
                throw new Error("You cannot vote for yourself.")
            }

            if (await prisma.vote.findFirst({
                where: {
                    voterId: userId,
                    votedForId: votedForId,
                },
            })) {
                throw new Error("You have already voted for this user.");
            }

            return prisma.vote.create({
                data: {
                    voterId: userId,
                    votedForId: votedForId,
                    like: like,
                },
                ...query,
            });
        }
    }),
}));
