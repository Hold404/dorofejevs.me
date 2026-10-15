"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function MotionFigure({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  const figure = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = figure.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        element.dataset.motionVisible = String(entry?.isIntersecting ?? false);
      },
      { threshold: 0.1 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <figure ref={figure} className={className} data-motion-visible="false">
      {children}
    </figure>
  );
}
