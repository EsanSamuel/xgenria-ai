"use client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import usePrompt from "@/hooks/usePrompts";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import FadeLoader from "react-spinners/FadeLoader";
import React, { CSSProperties, Suspense } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
    <Edit />
  </Suspense>
  )
};

const Edit = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const documentId = searchParams.get("id");
  const { data: documentItem } = usePrompt(`/api/promptId/${documentId}`);
  const [promptData, setPromptData] = React.useState<string>("");
  const [tag, setTag] = React.useState<string>("");
  const [title, setTitle] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  React.useEffect(() => {
    setPromptData(documentItem?.promptData as string);
    setTag(documentItem?.tag as string);
    setTitle(documentItem?.title as string);
  }, [documentItem]);

  const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "#0C78F9",
  };

  React.useEffect(() => {
    // Check if navigator is available (client-side)
    if (typeof window !== "undefined") {
      // Code that accesses navigator
      // You can put the code here or call a function that contains the code
    }
  }, []);

  async function handleEdit() {
    setLoading(true);
    const response = await axios.patch(`/api/prompt/${documentId}`, {
      promptData,
      tag,
      title,
    });
    console.log(response.data);
    setLoading(false);
    toast.success("Document Edited successfully!");
    router.push(`/prompt?id=${documentId}`);
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="text-start sm:px-[20%] sm:py-20 p-5 text-white w-full">
        <h1 className="text-[22px] font-bold">Edit Prompt</h1>
        <div className="flex flex-col gap-5 mt-10">
          <label className="flex gap-1 flex-col text-[14px]">
            Title
            <Input
              onChange={(e) => setTitle(e.target.value)}
              className="flex-grow border w-full border-blue-1 rounded-[10px] outline-none p-3 bg-dark-2"
              value={title}
              placeholder="Edit Title"
            />
          </label>
          <label className="flex gap-1 flex-col text-[14px]">
            Tag
            <select
              onChange={(e) => setTag(e.target.value)}
              className="flex-grow border w-full border-blue-1 rounded-[10px] outline-none p-2 bg-dark-1 text-[13px] "
              value={tag}
            >
              <option>Select Tag</option>
              <option>General</option>
              <option>Science</option>
              <option>Business</option>
              <option>Education</option>
              <option>Programming</option>
              <option>Technology</option>
            </select>
          </label>
          <label className="flex gap-1 flex-col text-[14px]">
            PromptData
            <Textarea
              value={promptData}
              onChange={(e) => setPromptData(e.target.value)}
              className="flex-grow border w-full border-blue-1 rounded-[10px] outline-none p-3 bg-dark-2 min-h-[300px]"
              placeholder="Edit PromptData"
            ></Textarea>
          </label>
          <button
            className="px-4 py-2 bg-blue-1 rounded-full w-full hover:bg-opacity-50 text-[13px]"
            onClick={handleEdit}
          >
            Edit Document
          </button>
        </div>

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
                  <p className="text-[14px] text-white pt-5">
                    Editing document...
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Suspense>
  );
};

export default Page;
