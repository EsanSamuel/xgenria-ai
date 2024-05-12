"use client";
import { PromptContext, PromptType } from "@/context/PromptProvider";
import useModal from "@/hooks/zustand/useModal";
import React, { CSSProperties, Suspense } from "react";
import { IoSendOutline } from "react-icons/io5";
import { TiMicrophoneOutline } from "react-icons/ti";
import { IoClose } from "react-icons/io5";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import FadeLoader from "react-spinners/FadeLoader";
import { Input } from "@/components/ui/input";
import useSpeechRecognition from "@/hooks/useSpeechRecognition";
import { FaMicrophoneSlash } from "react-icons/fa";
import useUser from "@/hooks/useUser";
import Image from "next/image";
import { FaArrowUp } from "react-icons/fa6";
import useRecents from "@/hooks/useRecent";
import { PiGooglePodcastsLogoBold } from "react-icons/pi";

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreatePrompt />
    </Suspense>
  );
};

const CreatePrompt = () => {
  const modal = useModal();
  const searchParams = useSearchParams();
  const recentValue = searchParams.get("recentValue");
  const recentValueId = searchParams.get("id");
  const recentPrompt = searchParams.get("prompt");
  const { data: session } = useSession();
  const { data: user } = useUser(`/api/user/${session?.user?.id}`);
  const router = useRouter();
  const [title, setTitle] = React.useState<string>("");
  const [tag, setTag] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [recentPromptValue, setRecentPromptValue] = React.useState<string>(
    recentPrompt as string
  );
  const { input, sendPrompt, setInput, promptData, isLoading } =
    React.useContext(PromptContext) as PromptType;
  const { isListening, inputValue, startRecording, inputRef } =
    useSpeechRecognition();

  const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "#0C78F9",
  };

  async function handleSubmit(e: any) {
    e.preventDefault();
    setRecentPromptValue("");
    sendPrompt();
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

  React.useEffect(() => {
    if (inputValue) {
      setInput(inputValue);
    }
  }, [inputValue]);

  async function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (inputValue) {
      setInput(inputValue);
      setInput(e.target.value);
    } else {
      setInput(e.target.value);
    }
  }

  async function createDocument() {
    if (!title || !tag) {
      toast.error("Fill the form!");
      return null;
    } else {
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
    }
  }

  const { data: recent } = useRecents(`/api/recentId/${recentValueId}`);

  React.useEffect(() => {
    // Check if navigator is available (client-side)
    if (typeof window !== "undefined") {
      // Code that accesses navigator
      // You can put the code here or call a function that contains the code
    }
  }, []);
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
                  className="px-4 py-1 bg-blue-1 rounded-full text-[13px] font-bold"
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
              {recentPromptValue?.length > 0 ? (
                <>
                  <textarea
                    value={recent?.prompt}
                    className="w-full min-h-[500px] outline-none bg-dark-2 border-none mt-10 h-full text-[13px]"
                    readOnly
                  ></textarea>
                </>
              ) : (
                <>
                  {promptData ? (
                    <div className="w-full rounded-[10px] bg-dark-1 text-white flex gap-2 items-center p-2 mt-10">
                      <Image
                        src={user?.image!}
                        width={100}
                        height={100}
                        className="w-[20px] h-[20px] rounded-full"
                        alt="You"
                      />
                      <>
                        <h1 className="text-[13px]">{input}</h1>
                      </>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 items-center justify-center">
                      <PiGooglePodcastsLogoBold className="text-[40px] mt-20 font-bold text-blue-1 text-center " />
                      <h1 className="text-[13px]">Chat with AI</h1>
                    </div>
                  )}
                  <textarea
                    value={promptData}
                    className="w-full min-h-[500px] outline-none bg-dark-2 border-none mt-10 h-full text-[13px]"
                    readOnly
                  ></textarea>
                </>
              )}
            </div>
          )}
          <div className="flex fixed flex-row bottom-3 gap-2 w-screen items-center md:max-w-screen-lg mx-auto p-0">
            <form
              onSubmit={handleSubmit}
              className="flex gap-2 md:max-w-screen-lg mx-auto w-full"
            >
              <Input
                onChange={handleInputChange}
                placeholder="Enter Prompt"
                className="flex-grow border-none w-full  rounded-full outline-none p-3 bg-dark-1"
                value={input}
                ref={inputRef}
              />

              <button
                onClick={handleSubmit}
                className="text-white bg-blue-1 rounded-lg px-3 py-1 hover:bg-opacity-50"
              >
                <FaArrowUp size={20} />
              </button>
            </form>
            <div className="">
              {isListening ? (
                <button
                  className="text-white bg-dark-2 rounded hover:bg-opacity-50"
                  onClick={startRecording}
                >
                  <FaMicrophoneSlash size={20} />
                </button>
              ) : (
                <button
                  className="text-white bg-dark-2 rounded hover:bg-opacity-50"
                  onClick={startRecording}
                >
                  <TiMicrophoneOutline size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {modal.isOpen === true && (
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-neutral-800 bg-opacity-70 ">
          <div className="relative w-full lg:w-3/6 my-6 mx-auto lg:max-w-3xl h-full lg:h-auto">
            <div className="flex justify-center items-center h-full sm:flex p-3">
              <div className="w-full lg:h-auto border-0 rounded-lg relative flex flex-col gap-6 h-auto  md:p-10 p-5 bg-dark-1  text-white shadow-lg outline-none focus:outline-none">
                <IoClose
                  size={20}
                  className="text-right"
                  onClick={closeModal}
                />
                <h3 className="md:text-[15px] text-[13px]">
                  Are you sure you want to save prompt as a document?
                </h3>
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
                  className="px-4 py-2 bg-blue-1 rounded-full w-full hover:bg-opacity-50 text-[13px]"
                  onClick={createDocument}
                >
                  Save as Document
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-neutral-800 bg-opacity-70 ">
          <div className="relative w-full lg:w-2/6 my-6 mx-auto lg:max-w-3xl h-full lg:h-auto">
            <div className="flex justify-center items-center h-full sm:flex p-3">
              <div className="w-full lg:h-auto border-0 rounded-lg relative flex flex-col gap-6 h-auto  p-10 bg-dark-1 text-center text-white shadow-lg outline-none focus:outline-none">
                <FadeLoader
                  color="#0C78F9"
                  loading={loading}
                  cssOverride={override}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
                <p className="md:text-[14px] text-[13px] text-white pt-5">
                  Creating document...
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;

/*created by Esan Samuel, software developer */
