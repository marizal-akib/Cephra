export default function WorkflowLoading() {
  return (
    <div className="space-y-5 p-4 md:p-6 lg:p-8">
      <div className="space-y-2 lg:hidden">
        <div className="h-7 w-52 animate-pulse rounded-md bg-muted" />
        <div className="h-11 w-full animate-pulse rounded-md bg-muted md:w-72" />
        <div className="h-11 w-full animate-pulse rounded-md bg-muted md:w-48" />
      </div>

      <div className="hidden space-y-2 lg:block">
        <div className="h-7 w-48 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-80 animate-pulse rounded-md bg-muted" />
      </div>

      <div className="hidden h-10 w-full animate-pulse rounded-md bg-muted sm:w-[420px] lg:block" />

      <div className="hidden rounded-lg border bg-card p-4 lg:block">
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="h-7 w-28 animate-pulse rounded-full bg-muted" />
          ))}
        </div>
      </div>

      <div className="grid gap-3 lg:hidden md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-lg border bg-card p-4">
            <div className="space-y-3">
              <div className="h-5 w-2/3 animate-pulse rounded-md bg-muted" />
              <div className="h-4 w-1/3 animate-pulse rounded-md bg-muted" />
              <div className="h-7 w-full animate-pulse rounded-md bg-muted" />
              <div className="h-11 w-full animate-pulse rounded-md bg-muted" />
            </div>
          </div>
        ))}
      </div>

      <div className="hidden rounded-lg border bg-card p-4 lg:block">
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-12 animate-pulse rounded-md bg-muted" />
          ))}
        </div>
      </div>
    </div>
  );
}
