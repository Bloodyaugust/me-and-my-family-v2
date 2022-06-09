import prisma from "../../db-client/index.mjs";

export default [
  {
    path: '/posts',
    type: 'get',
    fn: async (ctx, next) => {
      ctx.body = await prisma.post.findMany({
        take: 10,
        orderBy: [
          {
            createdAt: 'desc',
          },
        ],
      });
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
      const allowed = ctx.ac.can(ctx.user.role).createOwn('post').granted;

      if (allowed) {
        const newPost = await prisma.post.create({
          data: {
            authorId: (await prisma.user.findMany({ take: 1 }))[0].id,
            content: ctx.request.body.content,
          }
        });
  
        ctx.body = newPost;
      } else {
        ctx.unauthorized();
      }
    },
  },
];
