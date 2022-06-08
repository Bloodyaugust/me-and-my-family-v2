import prisma from "../../db-client/index.mjs";

export default [
  {
    path: '/posts',
    type: 'get',
    fn: async (ctx, next) => {
      ctx.body = await prisma.post.findMany();
    },
  },
  {
    path: '/posts/:id',
    type: 'get',
    fn: async (ctx, next) => {
      ctx.body = await prisma.post.findUnique({
        where: {
          id: parseInt(ctx.params.id, 10)
        }
      });
    },
  },
];
