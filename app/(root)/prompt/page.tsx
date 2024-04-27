"use client";
import usePrompt from "@/hooks/usePrompts";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense } from "react";
import { Badge } from "@/components/ui/badge";

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Prompt />
    </Suspense>
  );
};

const Prompt = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const documentId = searchParams.get("id");
  const { data: documentItem } = usePrompt(`/api/promptId/${documentId}`);

  const handleEdit = () => {
    router.push(`/editPrompt?id=${documentId}`);
  };

  React.useEffect(() => {
    // Check if navigator is available (client-side)
    if (typeof window !== "undefined") {
      // Code that accesses navigator
      // You can put the code here or call a function that contains the code
    }
  }, []);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="text-start sm:px-[20%] sm:py-20 p-5 text-white w-full">
        <div className="flex justify-between">
          <div className="flex gap-4 items-center">
            <h1 className="md:text-[25px] text-[16px] font-bold">
              {documentItem?.title}
            </h1>
            <Badge>{documentItem?.tag}</Badge>
          </div>
          <div>
            <button
              className="rounded-full px-5 py-1 text-white bg-blue-1"
              onClick={handleEdit}
            >
              Edit
            </button>
          </div>
        </div>
        <div className="mt-10">
          <h1
            dangerouslySetInnerHTML={{ __html: documentItem?.promptData }}
            className="text-[14px]"
          />
        </div>
      </div>
    </Suspense>
  );
};

export default Page;
