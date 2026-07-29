import { useState, useEffect, useRef } from 'preact/hooks'
import { render } from 'preact'
import { categories, getToolsByCategory } from '@/data/tools'

const categoryIcons: Record<string, string> = {
  loan: 'building-bank',
  investment: 'trending-up',
  retirement: 'calendar-check',
  'salary-tax': 'file-dollar',
  'general-finance': 'wallet',
  'real-estate': 'home',
}

interface DrawerProps {
  expandedCat: string | null
  onToggleCat: (id: string | null) => void
  onClose: () => void
}

function DrawerContent({ expandedCat, onToggleCat, onClose }: DrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const drawer = drawerRef.current
    if (!drawer) return
    const focusable = drawer.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    first?.focus()
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus() }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus() }
      }
    }
    drawer.addEventListener('keydown', handleTab)
    return () => drawer.removeEventListener('keydown', handleTab)
  }, [])

  return (
    <>
      <div
        class="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] animate-fade-in"
        onClick={onClose}
      />
      <div
        ref={drawerRef}
        class="fixed inset-y-0 left-0 w-80 md:w-96 max-w-[85vw] bg-card border-r border-border z-[110] shadow-[--shadow-xl] overflow-y-auto overscroll-contain"
        style="animation: slide-in-left 0.3s cubic-bezier(0.16, 1, 0.3, 1);"
        role="dialog"
        aria-modal="true"
        aria-label="Calculators menu"
      >
        <div class="sticky top-0 bg-card/95 backdrop-blur-sm z-10 flex items-center justify-between px-4 h-14 border-b border-border">
          <a href="/" class="text-lg font-bold text-primary" onClick={onClose}>
            FinCalc Pro
          </a>
          <button
            onClick={onClose}
            class="flex items-center justify-center size-10 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors active:bg-muted/80 cursor-pointer"
            aria-label="Close navigation menu"
          >
            <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="px-4 pt-4">
          <a
            href="/calculators/"
            class="flex items-center gap-2.5 px-3 h-11 rounded-lg bg-primary/10 text-primary font-medium text-sm transition-colors active:bg-primary/15"
            onClick={onClose}
          >
            <svg class="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <use href="/icons.svg#calculator" />
            </svg>
            All Calculators
          </a>
        </div>

        <div class="px-4 py-3 space-y-0.5">
          {categories.map(cat => {
            const tools = getToolsByCategory(cat.id)
            const isOpen = expandedCat === cat.id
            return (
              <div key={cat.id}>
                <button
                  onClick={() => onToggleCat(isOpen ? null : cat.id)}
                  class="flex items-center justify-between w-full h-11 px-3 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors active:bg-muted/80 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span class="flex items-center gap-2.5 min-w-0">
                    <svg class="size-4 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <use href={`/icons.svg#${categoryIcons[cat.id] || 'calculator'}`} />
                    </svg>
                    <span class="truncate">{cat.name}</span>
                  </span>
                  <svg
                    class="size-4 shrink-0 text-muted-foreground transition-transform duration-200"
                    classList={{ 'rotate-180': isOpen }}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="m6 9l6 6l6-6" />
                  </svg>
                </button>
                <div
                  class="overflow-hidden transition-all duration-200 ease-out"
                  style={{
                    maxHeight: isOpen ? `${tools.length * 48}px` : '0px',
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <div class="ml-2 pl-3 border-l-2 border-border/50 mt-0.5 mb-1.5 space-y-0.5">
                    {tools.map(tool => (
                      <a
                        key={tool.slug}
                        href={`/calculators/${cat.slug}/${tool.slug}/`}
                        class="flex items-center h-10 px-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors active:bg-muted/80"
                        onClick={onClose}
                      >
                        {tool.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div class="border-t border-border px-4 py-3 mt-2 space-y-0.5">
          <a
            href="/about/"
            class="flex items-center h-11 px-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors active:bg-muted/80"
            onClick={onClose}
          >
            About
          </a>
          <a
            href="/contact/"
            class="flex items-center h-11 px-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors active:bg-muted/80"
            onClick={onClose}
          >
            Contact
          </a>
        </div>
      </div>
    </>
  )
}

export function MegaMenu() {
  const [open, setOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [expandedCat, setExpandedCat] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const portalRef = useRef<HTMLDivElement | null>(null)

  // Desktop: click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node) &&
          btnRef.current && !btnRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  // Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      setMobileOpen(false)
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  // Body scroll lock — also prevent iOS overscroll
  useEffect(() => {
    if (mobileOpen) {
      const prevOverflow = document.body.style.overflow
      const prevPosition = document.body.style.position
      const prevWidth = document.body.style.width
      const prevTop = document.body.style.top
      const scrollY = window.scrollY

      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
      document.body.style.top = `-${scrollY}px`

      return () => {
        document.body.style.overflow = prevOverflow
        document.body.style.position = prevPosition
        document.body.style.width = prevWidth
        document.body.style.top = prevTop
        window.scrollTo(0, scrollY)
      }
    }
  }, [mobileOpen])

  // Portal mobile drawer to document.body
  useEffect(() => {
    if (!mobileOpen) {
      if (portalRef.current) {
        render(null, portalRef.current)
        portalRef.current.remove()
        portalRef.current = null
      }
      return
    }

    const container = document.createElement('div')
    portalRef.current = container
    document.body.appendChild(container)

    render(
      <DrawerContent
        expandedCat={expandedCat}
        onToggleCat={setExpandedCat}
        onClose={() => setMobileOpen(false)}
      />,
      container
    )

    return () => {
      if (portalRef.current) {
        render(null, portalRef.current)
        portalRef.current.remove()
        portalRef.current = null
      }
    }
  }, [mobileOpen, expandedCat])

  return (
    <>
      {/* Desktop — lg and up */}
      <div class="hidden lg:block relative">
        <button
          ref={btnRef}
          onClick={() => setOpen(!open)}
          class="flex items-center gap-1 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted cursor-pointer"
          aria-haspopup="true"
          aria-expanded={open}
        >
          Calculators
          <svg class="size-4 transition-transform duration-200" classList={{ 'rotate-180': open }} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="m6 9l6 6l6-6" />
          </svg>
        </button>

        {open && (
          <div
            ref={menuRef}
            class="absolute right-0 top-full mt-1 w-[90vw] max-w-[720px] bg-card border border-border rounded-xl shadow-[--shadow-xl] z-50 p-5 lg:p-6 max-h-[80vh] overflow-y-auto animate-scale-in"
          >
            <a
              href="/calculators/"
              class="block text-xs font-medium text-primary hover:underline mb-4"
              onClick={() => setOpen(false)}
            >
              &larr; All Calculators
            </a>
            <div class="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {categories.map(cat => (
                <div key={cat.id}>
                  <a
                    href={`/calculators/${cat.slug}/`}
                    class="flex items-center gap-2 text-sm font-semibold text-foreground mb-2 hover:text-primary transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    <svg class="size-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <use href={`/icons.svg#${categoryIcons[cat.id] || 'calculator'}`} />
                    </svg>
                    {cat.name}
                  </a>
                  <ul class="space-y-1">
                    {getToolsByCategory(cat.id).map(tool => (
                      <li key={tool.slug}>
                        <a
                          href={`/calculators/${cat.slug}/${tool.slug}/`}
                          class="block text-xs text-muted-foreground hover:text-foreground hover:underline transition-colors py-0.5"
                          onClick={() => setOpen(false)}
                        >
                          {tool.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile & Tablet toggle — below lg (drawer is portaled to body) */}
      <div class="lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          class="flex items-center gap-1.5 px-2 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted active:scale-95 active:bg-muted/80 cursor-pointer"
          aria-label="Open calculators menu"
          aria-haspopup="true"
          aria-expanded={mobileOpen}
        >
          <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
          <span class="hidden sm:inline text-sm">Calculators</span>
        </button>
      </div>
    </>
  )
}
