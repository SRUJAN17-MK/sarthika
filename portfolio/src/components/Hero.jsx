import { useEffect, useState } from 'react'

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const scrollToProjects = (e) => {
    e.preventDefault()
    document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const scrollToContact = (e) => {
    e.preventDefault()
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-grid">
      <div className="absolute inset-0 bg-glow" />

      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light mb-8">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-text-secondary font-medium">Open to opportunities</span>
          </div>
        </div>

        <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Hi, I&apos;m{' '}
            <span className="gradient-text">Srujan M K</span>
          </h1>
        </div>

        <div className={`transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-lg sm:text-xl md:text-2xl text-text-secondary mb-4 font-light">
            Computer Science Engineer
          </p>
          <p className="text-base sm:text-lg text-text-muted mb-10 font-mono">
            {'>'} AI & Full-Stack Developer _
          </p>
        </div>

        <div className={`transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-text-secondary max-w-2xl mx-auto mb-10 text-sm sm:text-base leading-relaxed">
            Passionate about building intelligent solutions and full-stack applications.
            Currently pursuing B.E in Computer Science with a focus on AI and software engineering.
          </p>
        </div>

        <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <a
            href="#projects"
            onClick={scrollToProjects}
            className="group relative px-8 py-3.5 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-semibold text-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/25"
          >
            <span className="relative z-10">View Projects</span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary-dark to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </a>

          <a
            href="https://github.com/SRUJAN17-MK"
            target="_blank"
            rel="noopener noreferrer"
            className="group px-8 py-3.5 rounded-xl glass-light text-text-primary font-semibold text-sm transition-all duration-300 hover:bg-white/10"
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              View GitHub
            </span>
          </a>

          <a
            href="#contact"
            onClick={scrollToContact}
            className="px-8 py-3.5 rounded-xl border border-border-light text-text-secondary font-semibold text-sm transition-all duration-300 hover:border-primary hover:text-text-primary"
          >
            Contact Me
          </a>
        </div>

        <div className={`mt-16 transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center justify-center gap-6 text-text-muted text-xs font-mono">
            <span>Python</span>
            <span className="w-1 h-1 rounded-full bg-text-muted" />
            <span>JavaScript</span>
            <span className="w-1 h-1 rounded-full bg-text-muted" />
            <span>React</span>
            <span className="w-1 h-1 rounded-full bg-text-muted" />
            <span>AI/ML</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2 text-text-muted">
          <span className="text-xs font-mono">scroll</span>
          <div className="w-5 h-8 rounded-full border border-border-light flex justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-text-muted animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  )
}
