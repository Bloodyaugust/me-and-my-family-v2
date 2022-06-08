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
          id: parseInt(ctx.params.id, 10),
        }
      });
    },
  },
  {
    path: '/posts',
    type: 'post',
    fn: async (ctx, next) => {
      const newPost = await prisma.post.create({
        data: {
          authorId: (await prisma.user.findMany({ take: 1 }))[0].id,
          content: ctx.request.body.content,
        }
      });

      ctx.body = newPost;
    },
  },
];
