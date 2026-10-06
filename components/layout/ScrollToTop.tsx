"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Next.js keeps the scroll position on navigation whenever part of the new page is visible,
 * so clicking a link near the footer opened the next page at its footer. Start every new page
 * at the top instead, unless the URL targets a #section (the browser scrolls to that).
 * Query-only changes (e.g. results filters) keep the pathname and so keep their position.
 */
export function ScrollToTop() {
  const pathname = usePathname();
  const previous = useRef(pathname);

  useEffect(() => {
    if (previous.current === pathname) return;
    previous.current = pathname;
    if (window.location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
