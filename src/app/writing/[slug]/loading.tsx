export default function Loading() {
  return (
    <div className="shell loading-state" role="status">
      <span className="eyebrow">Loading page…</span>
      <div className="skeleton skeleton-title" aria-hidden="true" />
      <div className="skeleton" aria-hidden="true" />
      <div className="skeleton" aria-hidden="true" />
    </div>
  );
}
