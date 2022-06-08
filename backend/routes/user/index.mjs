import prisma from "../../db-client/index.mjs";

export default [
  {
    path: '/users',
    type: 'get',
    fn: async (ctx, next) => {
      ctx.body = await prisma.user.findMany();
    },
  },
  {
    path: '/users/:id',
    type: 'get',
    fn: async (ctx, next) => {
      ctx.body = await prisma.user.findUnique({
        where: {
          id: parseInt(ctx.params.id, 10)
        }
      });
    },
  },
];