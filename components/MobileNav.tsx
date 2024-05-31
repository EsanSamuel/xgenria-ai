import React from "react";
import { BiMenuAltRight } from "react-icons/bi";
import {
  IoCreateOutline,
  IoDocumentOutline,
  IoSettingsOutline,
} from "react-icons/io5";
import { PiGooglePodcastsLogoBold } from "react-icons/pi";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import useUser from "@/hooks/useUser";
import Link from "next/link";
import { AvatarImage, Avatar, AvatarFallback } from "./ui/avatar";
import { RiHistoryLine } from "react-icons/ri";
import { IoClose } from "react-icons/io5";

const MobileNav = () => {
  const [showMenu, setShowMenu] = React.useState(false);
  const { data: session } = useSession();
  const { data: user } = useUser(`/api/user/${session?.user?.id}`);
  const pathname = usePathname();
  async function handleSignOut() {
    await signOut();
  }
  return (
    <>
      <div className="w-full flex justify-between text-white md:hidden p-3 py-5">
        <h1 className="font-bold text-[20px] flex gap-2 items-center">
          <PiGooglePodcastsLogoBold className="text-[20px] font-bold text-blue-1 " />
          Xgenria ai.
        </h1>
<div className="flex gap-3 items-center ">
{user?.image ? ( <Image src={user?.image!} className="w-[25px] h-[25px] rounded-full"
alt="" width={100} height={100} /> 
  ) : (
<div className="min-h-[25px] min-w-[25px] rounded-full border border-neutral-800"></div>
)}
        {showMenu ? (
          <IoClose size={20} onClick={() => setShowMenu(false)} />
        ) : (
          <BiMenuAltRight size={20} onClick={() => setShowMenu(true)} />
        )}
</div>
      </div>

      {showMenu && (
        <div className="fixed top-0 p-5 flex-col flex gap-8 h-screen z-20 border-neutral-700 md:min-w-[250px] w-[250px] text-[#fff] bg-dark-1 md:hidden md:flex border-r border-neutral-800">
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

            {pathname === "/settings" ? (
              <li className="flex gap-2 text-white bg-blue-1 rounded py-3 px-2 cursor-pointer items-center">
                <IoSettingsOutline className="text-[20px]" />
                Setting
              </li>
            ) : (
              <Link href="/settings">
                <li className="flex gap-2 hover:text-white hover:bg-blue-1 rounded py-3 px-2 cursor-pointer items-center">
                  <IoSettingsOutline className="text-[20px]" />
                  Setting
                </li>
              </Link>
            )}

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

            <li
              className="flex gap-2  rounded py-3 px-2 cursor-pointer items-center fixed bottom-5"
              onClick={handleSignOut}
            >
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
          </ul>
        </div>
      )}
    </>
  );
};

export default MobileNav;
