"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";

const links = [
  ["/work", "Work"],
  ["/projects", "Projects"],
  ["/writing", "Writing"],
  ["/about", "About"],
  ["/contact", "Contact"],
] as const;

function HeaderContent({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  return (
    <header
      className="site-header"
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          setOpen(false);
          button.current?.focus();
        }
      }}
    >
      <div className="shell header-inner">
        <Link
          className="wordmark"
          href="/"
          aria-label="Jegors Dorofejevs, home"
          onClick={() => setOpen(false)}
        >
          <span className="wordmark-name">Jegors Dorofejevs</span>
        </Link>
        <button
          ref={button}
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="primary-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? "Close" : "Menu"}
          <span aria-hidden="true">{open ? "−" : "+"}</span>
        </button>
        <nav
          id="primary-navigation"
          aria-label="Main navigation"
          className={`main-nav ${open ? "is-open" : ""}`}
        >
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              aria-current={
                pathname === href || pathname.startsWith(`${href}/`)
                  ? "page"
                  : undefined
              }
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function Header() {
  const pathname = usePathname();
  return <HeaderContent key={pathname} pathname={pathname} />;
}
