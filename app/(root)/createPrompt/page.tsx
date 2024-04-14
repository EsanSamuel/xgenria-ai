"use client";
import { PromptContext, PromptType } from "@/context/PromptProvider";
import useModal from "@/hooks/zustand/useModal";
import React, { CSSProperties } from "react";
import { IoSendOutline } from "react-icons/io5";
import { TiMicrophoneOutline } from "react-icons/ti";
import { IoClose } from "react-icons/io5";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import FadeLoader from "react-spinners/FadeLoader";
import { Input } from "@/components/ui/input";

const page = () => {
  const modal = useModal();
  const searchParams = useSearchParams();
  const recentValue = searchParams.get("recentValue");
  const { data: session } = useSession();
  const router = useRouter();
  const [title, setTitle] = React.useState<string>("");
  const [tag, setTag] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const { input, sendPrompt, setInput, promptData, isLoading } =
    React.useContext(PromptContext) as PromptType;

  const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "#0C78F9",
  };

  async function handleSubmit(e: any) {
    e.preventDefault();
    sendPrompt();
    const response = await axios.post("/api/recent", {
      user_Id: session?.user?.id,
      recent: input,
    });
    console.log(response.data);
    //setInput("");
  }
  const openModal = () => {
    modal.onOpen();
  };
  const closeModal = () => {
    modal.onClose();
  };

  React.useEffect(() => {
    if (recentValue && recentValue.length > 0) {
      setInput(recentValue);
      sendPrompt();
    }
  }, [recentValue]);

  const handleChange =
    (name: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      switch (name) {
        case "title":
          setTitle(e.target.value);
          break;
        case "tag":
          setTag(e.target.value);
          break;
        default:
          break;
      }
    };

  async function createDocument() {
    try {
      setLoading(true);
      const response = await axios.post("/api/prompt", {
        user_Id: session?.user?.id,
        title,
        tag,
        promptData,
      });
      modal.onClose();
      console.log(response.data);
      setLoading(false);
      router.push("/documents");
      toast.success("Document created!");
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="flex flex-col justify-center items-center overflow-auto w-full">
      <div className=" w-full flex flex-col justify-between h-screen overflow-hidden relative text-white">
        <div className="p-5 w-full overflow-auto">
          <div className="flex gap-4 justify-between  w-full">
            <div>
              <h1 className="font-bold text-[20px]">Chat</h1>
            </div>
            <div>
              {promptData && (
                <button
                  className="px-4 py-1 bg-blue-1 rounded-full text-[14px]"
                  onClick={openModal}
                >
                  Save as Document
                </button>
              )}
            </div>
          </div>
          {isLoading ? (
            <div className="text-center flex justify-center gap-3 items-center flex-col mt-[20%] w-full">
              <FadeLoader
                color="#0C78F9"
                loading={isLoading}
                cssOverride={override}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
              <h1 className="text-[14px]">Generating Prompt...</h1>
            </div>
          ) : (
            <div>
              <h1
                className="mt-10 text-left max-w-[1200px] whitespace-normal"
                dangerouslySetInnerHTML={{ __html: promptData }}
              />
            </div>
          )}
          <form
            onSubmit={handleSubmit}
            className="flex gap-2 fixed bottom-0 w-full md:max-w-screen-lg mx-auto w-full md:p-3"
          >
            <Input
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter Prompt"
              className="flex-grow border w-full border-blue-1 rounded-[10px] outline-none p-3 bg-dark-2"
              value={input}
            />
            <button className="text-white bg-blue-1 px-3 py-1 rounded hover:bg-opacity-50">
              <TiMicrophoneOutline size={20} />
            </button>
            <button
              onClick={handleSubmit}
              className="text-white bg-blue-1 px-3 py-1 rounded hover:bg-opacity-50"
            >
              <IoSendOutline size={20} />
            </button>
          </form>
        </div>
      </div>
      {modal.isOpen === true && (
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-neutral-800 bg-opacity-70 ">
          <div className="relative w-full lg:w-3/6 my-6 mx-auto lg:max-w-3xl h-full lg:h-auto">
            <div className="w-full lg:h-auto border-0 rounded-lg relative flex flex-col gap-6 h-auto  p-10 bg-dark-1  text-white shadow-lg outline-none focus:outline-none">
              <IoClose size={20} className="text-right" onClick={closeModal} />
              <h3>Are you sure you want to save prompt as a document?</h3>
              <Input
                onChange={handleChange("title")}
                placeholder="Enter Title"
                className="flex-grow border w-full border-blue-1 rounded-[10px] outline-none p-4 bg-dark-1"
              />
              <select
                onChange={handleChange("tag")}
                className="flex-grow border w-full border-blue-1 rounded-[10px] outline-none p-2 bg-dark-1 text-[13px]"
              >
                <option>Select Tag</option>
                <option>Science</option>
                <option>English</option>
                <option>Programming</option>
              </select>
              <button
                className="px-4 py-2 bg-blue-1 rounded-full w-full hover:bg-opacity-50"
                onClick={createDocument}
              >
                Save as Document
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-neutral-800 bg-opacity-70 ">
          <div className="relative w-full lg:w-2/6 my-6 mx-auto lg:max-w-3xl h-full lg:h-auto">
            <div className="w-full lg:h-auto border-0 rounded-lg relative flex flex-col gap-6 h-auto  p-10 bg-dark-1 text-center text-white shadow-lg outline-none focus:outline-none">
              <FadeLoader
                color="#0C78F9"
                loading={loading}
                cssOverride={override}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
              <p className="text-[14px] text-white pt-5">
                Creating document...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default page;
