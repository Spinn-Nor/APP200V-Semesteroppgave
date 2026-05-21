/**
 * Custom hook to provide dymanic page titles in browser
 *
 * @author Fredrik Fordelsen
 */

import { useEffect } from "react";

export const usePageTitle = (title) => {
  useEffect(() => {
    if (title) {
      document.title = `${title} | Blueberry Hotels`;
    }

    return () => {
      document.title = "Blueberry Hotels"; // fallback when you leave the page
    };
  }, [title]);
};
