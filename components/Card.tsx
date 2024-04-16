import React from "react";
import { HiOutlineDocumentDuplicate } from "react-icons/hi";
import { FaRegHeart } from "react-icons/fa";
import { VscPinned } from "react-icons/vsc";
import { useSession } from "next-auth/react";
import axios from "axios";
import useLike from "@/hooks/useLike";
import { FcLike } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { MdDeleteOutline } from "react-icons/md";
import toast from "react-hot-toast";
import { formatDistanceToNowStrict } from "date-fns";

type documentProps = {
  document: {
    id: string;
    title: string;
    tag: string;
    promptData: string;
    createdAt: string;
    starId: string[];
    user: {
      id: string;
      username: string;
      image: string;
      email: string;
    };
  };
};

const Card = ({ document }: documentProps) => {
  const { data: session } = useSession();
  const { toggleLike, hasLiked } = useLike(document.id);
  const router = useRouter();
  const LikeIcon = () => {
    if (hasLiked) {
      return <FcLike size={20} onClick={toggleLike} className="text-red" />;
    } else {
      return <FaRegHeart size={20} onClick={toggleLike} className="" />;
    }
  };
  const handleClick = () => {
    router.push(`/prompt?id=${document.id}`);
  };

  const handleDelete = async () => {
    await axios.delete(`/api/prompt/${document.id}`);
    toast.success("Document deleted successfully!");
  };

  const createdAt = React.useMemo(() => {
    if (!document?.createdAt) {
      return null;
    }
    const date = document?.createdAt;
    return formatDistanceToNowStrict(new Date(date));
  }, [document]);

  async function handlePinn() {
    try {
      const response = await axios.post(`/api/pinned/${document.id}`, {
        user_Id: session?.user?.id,
      });
      toast.success("Document pinned!");
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex  w-full flex-col justify-between rounded-[14px] bg-dark-1 px-5 py-8 ">
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <HiOutlineDocumentDuplicate size={25} />
          <VscPinned size={25} onClick={handlePinn} />
        </div>

        <h1 className="text-[20px] text-start cursor-pointer" onClick={handleClick}>
          {document.title}
        </h1>
        <p className="font-normal  text-[15px]">created {createdAt} ago</p>
        <div className="left-2 flex justify-between items-center">
          {LikeIcon()}
          <div className="flex gap-3 items-center">
            <button className="bg-blue-1 px-4 py-2 text-white rounded text-[13px]">
              {document.tag}
            </button>
            <MdDeleteOutline size={20} onClick={handleDelete} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
