import Router from '@koa/router';
import userRoutes from './user/index.mjs';

const router = new Router();

userRoutes.forEach(route => {
  switch (route.type) {
    case 'get':
      router.get(route.path, route.fn);
      break;
  
    default:
      break;
  }
});

export default router;
