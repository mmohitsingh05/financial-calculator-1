import { useState } from 'preact/hooks'

interface ToolData {
  name: string
  slug: string
  category: string
  tier: string
  description: string
}

interface CategoryData {
  id: string
  name: string
  slug: string
}

interface Props {
  tools: ToolData[]
  categories: CategoryData[]
}

const categoryIcons: Record<string, string> = {
  loan: 'building-bank',
  investment: 'trending-up',
  retirement: 'calendar-check',
  'salary-tax': 'file-dollar',
  'general-finance': 'wallet',
  'real-estate': 'home',
}

function getCategoryName(catSlug: string, categories: CategoryData[]): string {
  return categories.find(c => c.slug === catSlug)?.name || catSlug
}

export function CalculatorDirectory({ tools, categories }: Props) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const filtered = tools.filter(t => {
    const matchesSearch = search === '' || t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = activeCategory === 'all' || t.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div>
      <div class="flex flex-col sm:flex-row gap-4 mb-8">
        <div class="relative flex-1">
          <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <use href="/icons.svg#search" />
          </svg>
          <input
            type="text"
            placeholder="Search calculators..."
            value={search}
            onInput={(e: any) => setSearch(e.currentTarget.value)}
            class="w-full h-10 rounded-xl border border-input/80 bg-muted/70 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground hover:bg-muted/90 hover:border-input focus:outline-none focus:ring-4 focus:ring-primary/15 focus:border-primary focus:bg-background transition-all duration-200"
          />
        </div>
      </div>

      <div class="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveCategory('all')}
          class={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
            activeCategory === 'all'
              ? 'bg-primary text-primary-foreground shadow-[--shadow-sm] ring-1 ring-primary/30'
              : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground shadow-[--shadow-xs]'
          }`}
        >
          All
          <span class={`text-xs px-1.5 py-0.5 rounded-full ${
            activeCategory === 'all' ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-background text-muted-foreground'
          }`}>{tools.length}</span>
        </button>
        {categories.map(cat => {
          const count = tools.filter(t => t.category === cat.slug).length
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              class={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-primary text-primary-foreground shadow-[--shadow-sm] ring-1 ring-primary/30'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground shadow-[--shadow-xs]'
              }`}
            >
              <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <use href={`/icons.svg#${categoryIcons[cat.id] || 'calculator'}`} />
              </svg>
              <span class="hidden sm:inline">{cat.name.replace(' Calculators', '').replace(' & Savings', '').replace(' & Housing', '').replace(' & Tax', '')}</span>
              <span class="sm:hidden">{cat.name.charAt(0)}</span>
              <span class={`text-xs px-1.5 py-0.5 rounded-full ${
                activeCategory === cat.id ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-background text-muted-foreground'
              }`}>{count}</span>
            </button>
          )
        })}
      </div>

      {filtered.length === 0 ? (
        <div class="text-center py-20">
          <svg class="size-12 text-muted-foreground/40 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <use href="/icons.svg#search" />
          </svg>
          <p class="text-lg text-muted-foreground font-medium">No calculators found</p>
          <p class="text-sm text-muted-foreground mt-1">Try a different search term or category</p>
          <button
            onClick={() => { setSearch(''); setActiveCategory('all') }}
            class="mt-4 px-4 py-2 rounded-xl border border-border/80 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200 cursor-pointer"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(tool => (
            <a
              key={tool.slug}
              href={`/calculators/${tool.category}/${tool.slug}/`}
              class="group relative p-5 rounded-xl border border-border/80 bg-card shadow-[--shadow-xs] hover:border-primary/25 hover:shadow-[--shadow-md] hover:-translate-y-0.5 transition-all duration-300"
            >
              <div class="flex items-start justify-between gap-2 mb-3">
                <span class="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/15 transition-colors">
                  <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <use href={`/icons.svg#${categoryIcons[tool.category] || 'calculator'}`} />
                  </svg>
                </span>
                {tool.tier === 'high' && (
                  <span class="inline-flex items-center gap-1 text-xs font-medium text-accent bg-accent/15 border border-accent/20 px-2 py-0.5 rounded-full shrink-0">
                    <svg class="size-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="m12 17.75l-6.172 3.245l1.179-6.873l-5-4.867l6.9-1l3.086-6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"/>
                    </svg>
                    Popular
                  </span>
                )}
              </div>
              <h3 class="font-semibold text-foreground group-hover:text-primary transition-colors text-sm leading-snug">
                {tool.name}
              </h3>
              <p class="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">{tool.description}</p>
              <div class="mt-4 flex items-center gap-1.5 text-muted-foreground/60 group-hover:text-muted-foreground/80 transition-colors">
                <svg class="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <use href={`/icons.svg#${categoryIcons[tool.category] || 'calculator'}`} />
                </svg>
                <span class="text-xs">{getCategoryName(tool.category, categories)}</span>
              </div>
            </a>
          ))}
        </div>
      )}

      <div class="flex items-center justify-center gap-2 mt-10">
        <span class="h-px flex-1 max-w-24 bg-border/60" />
        <p class="text-xs text-muted-foreground">
          Showing <strong class="text-foreground">{filtered.length}</strong> of <strong class="text-foreground">{tools.length}</strong> calculators
        </p>
        <span class="h-px flex-1 max-w-24 bg-border/60" />
      </div>
    </div>
  )
}