"use client";
import { getProviders, signIn, useSession } from "next-auth/react";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";

const AuthProvider = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { data: session } = useSession();
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  type TSchema = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TSchema>({
    resolver: zodResolver(schema),
  });

  if (session?.user) redirect("/documents");

  async function handleSignin({ email, password }: TSchema) {
    setIsLoading(true);
    if (isLoading) {
      toast.loading("Signing in...");
    }
    try {
      await signIn("credentials", {
        email,
        password,
      });
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-full lg:w-2/6 my-6 mx-auto lg:max-w-3xl h-full lg:h-auto">
          <form
            onSubmit={handleSubmit(handleSignin)}
            className="w-full lg:h-auto border-0 rounded-lg relative flex flex-col gap-6 h-auto  p-10 bg-dark-1  text-white shadow-lg outline-none focus:outline-none"
          >
            <h1 className="text-center text-[20px] font-bold">Login</h1>

            <Input
              className="flex-grow border w-full border-blue-1 rounded-[10px] outline-none p-4 bg-dark-1"
              {...register("email")}
              placeholder="Enter Email"
            />
            <Input
              className="flex-grow border w-full border-blue-1 rounded-[10px] outline-none p-4 bg-dark-1"
              type="password "
              {...register("password")}
              placeholder="Enter Password"
            />
            <button
              className="px-4 py-2 bg-blue-1 rounded-full w-full hover:bg-opacity-50"
              type="submit"
            >
              Sign In
            </button>

            <button
              className="px-4 py-2 border border-blue-1 rounded-full w-full hover:bg-opacity-50"
              type="submit"
              onClick={() => signIn("google")}
            >
              Continue with Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthProvider;
