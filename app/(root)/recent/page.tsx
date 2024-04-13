"use client"
import useRecents from "@/hooks/useRecent";
import { useSession } from "next-auth/react";
import React from "react";

const page = () => {
  const { data: session } = useSession();
  const { data: recents = [] } = useRecents(`/api/recent/${session?.user?.id}`);
  return <div className='text-white p-5 py-10 w-full'>
    <h1 className="text-[22px]">Recent Prompts</h1>
  </div>;
};

export default page;
