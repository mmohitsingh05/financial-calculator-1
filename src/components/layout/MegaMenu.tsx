import { useState, useEffect, useRef } from 'preact/hooks'
import { categories, getToolsByCategory } from '@/data/tools'
import type { ToolCategory } from '@/data/tools'

const categoryIcons: Record<string, string> = {
  loan: 'building-bank',
  investment: 'trending-up',
  retirement: 'calendar-check',
  'salary-tax': 'file-dollar',
  'general-finance': 'wallet',
  'real-estate': 'home',
}

export function MegaMenu() {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node) &&
          btnRef.current && !btnRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  const [mobileOpen, setMobileOpen] = useState(false)
  const [expandedCat, setExpandedCat] = useState<string | null>(null)

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      {/* Desktop */}
      <div class="hidden md:block relative">
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
            class="absolute right-0 top-full mt-1 w-[720px] bg-card border border-border rounded-xl shadow-[--shadow-xl] z-50 p-6"
          >
            <a
              href="/calculators/"
              class="block text-xs font-medium text-primary hover:underline mb-4"
              onClick={() => setOpen(false)}
            >
              &larr; All Calculators
            </a>
            <div class="grid grid-cols-3 gap-6">
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

      {/* Mobile hamburger */}
      <div class="md:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          class="p-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          aria-label="Open navigation menu"
        >
          <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <use href="/icons.svg#menu-2" />
          </svg>
        </button>

        {mobileOpen && (
          <>
            <div
              class="fixed inset-0 bg-black/40 z-40 animate-fade-in"
              onClick={() => setMobileOpen(false)}
            />
            <div
              class="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-card border-r border-border z-50 shadow-[--shadow-xl] overflow-y-auto"
              style="animation: slide-in-left 0.25s ease-out;"
            >
              <div class="flex items-center justify-between p-4 border-b border-border">
                <a href="/" class="text-lg font-bold text-primary" onClick={() => setMobileOpen(false)}>FinCalc Pro</a>
                <button
                  onClick={() => setMobileOpen(false)}
                  class="p-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  aria-label="Close navigation menu"
                >
                  <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <use href="/icons.svg#x" />
                  </svg>
                </button>
              </div>
              <div class="p-4">
                <a
                  href="/calculators/"
                  class="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-primary/10 text-primary font-medium text-sm mb-4"
                  onClick={() => setMobileOpen(false)}
                >
                  <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <use href="/icons.svg#calculator" />
                  </svg>
                  All Calculators
                </a>
                {categories.map(cat => (
                  <div key={cat.id} class="mb-1">
                    <button
                      onClick={() => setExpandedCat(expandedCat === cat.id ? null : cat.id)}
                      class="flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
                    >
                      <span class="flex items-center gap-2">
                        <svg class="size-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <use href={`/icons.svg#${categoryIcons[cat.id] || 'calculator'}`} />
                        </svg>
                        {cat.name}
                      </span>
                      <svg class="size-4 text-muted-foreground transition-transform duration-200" classList={{ 'rotate-180': expandedCat === cat.id }} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <use href="/icons.svg#chevron-down" />
                      </svg>
                    </button>
                    {expandedCat === cat.id && (
                      <div class="ml-6 mt-1 mb-2 space-y-0.5">
                        {getToolsByCategory(cat.id).map(tool => (
                          <a
                            key={tool.slug}
                            href={`/calculators/${cat.slug}/${tool.slug}/`}
                            class="block px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                            onClick={() => setMobileOpen(false)}
                          >
                            {tool.name}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div class="border-t border-border p-4">
                <a href="/about/" class="block text-xs text-muted-foreground py-1.5 hover:text-foreground">About</a>
                <a href="/contact/" class="block text-xs text-muted-foreground py-1.5 hover:text-foreground">Contact</a>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}