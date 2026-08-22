import { useSyncExternalStore } from "react";
const subscribe = (callback) => {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
};
const getSnapshot = () => {
  return navigator.onLine;
};
const useOnlineStatus = () => {
  const onlineStatus = useSyncExternalStore(subscribe, getSnapshot);
  return onlineStatus;
};

export default useOnlineStatus;
