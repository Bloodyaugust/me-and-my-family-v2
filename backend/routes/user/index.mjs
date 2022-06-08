import prisma from "../../db-client/index.mjs";

export default [
  {
    path: '/',
    type: 'get',
    fn: async (ctx, next) => {
      ctx.body = JSON.stringify(await prisma.user.findMany());
    }
  }
];
