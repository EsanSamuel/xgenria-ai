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
import { FcGoogle } from "react-icons/fc";
import { setConfig } from "next/config";

const AuthProvider = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [inputType, setInputType] = React.useState<string>("password");
  const { data: session, status } = useSession();
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
    defaultValues: {
      email: "",
      password: "",
    },
  });

  if (status === "authenticated") redirect("/documents");

  if (isLoading) {
    toast.loading("Signing in...");
  }

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

  const showPassword = () => {
    if (inputType === "text") {
      setInputType("password");
    } else {
      setInputType("text");
    }
  };

  return (
    <div>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-full lg:w-2/6 my-6 mx-auto lg:max-w-3xl h-full lg:h-auto">
          <div className="flex justify-center items-center h-full sm:flex p-3">
            <div className="w-full lg:h-auto border-0 rounded-lg relative flex flex-col gap-6 h-auto  p-10 bg-dark-1  text-white shadow-lg outline-none focus:outline-none">
              <form
                onSubmit={handleSubmit(handleSignin)}
                className="flex flex-col gap-6"
              >
                <h1 className="text-center text-[20px] font-bold">Login</h1>

                <Input
                  className="flex-grow border w-full border-blue-1 rounded-[10px] outline-none p-4 bg-dark-1"
                  {...register("email")}
                  placeholder="Enter Email"
                  type="email"
                />
                <div>
                  <Input
                    className="flex-grow border w-full border-blue-1 rounded-[10px] outline-none p-4 bg-dark-1"
                    type={inputType}
                    {...register("password")}
                    placeholder="Enter Password"
                  />
                  <div className="flex gap-3 mt-2 items-center">
                    <Input
                      type="checkbox"
                      onClick={showPassword}
                      className="h-[15px] w-[15px]"
                    />
                    <p className="text-[12px]">Show Password</p>
                  </div>
                </div>
                <button
                  className="px-4 py-2 bg-blue-1 rounded-full w-full hover:bg-opacity-50"
                  type="submit"
                >
                  {!isLoading ? "Log In" : "Loging in..."}
                </button>
              </form>
              <button
                className="px-4 py-2 border border-blue-1 rounded-full w-full hover:bg-opacity-50 flex gap-5 items-center justify-center"
                type="submit"
                onClick={() => signIn("google")}
              >
                <FcGoogle size={20} />
                Continue with Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthProvider;
