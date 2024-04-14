"use client";
import AuthProvider from "@/components/AuthProvider";
import Card from "@/components/Card";
import Sidebar from "@/components/Sidebar";
import useLocalStorage from "@/hooks/useLocalStorage";
import usePrompt from "@/hooks/usePrompts";
import useUser from "@/hooks/useUser";
import useModal from "@/hooks/zustand/useModal";
import { useSession } from "next-auth/react";
import React from "react";
import { IoClose, IoFilterOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { CiFileOff } from "react-icons/ci";

type documentProps = {
  id: string;
  title: string;
  tag: string;
  promptData: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    image: string;
    email: string;
  };
};

const page = () => {
  const { data: session } = useSession();
  const modal = useModal();
  const router = useRouter();
  const [search, setSearch] = React.useState<string>("");
  const { data: document = [] } = usePrompt(`/api/prompt/${session?.user?.id}`);
  console.log(document);
  const { data: user } = useUser(`/api/user/${session?.user?.id}`);
  const [filterByTags, setFilterByTags] = useLocalStorage<string>(
    "filterTags",
    ""
  );
  const filterTags = (tag: string) =>
    filterByTags
      ? document.filter((item: documentProps) => item.tag === tag)
      : document;
  const getDay = () => {
    const date = new Date().getHours();
    if (date < 12) return "Good morning";
    if (date < 18) return "Good eafternoon";
    return "Good evening";
  };
  const handleFilter = (tag: string) => {
    switch (tag) {
      case "Science":
        setFilterByTags("Science");
        modal.onClose();
        break;
      case "English":
        setFilterByTags("English");
        modal.onClose();
        break;
      case "Programming":
        setFilterByTags("Programming");
        modal.onClose();
        break;
      default:
        break;
    }
  };

  if (document.lenth === 0) {
    return (
      <div className="text-center pt-[20%]">
        <CiFileOff size={40} />
        <h1>No Documents created yet!</h1>
      </div>
    );
  } else
    return (
      <div className="text-white p-5 py-10 w-full">
        {/*<AuthProvider />*/}
        <h1 className="text-[22px]">
          {/*{getDay()} {user?.username},<br />
        here are your documents documents.*/}
          Documents
        </h1>
        <div className="mt-5 flex gap-2 items-center">
          <input
            className="flex-grow  w-full  rounded-[10px] outline-none p-3 bg-dark-1"
            placeholder="Search Documents..."
            onChange={(e) => setSearch(e.target.value)}
          />
          <IoFilterOutline
            size={20}
            onClick={() => modal.onOpen()}
            className="cursor-pointer"
          />
        </div>
        <div className="grid md:grid-cols-1 grid-col-2 gap-5 mt-10 w-full">
          {filterTags(filterByTags)
            .filter((document: documentProps) => {
              if (search === "") {
                return document;
              } else {
                if (
                  document.title
                    .toLowerCase()
                    .includes(search.toLocaleLowerCase())
                ) {
                  return document;
                }
              }
            })
            .map((document: documentProps) => (
              <div key={document.id} className="w-full">
                <Card document={document} />
              </div>
            ))}
        </div>

        {modal.isOpen === true && (
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-neutral-800 bg-opacity-70 ">
            <div className="relative w-full lg:w-3/6 my-6 mx-auto lg:max-w-3xl h-full lg:h-auto">
              <div className="w-full lg:h-auto border-0 rounded-lg relative flex flex-col gap-6 h-auto  p-5 bg-dark-1 text-start  text-white shadow-lg outline-none focus:outline-none">
                <IoClose
                  size={20}
                  className="text-right"
                  onClick={() => modal.onClose()}
                />
                <h1 className="text-center text-[17px]">Filter By Tags</h1>

                <button
                  onClick={() => handleFilter("Science")}
                  className="text-start hover:bg-blue-1 px-3 py-2 rounded text-[14px]"
                >
                  Science
                </button>
                <button
                  onClick={() => handleFilter("English")}
                  className="text-start hover:bg-blue-1 px-3 py-2 rounded text-[14px]"
                >
                  English
                </button>
                <button
                  onClick={() => handleFilter("Programming")}
                  className="text-start hover:bg-blue-1 px-3 py-2 rounded text-[14px]"
                >
                  Programming
                </button>
                <button
                  onClick={() => {
                    setFilterByTags("");
                    modal.onClose();
                  }}
                  className="text-start hover:bg-blue-1 px-3 py-2 rounded text-[14px]"
                >
                  Clear filter
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
};

export default page;
