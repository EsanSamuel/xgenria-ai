import fetcher from "@/lib/fetcher";
import useSWR from "swr";

const usePinned = (api: string) => {
  const { data, error, isLoading, mutate } = useSWR(api, fetcher);
  return {
    data,
    error,
    isLoading,
    mutate,
  };
};

export default usePinned;
