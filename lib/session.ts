import { AuthOptions, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/prisma/prismadb";
import { AdapterUser } from "next-auth/adapters";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session }) {
      const user = await prisma.user.findUnique({
        where: {
          email: session.user.email,
        },
      });
      if (user) {
        session.user.id = user.id.toString();
      }
      return session;
    },
    async signIn({ user }: { user: User | AdapterUser }): Promise<boolean> {
      try {
        const userExists = await prisma.user.findUnique({
          where: {
            email: user.email!,
          },
        });

        if (!userExists) {
          await prisma.user.create({
            data : {
              username: user.name,
              email: user.email,
              image: user.image,
            }
          });
        }

        console.log("signed in successfully!")
        return true;
      } catch (error) {
        console.log(error);
        return false;
        
      }
    },
  },
};
