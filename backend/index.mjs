import 'dotenv/config';
import router from './routes/index.mjs';
import Koa from 'koa';

const app = new Koa();

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(process.env.API_PORT);
console.log(`API started on port: ${process.env.API_PORT}`)
