// app/work/loading.jsx

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0F0F0F] overflow-x-hidden animate-pulse">
      {/* Hero Section Skeleton */}
      <section className="relative min-h-[60vh] flex items-center bg-[#0F0F0F]">
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-20">
          <div className="max-w-5xl">
            {/* Label skeleton */}
            <div className="h-8 w-28 bg-[#1a1a1a] rounded-full mb-8" />

            {/* Title skeleton */}
            <div className="space-y-4 mb-8">
              <div className="h-14 md:h-20 w-3/4 bg-[#1a1a1a] rounded" />
              <div className="h-14 md:h-20 w-1/2 bg-[#1a1a1a] rounded" />
            </div>

            {/* Description skeleton */}
            <div className="space-y-3 max-w-3xl">
              <div className="h-5 w-full bg-[#1a1a1a] rounded" />
              <div className="h-5 w-2/3 bg-[#1a1a1a] rounded" />
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section Skeleton */}
      <section className="relative py-12 bg-[#0F0F0F] border-b border-[#88939D]/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-wrap gap-3 justify-center">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 w-24 bg-[#1a1a1a] rounded-xl" />
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid Skeleton */}
      <section className="relative py-24 lg:py-32 bg-[#0F0F0F]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Section Header */}
          <div className="mb-20">
            <div className="h-12 w-64 bg-[#1a1a1a] rounded mb-6" />
          </div>

          {/* Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-2xl border-2 border-[#88939D]/10 overflow-hidden">
                {/* Image skeleton */}
                <div className="aspect-[4/3] bg-[#1a1a1a]" />

                {/* Content skeleton */}
                <div className="p-8 space-y-3">
                  <div className="flex gap-2">
                    <div className="h-6 w-20 bg-[#1a1a1a] rounded" />
                    <div className="h-6 w-12 bg-[#1a1a1a] rounded" />
                  </div>
                  <div className="h-7 w-3/4 bg-[#1a1a1a] rounded" />
                  <div className="h-4 w-full bg-[#1a1a1a] rounded" />
                  <div className="h-4 w-2/3 bg-[#1a1a1a] rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
