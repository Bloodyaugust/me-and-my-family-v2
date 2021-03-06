import Router from '@koa/router';
import { graphqlHTTP } from 'koa-graphql';
import userRoutes from './user/index.mjs';
import postRoutes from './post/index.mjs';
import loginRoutes from './login/index.mjs';
import imageRoutes from './images/index.mjs';
import profileRoutes from './profile/index.mjs';
import schema from '../graphql/index.mjs';

const router = new Router();
const allRoutes = [
  ...userRoutes,
  ...postRoutes,
  ...loginRoutes,
  ...imageRoutes,
  ...profileRoutes,
];

allRoutes.forEach(route => {
  switch (route.type) {
    case 'get':
      router.get(route.path, route.fn);
      break;

    case 'post':
      router.post(route.path, route.fn);
      break;

    case 'upload':
      router.post(route.path, route.fn[0], route.fn[1]);
      break;
  
    default:
      break;
  }
});

router.all('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));

export default router;
