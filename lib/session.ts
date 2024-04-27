import { AuthOptions, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/prisma/prismadb";
import { AdapterUser } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("No credentials avaliable!");
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials?.email,
          },
        });

        if (!user || !user?.password) {
          console.log("User does not exist!");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials?.password!,
          user?.password!
        );
        if (!isCorrectPassword) {
          console.log("Invalid password");
          return null;
        }

        return user;
      },
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
            data: {
              username: user.name,
              email: user.email,
              image: user.image,
            },
          });
        }

        console.log("signed in successfully!");
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  },
  theme: {
    colorScheme: "dark",
  },
};
