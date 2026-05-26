import { useEffect } from "react";

export const useScrollLock = (isActive) => {
  useEffect(() => {
    if (isActive) {
      // Lock scrolling
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "15px"; // Hindrer layout shift
    } else {
      // Unlock
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0";
    }

    // Cleanup
    return () => {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0";
    };
  }, [isActive]);
};
