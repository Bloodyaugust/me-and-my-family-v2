import { v4 as uuidv4 } from 'uuid';
import multer from '@koa/multer';
import mime from 'mime-types';
import prisma, { getImage, putImage } from "../../db-client/index.mjs";

const uploadImages = multer();

export default [
  {
    path: '/images/:id',
    type: 'get',
    fn: async (ctx, next) => {
      ctx.body = await getImage(ctx.params.id);
    },
  },
  {
    path: '/images',
    type: 'upload',
    fn: [
      uploadImages.array('images', 6),
      async (ctx, next) => {
        const allowed = ctx.ac.can(ctx.user.role).createOwn('image').granted;

        if (allowed) {
          const imageResults = await Promise.all(ctx.request.files.map(async (file) => {
            const extension = mime.extension(file.mimetype);
            const imageUUID = uuidv4();
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
                uuid: image.imageUUID,
              }
            });
          }));

          ctx.body = images;
        } else {
          ctx.unauthorized();
        }
      },
    ],
  },
];
