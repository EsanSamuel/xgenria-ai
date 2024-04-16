import axios from "axios";
import { formatDistanceToNowStrict } from "date-fns";
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
  const createdAt = React.useMemo(() => {
    if (!pin?.createdAt) {
      return null;
    }
    const date = pin?.createdAt;
    return formatDistanceToNowStrict(new Date(date));
  }, [document]);

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
    <div className="flex  w-full flex-col justify-between rounded-[14px] bg-dark-1 px-5 py-8 min-w-[250px]">
      <TbPinnedOff size={18} className="text-right" onClick={unPinn} />
      <h1 className="text-[17px]">{pin.prompt.title}</h1>
      <p className="text-[14px]">Pinned {createdAt} ago</p>
    </div>
  );
};

export default PinnedCard;
