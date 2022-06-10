import { v4 as uuidv4 } from 'uuid';
import multer from '@koa/multer';
import mime from 'mime-types';
import prisma, { getImage, putImage } from "../../db-client/index.mjs";

const uploadImages = multer();

export default [
  {
    path: '/posts',
    type: 'get',
    fn: async (ctx, next) => {
      const posts = await prisma.post.findMany({
        take: 10,
        include: {
          images: true
        },
        orderBy: [
          {
            createdAt: 'desc',
          },
        ],
      });

      const hydratedPosts = await Promise.all(posts.map(async (post) => {
        const hydratedImages = await Promise.all(post.images.map(async (image) => {
          return {
            url: await getImage(`${image.uuid}.${image.extension}`),
            id: image.uuid,
          };
        }));

        return {
          ...post,
          images: hydratedImages,
        };
      }));

      ctx.body = hydratedPosts;
    },
  },
  {
    path: '/posts/:id',
    type: 'get',
    fn: async (ctx, next) => {
      ctx.body = await prisma.post.findUnique({
        where: {
          id: parseInt(ctx.params.id, 10),
        }
      });
    },
  },
  {
    path: '/posts',
    type: 'upload',
    fn: [
      uploadImages.array('images', 6),
      async (ctx, next) => {
        const allowed = ctx.ac.can(ctx.user.role).createOwn('post').granted;

        if (allowed) {
          const newPost = await prisma.post.create({
            data: {
              authorId: ctx.user.id,
              content: ctx.request.body.content,
            }
          });

          const imageResults = await Promise.all(ctx.request.files.map(async (file) => {
            const imageUUID = uuidv4();
            const extension = mime.extension(file.mimetype);
            return {
              extension,
              imageUUID,
              putResult: await putImage(`${imageUUID}.${extension}`, file.buffer),
            };
          }));
          const images = await Promise.all(imageResults.map(async (image) => {
            return await prisma.image.create({
              data: {
                author: {
                  connect: { id: ctx.user.id },
                },
                extension: image.extension,
                post: {
                  connect: { id: newPost.id },
                },
                uuid: image.imageUUID,
              }
            });
          }));

          ctx.body = {
            post: newPost,
            images,
          };
        } else {
          ctx.unauthorized();
        }
      },
    ],
  },
];
