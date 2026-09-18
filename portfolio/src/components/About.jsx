import { useEffect, useRef, useState } from 'react'

export default function About() {
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
    <section id="about" className="py-24 relative" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center gap-3 mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold">About Me</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-border-light to-transparent" />
          </div>

          <div className="grid md:grid-cols-5 gap-12 items-start">
            <div className="md:col-span-3 space-y-6">
              <p className="text-text-secondary leading-relaxed text-base sm:text-lg">
                I&apos;m a Computer Science and Engineering student at Sapthagiri NPS University, Bangalore,
                with a deep passion for building intelligent and impactful software solutions. My interests
                lie at the intersection of <span className="text-primary-light font-medium">Artificial Intelligence</span> and{' '}
                <span className="text-accent font-medium">Full-Stack Development</span>.
              </p>
              <p className="text-text-secondary leading-relaxed text-base sm:text-lg">
                I enjoy tackling complex problems and transforming ideas into functional, user-centric
                applications. From developing AI-powered tools to building end-to-end web applications,
                I am constantly exploring new technologies and pushing the boundaries of what&apos;s possible
                with code.
              </p>
              <p className="text-text-secondary leading-relaxed text-base sm:text-lg">
                Currently, I&apos;m focused on building <span className="text-primary-light font-medium">Sarathi</span> — an
                AI-powered business transport management system — while deepening my knowledge in cloud
                technologies, system design, and backend scalability.
              </p>
            </div>

            <div className="md:col-span-2 space-y-4">
              {[
                { label: 'University', value: 'Sapthagiri NPS University' },
                { label: 'Degree', value: 'B.E/B.Tech CSE' },
                { label: 'Location', value: 'Bangalore, India' },
                { label: 'Graduation', value: '2026' },
                { label: 'Focus', value: 'AI & Full-Stack Dev' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4 py-3 border-b border-border-light/50">
                  <span className="text-text-muted text-sm font-mono w-24 shrink-0">{item.label}</span>
                  <span className="text-text-primary text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
