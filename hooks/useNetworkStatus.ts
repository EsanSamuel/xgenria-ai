import React from "react";

const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = React.useState<boolean>(true);

  const updateNetworkStatus = () => {
    setIsOnline(navigator.onLine);
  };

  React.useEffect(() => {
    updateNetworkStatus();
  }, []);

  React.useEffect(() => {
    window.addEventListener("load", updateNetworkStatus);
    window.addEventListener("online", updateNetworkStatus);
    window.addEventListener("offline", updateNetworkStatus);
    return () => {
      window.addEventListener("load", updateNetworkStatus);
      window.addEventListener("online", updateNetworkStatus);
      window.addEventListener("offline", updateNetworkStatus);
    };
  }, [navigator.onLine]);

  return { isOnline };
};

export default useNetworkStatus;
