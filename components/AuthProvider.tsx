"use client";
import { getProviders, signIn } from "next-auth/react";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type Provider = {
  id: string;
  name: string;
  type: string;
  signinUrl: string;
  callbackUrl: string;
  signinUrlParams?: Record<string, string> | undefined;
};

type Providers = Record<string, Provider>;

const AuthProvider = () => {
  const [providers, setProviders] = React.useState<Providers | null>(null);
  const [inputType, setInputType] = React.useState<string>("password");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const router = useRouter();
  React.useEffect(() => {
    const setupProvider = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    setupProvider();
  }, []);

  const schema = z.object({
    username: z.string(),
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

  async function handleSignin({ username, email, password }: TSchema) {
    try {
      setIsLoading(true);
      if (isLoading) {
        toast.loading("Signing in...");
      }
      const response = await axios.post("/api/user", {
        username,
        email,
        password,
      });

      console.log(response);

      await signIn("credentials", {
        email,
        password,
      });
      setIsLoading(false);
      toast.success("Signed in successfully!");
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
      {providers && (
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
          <div className="relative w-full lg:w-2/6 my-6 mx-auto lg:max-w-3xl h-full lg:h-auto">
            <div className="flex justify-center items-center h-full sm:flex p-3">
              <div className="w-full lg:h-auto border-0 rounded-lg relative flex flex-col gap-6 h-auto  md:p-10 p-5 bg-dark-1  text-white shadow-lg outline-none focus:outline-none">
                <form
                  onSubmit={handleSubmit(handleSignin)}
                  className="flex flex-col gap-6"
                >
                  <h1 className="text-center text-[20px] font-bold">
                    Create an Account
                  </h1>
                  <label>
                    <p className="text-[13px] pb-1">Enter Username</p>
                    <Input
                      className="flex-grow border-none w-full  rounded-full outline-none p-4 bg-dark-2"
                      placeholder="Enter Username"
                      {...register("username")}
                    />
                  </label>
                  <label>
                    <p className="text-[13px] pb-1">Enter Email</p>
                    <Input
                      className="flex-grow border-none w-full rounded-full outline-none p-4 bg-dark-2"
                      {...register("email")}
                      placeholder="Enter Email"
                    />
                  </label>
                  <div>
                    <label>
                      <p className="text-[13px] pb-1">Enter Password</p>
                      <Input
                        className="flex-grow border-none w-full rounded-full outline-none p-4 bg-dark-2"
                        type={inputType}
                        {...register("password")}
                        placeholder="Enter Password"
                      />
                    </label>
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
                    className="px-4 py-2 bg-blue-1 rounded-full w-full hover:bg-opacity-50 text-[13px]"
                    type="submit"
                  >
                    Sign In
                  </button>
                </form>
                {providers.google && (
                  <button
                    className="px-4 py-2 border border-blue-1 rounded-full w-full hover:bg-opacity-50 flex gap-5 items-center justify-center text-[13px]"
                    type="submit"
                    onClick={() => signIn("google")}
                  >
                    <FcGoogle size={20} />
                    Continue with Google
                  </button>
                )}
                <div>
                  <h1 className="text-[13px]">
                    Already have an account?
                    <span
                      className="underline cursor-pointer ml-1"
                      onClick={() => router.push("/login")}
                    >
                      login
                    </span>
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthProvider;
