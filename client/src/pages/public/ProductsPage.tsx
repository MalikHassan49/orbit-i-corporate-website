import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, ArrowRight, Package } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { PageLoader } from '@/components/ui/Loader'
import { EmptyState, ErrorState } from '@/components/ui/States'
import { ROUTES } from '@/constants'
import { productService } from '@/services/productService'
import { categoryService } from '@/services/categoryService'
import { useFetch } from '@/hooks/useFetch'
import { SEO } from '@/components/seo/SEO'
import { PAGE_SEO } from '@/config/seo'

const statusTone = { available: 'success', coming_soon: 'warning', archived: 'neutral' } as const
const statusLabel = { available: 'Available', coming_soon: 'Coming soon', archived: 'Archived' } as const

export function ProductsPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string>('all')

  const { data: categories } = useFetch(() => categoryService.list(), [])
  const {
    data: result,
    isLoading,
    error,
    refetch,
  } = useFetch(
    () =>
      productService.list({
        search: query || undefined,
        category: category === 'all' ? undefined : category,
      }),
    [query, category]
  )

  const products = result?.items ?? []

  return (
    <>
      <SEO {...PAGE_SEO.products} />
      <div className="pb-24">
      <section className="border-b border-[var(--color-border)] py-20">
        <div className="container-app">
          <Badge tone="primary" className="mb-5">Products</Badge>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-5xl">
            Products we've built and maintain
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-text-secondary)]">
            Alongside client work, ORBIT-I builds and maintains its own software products.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-app">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[var(--color-text-muted)]" aria-hidden />
              <Input
                placeholder="Search products…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10"
                aria-label="Search products"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCategory('all')}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  category === 'all'
                    ? 'border-primary-500/50 bg-primary-500/10 text-primary-300'
                    : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-primary-500/30'
                }`}
              >
                All products
              </button>
              {(categories ?? []).map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    category === c.id
                      ? 'border-primary-500/50 bg-primary-500/10 text-primary-300'
                      : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-primary-500/30'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="mt-12"><PageLoader /></div>
          ) : error ? (
            <div className="mt-12"><ErrorState onRetry={refetch} /></div>
          ) : products.length === 0 ? (
            <div className="mt-12">
              <EmptyState
                icon={<Package className="size-5" aria-hidden />}
                title="No products match your search"
                description="Try a different keyword or clear the category filter."
              />
            </div>
          ) : (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <Link key={product.id} to={ROUTES.productDetail(product.slug)}>
                  <Card className="flex h-full flex-col gap-4">
                    <div className="flex items-start justify-between">
                      <Badge tone="neutral">{product.category?.name}</Badge>
                      <Badge tone={statusTone[product.status]}>{statusLabel[product.status]}</Badge>
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-[var(--color-text-primary)]">
                        {product.name}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                        {product.shortDescription}
                      </p>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <span className="font-display text-lg font-semibold text-[var(--color-text-primary)]">
                        ${product.price}
                        <span className="text-sm font-normal text-[var(--color-text-muted)]">/mo</span>
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-primary-400">
                        Details <ArrowRight className="size-3.5" aria-hidden />
                      </span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
    </>
  )
}
