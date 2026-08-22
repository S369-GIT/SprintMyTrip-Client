import { useSyncExternalStore } from "react";
const subscribe = (callback) => {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });

  // Return cleanup function to disconnect the observer
  return () => observer.disconnect();
};
const getSnapshot = () => {
  return document.documentElement.classList.contains("dark");
};
export default function useThemeStatus() {
  return useSyncExternalStore(subscribe, getSnapshot);
}
