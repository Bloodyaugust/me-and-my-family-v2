import 'dotenv/config';
import router from './routes/index.mjs';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import koaRespond from 'koa-respond';
import prisma from './db-client/index.mjs';
import { useAccessControl, useSessionToken, useUserContext } from './access-control/index.mjs';

const app = new Koa();

app
  .use(koaRespond())
  .use(bodyParser())
  .use(useSessionToken)
  .use(useUserContext)
  .use(useAccessControl)
  .use(router.routes())
  .use(router.allowedMethods());

const server = app.listen(process.env.API_PORT);
console.log(`API started on port: ${process.env.API_PORT}`);

async function beforeExit() {
  console.log('Closing server');
  await server.close();
  await prisma.$disconnect();
  console.log('Closed server');
  process.exit();
}
process.on('SIGUSR2', beforeExit);
