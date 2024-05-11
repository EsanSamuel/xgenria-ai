import axios from "axios";
import { formatDistanceToNowStrict } from "date-fns";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import { TbPinnedOff } from "react-icons/tb";

type PinnedProps = {
  pin: {
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
  };
};

const PinnedCard = ({ pin }: PinnedProps) => {
  const router = useRouter();
  const createdAt = React.useMemo(() => {
    if (!pin?.createdAt) {
      return null;
    }
    const date = pin?.createdAt;
    return formatDistanceToNowStrict(new Date(date));
  }, [document]);

  const handleClick = () => {
    router.push(`/prompt?id=${pin.prompt.id}`);
  };

  async function unPinn() {
    try {
      const response = await axios.delete(`/api/pinned/${pin.id}`);
      toast.success("Document unpinned!");
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex  w-full flex-col gap-3 justify-between  rounded-[14px] bg-dark-1 px-5 py-8 min-w-[300px]">
      <div className="flex justify-between">
        <button className="text-[17px] cursor-pointer line-clamp font-bold" onClick={handleClick}>
          {pin.prompt.title}
        </button>
        <TbPinnedOff size={18} className="" onClick={unPinn} />
      </div>
      <p className="text-[14px]">Pinned {createdAt} ago</p>
    </div>
  );
};

export default PinnedCard;
