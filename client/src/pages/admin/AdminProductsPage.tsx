import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button, Modal } from '@/components/ui'
import { Input } from '@/components/ui/Input'
import { PageLoader } from '@/components/ui/Loader'
import { ErrorState } from '@/components/ui/States'
import { DataTable, type DataTableColumn } from '@/components/dashboard/DataTable'
import { formatCurrency, slugify } from '@/utils/formatters'
import { getApiErrorMessage } from '@/utils/apiError'
import { productService } from '@/services/productService'
import { categoryService } from '@/services/categoryService'
import { adminService } from '@/services/adminService'
import { useFetch } from '@/hooks/useFetch'
import type { Product } from '@/types'

const statusTone = { available: 'success', coming_soon: 'warning', archived: 'neutral' } as const

const emptyForm = {
  name: '',
  category: '',
  newCategoryName: '',
  shortDescription: '',
  description: '',
  price: '',
  features: '',
  status: 'available',
}

export function AdminProductsPage() {
  const { data: result, isLoading, error, refetch } = useFetch(() => productService.list({ limit: 100 }), [])
  const { data: categories, refetch: refetchCategories } = useFetch(() => categoryService.list(), [])
  const products = result?.items ?? []

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const hasCategories = (categories ?? []).length > 0

  const handleArchive = async (product: Product) => {
    await adminService.archiveProduct(product.id)
    refetch()
  }

  const openModal = () => {
    setForm({ ...emptyForm, category: categories?.[0]?.id ?? '' })
    setFormError(null)
    setIsModalOpen(true)
  }

  const handleCreate = async () => {
    // Resolve category first — either the selected one, or a brand-new one
    // typed inline if none exist yet.
    let categoryId = form.category
    if (!hasCategories) {
      if (!form.newCategoryName.trim()) {
        setFormError('Enter a category name — none exist yet, so create one first.')
        return
      }
      try {
        const newCategory = await categoryService.create({
          name: form.newCategoryName.trim(),
          slug: slugify(form.newCategoryName),
        })
        categoryId = newCategory.id
        refetchCategories()
      } catch (err) {
        setFormError(getApiErrorMessage(err, 'Could not create the category.'))
        return
      }
    }

    if (!form.name || !categoryId || !form.shortDescription || !form.description || !form.price) {
      setFormError('Please fill in all required fields.')
      return
    }
    if (form.shortDescription.trim().length < 10) {
      setFormError('Short description must be at least 10 characters.')
      return
    }
    if (form.description.trim().length < 20) {
      setFormError('Description must be at least 20 characters.')
      return
    }

    setFormError(null)
    setIsSubmitting(true)
    try {
      await adminService.createProduct({
        name: form.name,
        slug: slugify(form.name),
        category: categoryId,
        shortDescription: form.shortDescription,
        description: form.description,
        price: Number(form.price),
        features: form.features.split(',').map((f) => f.trim()).filter(Boolean),
        status: form.status as Product['status'],
      })
      setIsModalOpen(false)
      refetch()
    } catch (err) {
      setFormError(getApiErrorMessage(err, 'Could not create the product.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const columns: DataTableColumn<Product>[] = [
    { header: 'Product', render: (p) => <span className="font-medium">{p.name}</span> },
    { header: 'Category', render: (p) => p.category?.name ?? '—' },
    { header: 'Price', render: (p) => formatCurrency(p.price, p.currency) },
    { header: 'Status', render: (p) => <Badge tone={statusTone[p.status]}>{p.status.replace('_', ' ')}</Badge> },
    {
      header: '',
      render: (p) => (
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={() => handleArchive(p)} disabled={p.status === 'archived'}>
            Archive
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold text-[var(--color-text-primary)]">Products</h2>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">Manage the products listed on the public site.</p>
        </div>
        <Button size="md" onClick={openModal}>
          <Plus className="size-4" aria-hidden /> New product
        </Button>
      </div>
      {isLoading ? (
        <PageLoader />
      ) : error ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <DataTable columns={columns} rows={products} keyField={(p) => p.id} />
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New product">
        <div className="flex flex-col gap-4">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Orbit CRM" />

          {hasCategories ? (
            <div>
              <label className="text-sm font-medium text-[var(--color-text-primary)]">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="mt-1.5 h-11 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background-elevated)] px-3.5 text-sm text-[var(--color-text-primary)] focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
              >
                {(categories ?? []).map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          ) : (
            <Input
              label="Category (new — none exist yet)"
              value={form.newCategoryName}
              onChange={(e) => setForm({ ...form, newCategoryName: e.target.value })}
              placeholder="e.g. Business Tools"
              hint="No categories exist yet — this one will be created automatically."
            />
          )}

          <Input
            label="Short description"
            value={form.shortDescription}
            onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
            placeholder="One line summary shown on the product card (10+ characters)"
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--color-text-primary)]">Description (20+ characters)</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background-elevated)] px-3.5 py-2.5 text-sm text-[var(--color-text-primary)] focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
            />
          </div>
          <Input
            label="Features (comma-separated)"
            value={form.features}
            onChange={(e) => setForm({ ...form, features: e.target.value })}
            placeholder="Pipeline tracking, Custom fields, Team permissions"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price (USD/mo)"
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="29"
            />
            <div>
              <label className="text-sm font-medium text-[var(--color-text-primary)]">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="mt-1.5 h-11 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background-elevated)] px-3.5 text-sm text-[var(--color-text-primary)] focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
              >
                <option value="available">Available</option>
                <option value="coming_soon">Coming soon</option>
              </select>
            </div>
          </div>
          {formError && <p className="text-sm text-[var(--color-danger)]">{formError}</p>}
          <Button onClick={handleCreate} isLoading={isSubmitting} className="mt-2">
            Create product
          </Button>
        </div>
      </Modal>
    </div>
  )
}
