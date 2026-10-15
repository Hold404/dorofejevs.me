"use client";
import Link from "next/link";
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="shell short-page">
      <div className="page-intro">
        <p className="eyebrow">SOMETHING WENT WRONG</p>
        <h1>This page couldn’t load.</h1>
        <p className="intro-description">
          Please try again. You can also return to the homepage.
        </p>
      </div>
      <div className="actions">
        <button className="button-primary" onClick={reset}>
          Try again
        </button>
        <Link className="text-link" href="/">
          Return home →
        </Link>
      </div>
    </div>
  );
}
