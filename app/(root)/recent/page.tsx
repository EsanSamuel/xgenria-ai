"use client";
import useRecents from "@/hooks/useRecent";
import { useSession } from "next-auth/react";
import React, { CSSProperties, Suspense } from "react";
import RecentCard from "@/components/RecentCard";
import { CiFileOff } from "react-icons/ci";
import Offline from "@/components/Offline";
import useNetworkStatus from "@/hooks/useNetworkStatus";
import FadeLoader from "react-spinners/FadeLoader";

type recentProps = {
  id: string;
  recent: any;
  user: {
    id: string;
    username: string;
    image: string;
    email: string;
  };
  createdAt: string;
  prompt: string;
};

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Recent />
    </Suspense>
  );
};

const Recent = () => {
  const { data: session } = useSession();
  const {
    data: recents = [],
    error,
    isLoading,
  } = useRecents(`/api/recent/${session?.user?.id}`);
  console.log(recents);
  if (error) console.log(error);
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

  if (isLoading) {
    return (
      <div className="text-center flex justify-center gap-3 items-center flex-col mt-[20] w-full text-white">
        <FadeLoader
          color="#0C78F9"
          loading={isLoading}
          cssOverride={override}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
        <h1 className="text-[14px]">Loading recents prompt...</h1>
      </div>
    );
  }

  if (recents < 1) {
    return (
      <div className="text-center flex justify-center gap-3 items-center flex-col mt-[20] w-full text-white">
        <CiFileOff />
        <h1 className="text-[14px]">No recents yet</h1>
      </div>
    );
  }

  return (
    <div className="text-white md:p-5 p-3 py-10 w-full ">
      <h1 className="text-[22px]">Recent Prompts</h1>
      <div className="flex flex-col w-full gap-5 mt-10">
        {recents?.map((recent: recentProps) => (
          <div key={recent.id}>
            <RecentCard recentitem={recent} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
