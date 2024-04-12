import axios from "axios";
import { useSession } from "next-auth/react";
import usePrompt from "./usePrompts";
import React from "react";
import toast from "react-hot-toast";

const useLike = (promptId: string) => {
  const { data: session } = useSession();
  const { data: prompt, mutate: mutateFetchedPrompt } = usePrompt(
    `/api/promptId/${promptId}`
  );
  const { mutate: mutateFetchedPrompts } = usePrompt(
    `/api/post/${session?.user?.id}`
  );

  const hasLiked = React.useMemo(() => {
    const list = prompt?.starId || [];
    return list.includes(session?.user?.id);
  }, [session?.user?.id, prompt]);

  const toggleLike = async () => {
    if (hasLiked) {
      const response = await axios.post(`/api/unLike/${promptId}`);
      console.log(response.data);
      toast.success("Prompt unLiked!");
    } else {
      const response = await axios.post(`/api/prompt/${promptId}`, {
        userId: session?.user?.id,
      });
      console.log(response.data);
      toast.success("Prompt Liked!");
    }

    await mutateFetchedPrompt();
    await mutateFetchedPrompts();
  };

  return {
    hasLiked,
    toggleLike,
  };
};

export default useLike;
