"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/** Move keyboard and screen-reader focus to new content after client navigation. */
export function RouteFocus() {
  const pathname = usePathname();
  const previousPath = useRef(pathname);
  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    const heading = document.querySelector<HTMLElement>("main h1");
    if (heading) {
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    }
  }, [pathname]);
  return null;
}
