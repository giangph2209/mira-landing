export default function AdminLoading() {
  return (
    <div className="flex flex-col gap-5" aria-busy>
      <div className="h-8 w-52 animate-pulse rounded-lg bg-[#eceeed]" />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="admin-surface h-24 animate-pulse bg-[#f6f7f7]" />
        ))}
      </div>

      <div className="admin-surface h-72 animate-pulse bg-[#f6f7f7]" />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="admin-surface h-64 animate-pulse bg-[#f6f7f7]" />
        <div className="admin-surface h-64 animate-pulse bg-[#f6f7f7]" />
      </div>
    </div>
  );
}
