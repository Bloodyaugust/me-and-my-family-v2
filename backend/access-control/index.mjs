import { AccessControl } from "accesscontrol";
import prisma from "../db-client/index.mjs";

const ac = new AccessControl();

ac.grant('user')
    .createOwn('post')
    .deleteOwn('post')
    .updateOwn('post')
    .readAny('post')
    .createOwn('image')
    .deleteOwn('image')
    .updateOwn('image')
    .readAny('image')
  .grant('admin')
    .extend('user')
    .deleteAny('post')
    .deleteAny('image')

export async function useAccessControl(ctx, next) {
  ctx.ac = ac;
  await next();
}

export async function useSessionToken(ctx, next) {
  const bearerToken = ctx.get('Authorization');

  if (bearerToken) {
    ctx.session = await prisma.session.findFirst({ where: { token: bearerToken.split('Bearer ')[1] } });
  }

  await next();
}

export async function useUserContext(ctx, next) {
  if (ctx.session) {
    ctx.user = await prisma.user.findUnique({ where: { id: ctx.session.userId } });
  }

  await next();
}
