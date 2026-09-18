import { useEffect, useRef, useState } from 'react'

export default function Education() {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="education" className="py-24 relative" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center gap-3 mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold">Education</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-border-light to-transparent" />
          </div>

          <div className="max-w-2xl">
            <div className="glass rounded-2xl p-8 hover-lift relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />

              <div className="relative">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 shrink-0">
                    <svg className="w-6 h-6 text-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                    </svg>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">B.E / B.Tech in Computer Science</h3>
                    <p className="text-primary-light font-medium mb-2">Sapthagiri NPS University</p>
                    <p className="text-text-muted text-sm mb-4">Bangalore, India &bull; Expected 2026</p>

                    <div className="flex flex-wrap gap-2">
                      {['Computer Science', 'Artificial Intelligence', 'Full-Stack Development', 'Software Engineering'].map((tag) => (
                        <span key={tag} className="px-2.5 py-1 rounded-full bg-surface-lighter text-text-secondary text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
