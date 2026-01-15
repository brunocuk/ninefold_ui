// app/work/[slug]/loading.jsx

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0F0F0F] overflow-x-hidden animate-pulse">
      {/* Hero Section Skeleton */}
      <section className="relative min-h-screen flex items-center bg-[#0F0F0F]">
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-20">
          <div className="max-w-5xl">
            {/* Breadcrumb skeleton */}
            <div className="h-4 w-32 bg-[#1a1a1a] rounded mb-8" />

            {/* Category badge skeleton */}
            <div className="h-8 w-24 bg-[#1a1a1a] rounded-full mb-6" />

            {/* Title skeleton */}
            <div className="space-y-4 mb-6">
              <div className="h-12 md:h-16 w-3/4 bg-[#1a1a1a] rounded" />
              <div className="h-12 md:h-16 w-1/2 bg-[#1a1a1a] rounded" />
            </div>

            {/* Tagline skeleton */}
            <div className="h-6 w-2/3 bg-[#1a1a1a] rounded mb-8" />

            {/* Meta info skeleton */}
            <div className="flex flex-wrap gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-3 w-16 bg-[#1a1a1a] rounded" />
                  <div className="h-5 w-24 bg-[#1a1a1a] rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Hero Media Skeleton */}
      <section className="relative py-12 lg:py-16 bg-[#0F0F0F]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="relative aspect-video rounded-2xl bg-[#1a1a1a] border-2 border-[#88939D]/10" />
        </div>
      </section>

      {/* Content Skeleton */}
      <section className="relative py-24 lg:py-32 bg-[#0F0F0F]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-6">
              <div className="h-8 w-32 bg-[#1a1a1a] rounded" />
              <div className="space-y-3">
                <div className="h-4 w-full bg-[#1a1a1a] rounded" />
                <div className="h-4 w-full bg-[#1a1a1a] rounded" />
                <div className="h-4 w-3/4 bg-[#1a1a1a] rounded" />
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-8">
              <div className="p-8 rounded-2xl border-2 border-[#88939D]/10 bg-[#0F0F0F]/50">
                <div className="h-6 w-20 bg-[#1a1a1a] rounded mb-4" />
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-6 w-20 bg-[#1a1a1a] rounded-full" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
