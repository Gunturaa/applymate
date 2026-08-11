import Link from 'next/link'
import { ArrowRight, BarChart3, Bot, FileText, LayoutTemplate, Sparkles, MoveRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary/20">
      <header className="px-6 lg:px-8 h-16 flex items-center justify-between border-b border-border/40 backdrop-blur-md bg-background/50 sticky top-0 z-50">
        <Link className="flex items-center justify-center gap-2" href="#">
          <div className="h-6 w-6 rounded-md bg-primary flex items-center justify-center">
            <span className="font-bold text-xs text-primary-foreground">AM</span>
          </div>
          <span className="font-semibold text-lg tracking-tight">ApplyMate</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" href="/login">
            Log in
          </Link>
          <Link
            className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-full hover:bg-primary/90 transition-colors"
            href="/register"
          >
            Sign up
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center">
        {/* Hero Section */}
        <section className="w-full max-w-5xl px-6 pt-24 pb-16 md:pt-32 md:pb-24 flex flex-col items-center text-center">
          <div className="inline-flex items-center rounded-full border border-border bg-muted/30 px-3 py-1 text-sm mb-8">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
            ApplyMate v1.0 is now live
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-6 text-balance">
            Track applications.<br />
            <span className="text-muted-foreground">Not spreadsheets.</span>
          </h1>
          
          <p className="max-w-[42rem] text-lg sm:text-xl text-muted-foreground mb-10 text-balance">
            The operating system for your job search. Organize your pipeline, prepare for interviews with AI, and measure your progress in one unified workspace.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link
              href="/register"
              className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              Start tracking for free
            </Link>
            <Link
              href="#features"
              className="inline-flex h-12 items-center justify-center rounded-full border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Explore the platform
            </Link>
          </div>
        </section>

        {/* Abstract UI Mockup */}
        <section className="w-full max-w-5xl px-6 pb-24">
          <div className="rounded-xl border border-border/50 bg-muted/10 p-2 shadow-2xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent pointer-events-none" />
            <div className="rounded-lg border border-border/50 bg-background shadow-sm overflow-hidden flex flex-col h-[400px]">
              {/* Header Mockup */}
              <div className="h-12 border-b border-border/50 flex items-center px-4 gap-4 bg-muted/20">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-destructive/40" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/40" />
                  <div className="h-3 w-3 rounded-full bg-green-500/40" />
                </div>
                <div className="h-6 w-48 bg-muted rounded-md" />
              </div>
              {/* Kanban Mockup */}
              <div className="flex-1 p-6 flex gap-4 overflow-hidden">
                <div className="flex-1 bg-muted/20 rounded-lg border border-border/50 flex flex-col p-4 gap-3">
                  <div className="h-4 w-20 bg-muted-foreground/20 rounded" />
                  <div className="h-24 bg-background rounded border border-border/50 shadow-sm p-3">
                    <div className="h-3 w-1/2 bg-primary/20 rounded mb-2" />
                    <div className="h-3 w-3/4 bg-muted rounded" />
                  </div>
                  <div className="h-24 bg-background rounded border border-border/50 shadow-sm p-3">
                    <div className="h-3 w-2/3 bg-primary/20 rounded mb-2" />
                    <div className="h-3 w-1/2 bg-muted rounded" />
                  </div>
                </div>
                <div className="flex-1 bg-muted/20 rounded-lg border border-border/50 flex flex-col p-4 gap-3">
                  <div className="h-4 w-24 bg-muted-foreground/20 rounded" />
                  <div className="h-24 bg-background rounded border border-border/50 shadow-sm p-3">
                    <div className="h-3 w-1/3 bg-primary/20 rounded mb-2" />
                    <div className="h-3 w-full bg-muted rounded" />
                  </div>
                </div>
                <div className="hidden sm:flex flex-1 bg-muted/20 rounded-lg border border-border/50 flex-col p-4 gap-3">
                  <div className="h-4 w-16 bg-muted-foreground/20 rounded" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section id="features" className="w-full max-w-5xl px-6 py-24 border-t border-border/40">
          <div className="mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Built for serious job seekers.</h2>
            <p className="text-muted-foreground mt-2 text-lg">Everything you need to manage your pipeline, with zero bloat.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="md:col-span-2 rounded-2xl border border-border/50 bg-card p-8 shadow-sm flex flex-col justify-between overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="space-y-4 relative z-10">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <LayoutTemplate className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Visual Pipeline</h3>
                <p className="text-muted-foreground">
                  Track where you stand with every company. Our drag-and-drop Kanban board gives you a bird's-eye view of your entire job search process, from applied to offer.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-border/50 bg-card p-8 shadow-sm flex flex-col justify-between overflow-hidden relative group">
              <div className="space-y-4 relative z-10">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">AI Assistant</h3>
                <p className="text-muted-foreground text-sm">
                  Generate tailored interview questions and resume feedback instantly using Gemini AI.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-border/50 bg-card p-8 shadow-sm flex flex-col justify-between overflow-hidden relative group">
              <div className="space-y-4 relative z-10">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Real Analytics</h3>
                <p className="text-muted-foreground text-sm">
                  Understand your conversion rates. See exactly where you drop off in the interview funnel.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="md:col-span-2 rounded-2xl border border-border/50 bg-card p-8 shadow-sm flex flex-col justify-between overflow-hidden relative group">
              <div className="space-y-4 relative z-10">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Document Hub</h3>
                <p className="text-muted-foreground">
                  Keep all your resumes and cover letters in one place. Attach specific versions to specific applications so you never lose track of what you sent.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="w-full max-w-5xl px-6 py-24 mb-12 border-t border-border/40 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-6">Ready to get organized?</h2>
          <Link
            href="/register"
            className="inline-flex h-12 items-center justify-center rounded-full bg-foreground px-8 text-sm font-medium text-background shadow transition-transform hover:scale-105"
          >
            Create your workspace
            <MoveRight className="ml-2 h-4 w-4" />
          </Link>
        </section>
      </main>

      <footer className="py-8 w-full border-t border-border/40 mt-auto">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ApplyMate. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link className="text-sm text-muted-foreground hover:text-foreground" href="#">
              Twitter
            </Link>
            <Link className="text-sm text-muted-foreground hover:text-foreground" href="#">
              GitHub
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
