"use client";
import React from "react";
import {
  IoCreateOutline,
  IoDocumentOutline,
  IoSettingsOutline,
} from "react-icons/io5";
import { PiGooglePodcastsLogoBold } from "react-icons/pi";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import useUser from "@/hooks/useUser";
import Link from "next/link";
import { AvatarImage, Avatar, AvatarFallback } from "./ui/avatar";
import { RiHistoryLine } from "react-icons/ri";
import AuthProvider from "./AuthProvider";

const Sidebar = () => {
  const { data: session } = useSession();
  const { data: user } = useUser(`/api/user/${session?.user?.id}`);
  const pathname = usePathname();
  return (
    <div className="sticky top-0 p-5 flex-col flex gap-8 h-screen  border-neutral-700 min-w-[250px] text-[#fff] bg-dark-1 max-sm:hidden ">
      <h1 className="font-bold text-[20px] flex gap-2 px-2 items-center">
        <PiGooglePodcastsLogoBold className="text-[20px] font-bold text-blue-1 " />
        Xgenria ai.
      </h1>
      <ul className="text-[15px] flex-col flex gap-6 mt-5">
        {pathname === "/documents" ? (
          <li className="flex gap-2 text-white bg-blue-1 rounded py-3 px-2 cursor-pointer items-center">
            <IoDocumentOutline className="text-[20px]" />
            Documents
          </li>
        ) : (
          <Link href="/documents">
            <li className="flex gap-2 hover:text-white hover:bg-blue-1 rounded py-3 px-2 cursor-pointer items-center">
              <IoDocumentOutline className="text-[20px]" />
              Documents
            </li>
          </Link>
        )}

        {pathname === "/createPrompt" ? (
          <li className=" flex gap-2 text-white bg-blue-1 rounded py-3 px-2 cursor-pointer items-center">
            <IoCreateOutline className="text-[20px]" />
            Create Prompt
          </li>
        ) : (
          <Link href="/createPrompt">
            <li className=" flex gap-2 hover:text-white hover:bg-blue-1 rounded py-3 px-2 cursor-pointer items-center">
              <IoCreateOutline className="text-[20px]" />
              Create Prompt
            </li>
          </Link>
        )}

        <li className="flex gap-2 hover:text-white hover:bg-blue-1 rounded py-3 px-2 cursor-pointer items-center">
          <IoSettingsOutline className="text-[20px]" />
          Setting
        </li>

        {pathname === "/recent" ? (
          <Link href="/recent">
            <li className="flex gap-2 text-white bg-blue-1 rounded py-3 px-2 cursor-pointer items-center">
              <RiHistoryLine className="text-[20px]" />
              Recent
            </li>
          </Link>
        ) : (
          <Link href="/recent">
            <li className="flex gap-2 hover:text-white hover:bg-blue-1 rounded py-3 px-2 cursor-pointer items-center">
              <RiHistoryLine className="text-[20px]" />
              Recent
            </li>
          </Link>
        )}

        {user ? (
          <li className="flex gap-2  rounded py-3 px-2 cursor-pointer items-center fixed bottom-5">
            <Avatar>
              <AvatarImage
                src={user?.image!}
                alt=""
                width={100}
                height={100}
                className=""
              />
              <AvatarFallback>DP</AvatarFallback>
            </Avatar>
            {user?.username}
          </li>
        ) : (
          <AuthProvider />
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
