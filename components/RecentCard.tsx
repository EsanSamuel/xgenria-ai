import axios from "axios";
import React from "react";
import { MdDeleteOutline } from "react-icons/md";
import { useRouter } from "next/navigation";

type recentProps = {
  recentitem: {
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
};

const RecentCard = ({ recentitem }: recentProps) => {
  const router = useRouter();
  async function handleDelete() {
    await axios.delete(`/api/recent/${recentitem.id}`);
  }
  async function handleClick() {
    router.push(
      `/createPrompt?recentValue=${recentitem.recent}&prompt=${recentitem.prompt}&id=${recentitem?.id}`
    );
  }
  return (
    <div className="bg-dark-1 w-full p-3 flex justify-between cursor-pointer rounded">
      <h1 className="text-[12px]" onClick={handleClick}>
        {recentitem.recent}
      </h1>
      <MdDeleteOutline
        size={20}
        onClick={handleDelete}
        className="cursor-pointer"
      />
    </div>
  );
};

export default RecentCard;
