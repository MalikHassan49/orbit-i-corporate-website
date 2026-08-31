import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Check, Package } from 'lucide-react'
import { getApiErrorMessage } from '@/utils/apiError'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui'
import { PageLoader } from '@/components/ui/Loader'
import { EmptyState, ErrorState } from '@/components/ui/States'
import { ROUTES } from '@/constants'
import { productService } from '@/services/productService'
import { orderService } from '@/services/orderService'
import { useFetch } from '@/hooks/useFetch'
import { useAuth } from '@/contexts/AuthContext'

const statusTone = { available: 'success', coming_soon: 'warning', archived: 'neutral' } as const
const statusLabel = { available: 'Available', coming_soon: 'Coming soon', archived: 'Archived' } as const

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { data: product, isLoading, error, refetch } = useFetch(() => productService.getBySlug(slug!), [slug])
  const [isOrdering, setIsOrdering] = useState(false)
  const [orderError, setOrderError] = useState<string | null>(null)

  if (isLoading) return <div className="py-24"><PageLoader /></div>

  if (error || !product) {
    return (
      <div className="container-app py-24">
        {error && error !== 'Product not found' ? (
          <ErrorState onRetry={refetch} />
        ) : (
          <EmptyState
            icon={<Package className="size-5" aria-hidden />}
            title="Product not found"
            description="This product may have been renamed or is no longer listed."
          />
        )}
      </div>
    )
  }

  const handleOrder = async () => {
    if (!isAuthenticated) {
      navigate(ROUTES.login, { state: { from: { pathname: ROUTES.productDetail(product.slug) } } })
      return
    }
    setOrderError(null)
    setIsOrdering(true)
    try {
      const order = await orderService.create([{ productId: product.id, quantity: 1 }])
      navigate(ROUTES.clientOrders, { state: { justOrderedId: order.id } })
    } catch (err) {
      setOrderError(getApiErrorMessage(err, 'Could not place the order. Please try again.'))
      setIsOrdering(false)
    }
  }

  return (
    <div className="pb-24">
      <section className="border-b border-[var(--color-border)] py-20">
        <div className="container-app grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <Link to={ROUTES.products} className="text-sm text-[var(--color-text-secondary)] hover:text-primary-300">
              ← All products
            </Link>
            <div className="mt-5 flex items-center gap-2">
              <Badge tone="neutral">{product.category?.name}</Badge>
              <Badge tone={statusTone[product.status]}>{statusLabel[product.status]}</Badge>
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-5xl">
              {product.name}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--color-text-secondary)]">
              {product.description}
            </p>

            <div className="mt-10">
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Features</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {product.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-[var(--color-text-secondary)]">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary-400" aria-hidden />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Card hoverable={false} className="h-fit lg:sticky lg:top-28">
            <p className="text-sm text-[var(--color-text-secondary)]">Starting at</p>
            <p className="mt-1 font-display text-4xl font-semibold text-[var(--color-text-primary)]">
              ${product.price}
              <span className="text-base font-normal text-[var(--color-text-muted)]">/month</span>
            </p>
            <p className="mt-2 text-xs text-[var(--color-text-muted)]">Billed monthly. Cancel anytime.</p>

            {product.status === 'available' ? (
              <>
                <Button className="mt-6 w-full" size="lg" isLoading={isOrdering} onClick={handleOrder}>
                  {isOrdering ? 'Starting order…' : isAuthenticated ? 'Start order' : 'Log in to order'}
                </Button>
                {orderError && <p className="mt-3 text-center text-xs text-[var(--color-danger)]">{orderError}</p>}
                {!orderError && (
                  <p className="mt-3 text-center text-xs text-[var(--color-text-muted)]">
                    {isAuthenticated ? "You'll see this order in your dashboard." : "You'll need an account to complete checkout."}
                  </p>
                )}
              </>
            ) : (
              <Button className="mt-6 w-full" size="lg" variant="outline" disabled>
                Coming soon
              </Button>
            )}
          </Card>
        </div>
      </section>
    </div>
  )
}
