import { v4 as uuidv4 } from 'uuid';
import multer from '@koa/multer';
import mime from 'mime-types';
import prisma, { getImage, putImage } from "../../db-client/index.mjs";

const uploadImages = multer();

export default [
  {
    path: '/profiles/current',
    type: 'get',
    fn: async (ctx, next) => {
      if (ctx.user) {
        ctx.body = await prisma.profile.findUnique({
          where: {
            id: ctx.user.id,
          },
        });
      } else {
        ctx.unauthorized();
      }
    },
  },
  {
    path: '/profiles/current',
    type: 'upload',
    fn: [
      uploadImages.single('image'),
      async (ctx, next) => {
        const allowed = ctx.ac.can(ctx.user.role).updateOwn('profile').granted;

        if (allowed) {
          const profile = await prisma.profile.findUnique({
            where: {
              id: ctx.user.id,
            },
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
                profile: {
                  connect: { id: profile.id },
                },
                uuid: image.imageUUID,
              }
            });
          }));

          const updatedProfile = await prisma.profile.update({
            where: {
              id: profile.id,
            },
            data: {
              bio: ctx.request.body.bio,
              image: {
                connect: { id: images[0].id },
              },
            },
          });

          ctx.body = {
            profile: updatedProfile,
          };
        } else {
          ctx.unauthorized();
        }
      },
    ],
  },
  {
    path: '/profiles/:id',
    type: 'get',
    fn: async (ctx, next) => {
      ctx.body = await prisma.profile.findUnique({
        where: {
          id: parseInt(ctx.params.id, 10)
        }
      });
    },
  },
];
