import { makeSchema, objectType, queryType, intArg } from 'nexus';
import { protectGQLWithAuth } from '../access-control/index.mjs';
import prisma, { getImage } from '../db-client/index.mjs';

const schema = makeSchema({
  types: [
    objectType({
      name: 'User',
      definition(t) {
        t.string('email');
        t.string('id');
        t.string('name');
        t.string('role');
        t.field('profile', {
          type: 'Profile',
          resolve(root, args, ctx) {
            protectGQLWithAuth(ctx);
            return prisma.profile.findUnique({
              where: {
                id: root.id
              }
            });
          },
        });
      },
      resolve(root, args, ctx) {
        protectGQLWithAuth(ctx);
        return prisma.user.findUnique({
          where: {
            id: args.id
          }
        });
      },
    }),
    objectType({
      name: 'Profile',
      definition(t) {
        t.string('bio');
        t.string('id');
        t.string('imageId');
        t.field('user', {
          type: 'User',
          resolve(root, args, ctx) {
            protectGQLWithAuth(ctx);
            return prisma.user.findUnique({
              where: {
                id: root.userId
              }
            });
          },
        });
        t.field('image', {
          type: 'Image',
          resolve(root, args, ctx) {
            protectGQLWithAuth(ctx);
            return prisma.image.findUnique({
              where: {
                id: root.image.id
              }
            });
          },
        });
      },
      resolve(root, args, ctx) {
        protectGQLWithAuth(ctx);
        return prisma.user.findUnique({
          where: {
            id: args.id
          }
        });
      },
    }),
    objectType({
      name: 'Post',
      definition(t) {
        t.string('content');
        t.string('id');
        t.field('author', {
          type: 'User',
          resolve(root, args, ctx) {
            protectGQLWithAuth(ctx);
            return prisma.user.findUnique({
              where: {
                id: root.authorId
              }
            });
          },
        });
        t.list.field('images', {
          type: 'Image',
          resolve(root, args, ctx) {
            protectGQLWithAuth(ctx);
            return prisma.image.findMany({
              where: {
                postId: root.id
              }
            });
          },
        });
      },
      resolve(root, args, ctx) {
        protectGQLWithAuth(ctx);
        return prisma.post.findUnique({
          where: {
            id: args.id
          }
        });
      },
    }),
    objectType({
      name: 'Image',
      definition(t) {
        t.string('id');
        t.string('uuid');
        t.string('extension');
        t.field('href', {
          type: 'String',
          resolve(root, args, ctx) {
            protectGQLWithAuth(ctx);
            return getImage(`${root.uuid}.${root.extension}`);
          },
        })
        t.field('author', {
          type: 'User',
          resolve(root, args, ctx) {
            protectGQLWithAuth(ctx);
            return prisma.user.findUnique({
              where: {
                id: root.authorId
              }
            });
          },
        })
      },
      resolve(root, args, ctx) {
        protectGQLWithAuth(ctx);
        return prisma.post.findUnique({
          where: {
            id: args.id
          }
        });
      },
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
        t.field('currentProfile', {
          type: 'Profile',
          resolve: (root, args, ctx) => {
            protectGQLWithAuth(ctx);
            return prisma.profile.findUnique({ where: { id: ctx.user.id } });
          },
        });
        t.list.field('users', {
          type: 'User',
          async resolve(root, args, ctx) {
            protectGQLWithAuth(ctx);
            return await prisma.user.findMany();
          },
        });
        t.field('user', {
          type: 'User',
          args: {
            id: intArg(),
          },
          resolve: (root, args, ctx) => {
            protectGQLWithAuth(ctx);
            return prisma.user.findUnique({ where: { id: args.id } });
          },
        });
        t.field('profile', {
          type: 'Profile',
          args: {
            id: intArg(),
          },
          resolve: (root, args, ctx) => {
            protectGQLWithAuth(ctx);
            return prisma.profile.findUnique({ where: { id: args.id } });
          },
        });
        t.list.field('posts', {
          type: 'Post',
          resolve: (root, args, ctx) => {
            protectGQLWithAuth(ctx);
            return prisma.post.findMany();
          },
        });
        t.field('post', {
          type: 'Post',
          args: {
            id: intArg(),
          },
          resolve: (root, args, ctx) => {
            protectGQLWithAuth(ctx);
            return prisma.post.findUnique({ where: { id: args.id } });
          },
        });
      },
    }),
  ],
});

export default schema;
