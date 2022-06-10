import { PrismaClient } from '@prisma/client';
import Minio from 'minio';
import { readFile } from 'fs';

const prisma = new PrismaClient();
export const minio = new Minio.Client({
  endPoint: 'localhost',
  port: 9000,
  useSSL: false,
  accessKey: 'minioadmin',
  secretKey: 'minioadmin',
});

export async function getImage(image) {
  return new Promise((resolve, reject) => {
    minio.presignedGetObject('images', image, (error, result) => {
      if (error) {
        reject(error);
      }

      resolve(result);
    });
  });
}

export async function putImage(filename, imageStream) {
  return new Promise((resolve, reject) => {
    minio.putObject('images', filename, imageStream, (error, result) => {
      if (error) {
        reject(error);
      }

      resolve(result);
    });
  });
}

export default prisma;
