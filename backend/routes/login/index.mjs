import { randomBytes } from 'crypto';
import nodemailer from 'nodemailer';
import prisma from "../../db-client/index.mjs";

const transporter = nodemailer.createTransport(process.env.EMAIL_SERVER);

export default [
  {
    path: '/login',
    type: 'get',
    fn: async (ctx, next) => {
      const email = ctx.request.query.email;

      ctx.ok({ message: 'If that email has an account with this Family, it should receive a sign-in link soon' });

      if (email) {
        const user = await prisma.user.findUnique({ where: { email: email } });

        if (user) {
          try {
            await prisma.session.delete({ where: { userId: user.id } });
          } catch {};
          const session = await prisma.session.create({ data: {
            userId: user.id,
            token: `${randomBytes(256).toString('hex')}`,
          } });
          transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: 'Me and My Family Sign-In Link',
            text: `Here's your sign-in link! ${session.token}`,
            html: `<p>Here's your sign-in link! <a href="http://localhost:3004/login?token=${session.token}">Sign In</a></p>`
          });
        }
      }
    },
  },
];
