import Router from '@koa/router';
import userRoutes from './user/index.mjs';
import postRoutes from './post/index.mjs';
import loginRoutes from './login/index.mjs';

const router = new Router();
const allRoutes = [
  ...userRoutes,
  ...postRoutes,
  ...loginRoutes,
];

allRoutes.forEach(route => {
  switch (route.type) {
    case 'get':
      router.get(route.path, route.fn);
      break;

    case 'post':
      router.post(route.path, route.fn);
      break;
  
    default:
      break;
  }
});

export default router;
