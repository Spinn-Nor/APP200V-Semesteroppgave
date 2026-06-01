/**
 * Custom React Hook - useScrollLock
 *
 * Locks the body scroll when active (typically used for modals, cart drawer,
 * or other overlays). Also adds a small padding to prevent layout shift
 * caused by the disappearing scrollbar.
 *
 * @author Fredrik Fordelsen
 * @param {boolean} isActive - Whether the scroll lock should be active or not
 *
 * Usage example:
 * const { isOpen } = useModal();
 * useScrollLock(isOpen);
 */

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
