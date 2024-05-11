"use client";
import { Input } from "@/components/ui/input";
import axios from "axios";
import React from "react";
import { useSession } from "next-auth/react";
import useUser from "@/hooks/useUser";
import Image from "next/image";
import toast from "react-hot-toast";

const page = () => {
  const { data: session } = useSession();
  const [username, setUsername] = React.useState<string>("");
const [loading, setLoading] = React.useState<boolean>(false);
  const [image, setImage] = React.useState<string>("");
  const { data: user } = useUser(
    session?.user?.id ? `/api/user/${session?.user?.id}` : ""
  );

  async function handleEdit() {
    try {
setLoading(true)
      const response = await axios.patch(`/api/user/${session?.user?.id}`, {
        username,
        image,
      });
      console.log(response.data);
setLoading(false)
toast.success("Profile edited!")
    } catch (error) {
      console.log(error);
    }
  }
  React.useEffect(() => {
    setUsername((user?.username as string) || "");
    setImage((user?.image as string) || "");
    console.log("username:", user?.username as string);
    console.log("image:", user?.image as string);
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.includes("image")) {
      console.log("Please upload an image!");
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;

      setImage(result);
    };
  };

  return (
    <div className="text-start sm:px-[20%] sm:py-20 p-5 text-white w-full">
      <h1 className="text-[22px] font-bold">Settings</h1>
      <div className="flex flex-col gap-5 mt-10 w-full justify-center items-center">
        {image ? (
          <div>
            <Image
              src={image}
              width={100}
              height={100}
              alt={username}
              className=" w-[200px] h-[200px] rounded-full"
            />
          </div>
        ) : (
          <div>
            <Image
              src={user?.image || ""}
              width={100}
              height={100}
              alt={user?.username}
              className="rounded-full w-[200px] h-[200px]"
            />
          </div>
        )}
        <div className="w-full">
          <label className="flex gap-1 flex-col text-[14px]">
            Image
            <Input
              onChange={handleImageChange}
              className="flex-grow border w-full border-blue-1 rounded-[10px] outline-none p-3 bg-dark-2"
              type="file"
            />
          </label>
          <label className="flex gap-1 flex-col text-[14px]">
            Username
            <Input
              onChange={(e) => setUsername(e.target.value)}
              className="flex-grow border w-full border-blue-1 rounded-[10px] outline-none p-3 bg-dark-2"
              value={username}
              placeholder="Edit Title"
            />
          </label>
        </div>
        <button
          className="px-4 py-2 bg-blue-1 rounded-full w-full hover:bg-opacity-50 text-[13px]"
          onClick={handleEdit}
        >
         {!loading ?  "Edit Profile" : "Editing..."}
        </button>
      </div>
    </div>
  );
};

export default page;
