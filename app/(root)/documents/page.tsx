"use client";
import Card from "@/components/Card";
import useLocalStorage from "@/hooks/useLocalStorage";
import usePrompt from "@/hooks/usePrompts";
import useUser from "@/hooks/useUser";
import useModal from "@/hooks/zustand/useModal";
import { useSession } from "next-auth/react";
import React, { CSSProperties, Suspense } from "react";
import { IoClose, IoFilterOutline } from "react-icons/io5";
import { redirect, useRouter } from "next/navigation";
import { CiFileOff } from "react-icons/ci";
import Offline from "@/components/Offline";
import useNetworkStatus from "@/hooks/useNetworkStatus";
import FadeLoader from "react-spinners/FadeLoader";
import usePinned from "@/hooks/usePinned";
import { VscPinned } from "react-icons/vsc";
import PinnedCard from "@/components/PinnedCard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import MobileNav from "@/components/MobileNav";

type documentProps = {
  id: string;
  title: string;
  tag: string;
  promptData: string;
  createdAt: string;
  starId: string[];
  user: {
    id: string;
    username: string;
    image: string;
    email: string;
  };
};

interface PinnedProps {
  id: string;
  prompt: {
    id: string;
    title: string;
    tag: string;
    promptData: string;
    createdAt: string;
    starId: string[];
  };
  user: {
    id: string;
    username: string;
    image: string;
    email: string;
  };
  createdAt: string;
}

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Document />
    </Suspense>
  );
};

const Document = () => {
  const { data: session, status } = useSession();
  const modal = useModal();
  const router = useRouter();

  //if (status === "unauthenticated" && status !== "loading") redirect("/login");

  const [search, setSearch] = React.useState<string>("");
  const { data: document = [], isLoading } = usePrompt(
    `/api/prompt/${session?.user?.id}`
  );
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
  const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "#0C78F9",
  };
  const handleFilter = (tag: string) => {
    switch (tag) {
      case "Science":
        setFilterByTags("Science");
        modal.onClose();
        break;
      case "Programming":
        setFilterByTags("Programming");
        modal.onClose();
        break;
      case "General":
        setFilterByTags("General");
        modal.onClose();
        break;
      case "Education":
        setFilterByTags("Education");
        modal.onClose();
        break;
      case "Technology":
        setFilterByTags("Technology");
        modal.onClose();
        break;
      case "Business":
        setFilterByTags("Business");
        modal.onClose();
        break;
      default:
        break;
    }
  };

  React.useEffect(() => {
    // Check if navigator is available (client-side)
    if (typeof window !== "undefined") {
      // Code that accesses navigator
      // You can put the code here or call a function that contains the code
    }
  }, []);

  const { data: pinned } = usePinned(`/api/pinned/${session?.user?.id}`);

  if (isLoading) {
    return (
      <>
        <MobileNav />
        <div className="text-center flex justify-center gap-3 md:mt-0 mt-20 items-center flex-col w-full text-white">
          <FadeLoader
            color="#0C78F9"
            loading={isLoading}
            cssOverride={override}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
          <h1 className="text-[14px]">Loading documents...</h1>
        </div>
      </>
    );
  }

  if (document < 1) {
    return (
      <>
        <MobileNav />
        <div className="text-center flex justify-center gap-3 md:mt-0 mt-20 items-center flex-col w-full text-white">
          <CiFileOff size={50} />
          <h1 className="text-[14px]">No documents yet</h1>
        </div>
      </>
    );
  }

  return (
    <div className="w-full">
      <MobileNav />
      <div className="text-white md:p-5 p-3 py-10">
        <div className="flex justify-between items-center">
          <>
            <h1 className="text-[22px]">
              {/*{getDay()} {user?.username},<br />
        here are your documents documents.*/}
              Documents
            </h1>
          </>
          <button
            className="bg-[#1dc071] px-4 py-2 text-white rounded-full text-[12px] font-bold"
            onClick={() => router.push("/createPrompt")}
          >
            Chat
          </button>
        </div>

        <div className="py-5 ">
          <h1 className="text-[15px] pb-5 flex gap-2 items-center">
            <VscPinned size={20} />
            Pinned Documents
          </h1>
          <ScrollArea className="md:w-[1200px] w-full whitespace-nowrap">
            <div className="flex gap-3 w-full">
              {pinned?.map((pin: PinnedProps) => (
                <div className="" key={pin.id}>
                  <PinnedCard pin={pin} />
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        <div className="mt-5 flex gap-2 items-center">
          <input
            className="flex-grow  w-full  rounded-[10px] outline-none p-3 bg-dark-1 text-[14px]"
            placeholder="Search Documents..."
            onChange={(e) => setSearch(e.target.value)}
          />
          <IoFilterOutline
            size={20}
            onClick={() => modal.onOpen()}
            className="cursor-pointer"
          />
        </div>
        <>
          <div className="grid md:grid-cols-2 gap-5 mt-10 w-full">
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
        </>

        {modal.isOpen === true && (
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-neutral-800 bg-opacity-70 ">
            <div className="relative w-full lg:w-3/6 my-6 mx-auto lg:max-w-3xl h-full lg:h-auto">
              <div className="flex justify-center items-center h-full sm:flex p-3">
                <div className="w-full lg:h-auto border-0 rounded-lg relative flex flex-col gap-6 h-auto  p-5 bg-dark-1 text-start  text-white shadow-lg outline-none focus:outline-none">
                  <div className="flex justify-between items-center">
                    <>
                      {" "}
                      <h1 className="text-center text-[17px] font-bold">
                        Filter By Tags
                      </h1>
                    </>
                    <IoClose
                      size={20}
                      className="text-right"
                      onClick={() => modal.onClose()}
                    />
                  </div>

                  <button
                    onClick={() => handleFilter("Science")}
                    className="text-start hover:bg-blue-1 px-3 py-2 rounded text-[14px]"
                  >
                    Science
                  </button>
                  <button
                    onClick={() => handleFilter("General")}
                    className="text-start hover:bg-blue-1 px-3 py-2 rounded text-[14px]"
                  >
                    General 
                  </button>
                  <button
                    onClick={() => handleFilter("Programming")}
                    className="text-start hover:bg-blue-1 px-3 py-2 rounded text-[14px]"
                  >
                    Programming
                  </button>
<button
                    onClick={() => handleFilter("Business")}
                    className="text-start hover:bg-blue-1 px-3 py-2 rounded text-[14px]"
                  >
                    Business 
                  </button>
<button
                    onClick={() => handleFilter("Technology")}
                    className="text-start hover:bg-blue-1 px-3 py-2 rounded text-[14px]"
                  >
                    Technology 
                  </button>
<button
                    onClick={() => handleFilter("Education")}
                    className="text-start hover:bg-blue-1 px-3 py-2 rounded text-[14px]"
                  >
                    Education 
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
