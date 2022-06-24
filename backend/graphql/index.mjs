import { makeSchema, objectType, queryType, intArg } from 'nexus';
import { protectGQLWithAuth } from '../access-control/index.mjs';
import prisma from '../db-client/index.mjs';

const schema = makeSchema({
  types: [
    objectType({
      name: 'User',
      definition(t) {
        t.string('email');
        t.string('id');
        t.string('name');
        t.string('role');
      },
    }),
    objectType({
      name: 'Post',
      definition(t) {
        t.string('content');
        t.string('id');
        t.field('author', {
          type: 'User',
          resolve(root, args) {
            return prisma.user.findUnique({
              where: {
                id: root.authorId
              }
            })
          }
        })
      },
      resolve(root, args) {
        return prisma.post.findUnique({
          where: {
            id: args.id
          }
        })
      }
    }),
    queryType({
      definition(t) {
        t.field('currentUser', {
          type: 'User',
          resolve: (root, args, ctx) => {
            protectGQLWithAuth(ctx);
            return ctx.user;
          },
        });
        t.list.field('users', {
          type: 'User',
          async resolve() {
            return await prisma.user.findMany();
          },
        });
        t.field('user', {
          type: 'User',
          args: {
            id: intArg(),
          },
          resolve: (root, args) => prisma.user.findUnique({ where: { id: args.id } })
        });
        t.list.field('posts', {
          type: 'Post',
          resolve: () => prisma.post.findMany(),
        });
        t.field('post', {
          type: 'Post',
          args: {
            id: intArg(),
          },
          resolve: (root, args) => prisma.post.findUnique({ where: { id: args.id } })
        });
      },
    }),
  ],
});

export default schema;
