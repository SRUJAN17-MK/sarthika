import { useEffect, useRef, useState } from 'react'

export default function Contact() {
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
    <section id="contact" className="py-24 relative" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center gap-3 mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold">Get In Touch</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-border-light to-transparent" />
          </div>

          <div className="max-w-2xl mx-auto text-center">
            <p className="text-text-secondary text-lg mb-8 leading-relaxed">
              I&apos;m actively looking for internship and entry-level opportunities in software development,
              AI/ML, and full-stack engineering. Let&apos;s connect and discuss how I can contribute to your team.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <a
                href="https://www.linkedin.com/in/srujan-m-k-b8b555"
                target="_blank"
                rel="noopener noreferrer"
                className="glass rounded-xl p-6 hover-lift group transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#0077B5]/10 mb-4 group-hover:bg-[#0077B5]/20 transition-colors">
                  <svg className="w-6 h-6 text-[#0077B5]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </div>
                <h3 className="font-semibold mb-1">LinkedIn</h3>
                <p className="text-text-muted text-sm">Connect with me</p>
              </a>

              <a
                href="https://github.com/SRUJAN17-MK"
                target="_blank"
                rel="noopener noreferrer"
                className="glass rounded-xl p-6 hover-lift group transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 mb-4 group-hover:bg-white/10 transition-colors">
                  <svg className="w-6 h-6 text-text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </div>
                <h3 className="font-semibold mb-1">GitHub</h3>
                <p className="text-text-muted text-sm">View my code</p>
              </a>
            </div>

            <div className="glass rounded-xl p-6">
              <p className="text-text-muted text-sm mb-2">Prefer email?</p>
              <p className="text-text-secondary text-sm">
                Reach out via{' '}
                <a
                  href="https://www.linkedin.com/in/srujan-m-k-b8b555"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-light hover:underline"
                >
                  LinkedIn
                </a>
                {' '}for professional inquiries and opportunities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
