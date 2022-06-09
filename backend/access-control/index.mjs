import { AccessControl } from "accesscontrol";
import prisma from "../db-client/index.mjs";

const ac = new AccessControl();

ac.grant('user')
    .createOwn('post')
    .deleteOwn('post')
    .updateOwn('post')
    .readAny('post')
  .grant('admin')
    .extend('user')
    .deleteAny('post')

export async function useAccessControl(ctx, next) {
  ctx.ac = ac;
  await next();
}

export async function useUserContext(ctx, next) {
  const user = await prisma.user.findUnique({ where: { id: ctx.request.body.user.id } });

  ctx.user = user;
  await next();
}
