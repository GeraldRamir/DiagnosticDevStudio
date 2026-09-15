export default function Loading() {
  return (
    <div className="dst-container py-16">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-secondary" />
      <div className="mt-4 h-4 w-full max-w-xl animate-pulse rounded-lg bg-secondary" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-56 animate-pulse rounded-2xl bg-secondary" />
        ))}
      </div>
    </div>
  );
}
