"use client";
import useRecents from "@/hooks/useRecent";
import { useSession } from "next-auth/react";
import React from "react";
import RecentCard from "@/components/RecentCard";

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
};

const page = () => {
  const { data: session } = useSession();
  const { data: recents = [] } = useRecents(`/api/recent/${session?.user?.id}`);
  console.log(recents);
  return (
    <div className="text-white p-5 py-10 w-full ">
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

export default page;
