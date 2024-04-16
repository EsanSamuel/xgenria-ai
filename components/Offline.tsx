import React from "react";
import { IoCloudOfflineOutline } from "react-icons/io5";

const Offline = () => {
  return (
    <div className="text-white text-center p-10 mt-[20%] w-full flex flex-col gap-3">
      <IoCloudOfflineOutline size={40} />
      <h1 className="text-[#5f5f5f]">It appears you are offline</h1>
    </div>
  );
};

export default Offline;
