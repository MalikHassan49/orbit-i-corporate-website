import type { ReactNode } from 'react'
import { EmptyState } from '@/components/ui/States'

export interface DataTableColumn<T> {
  header: string
  render: (row: T) => ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  rows: T[]
  keyField: (row: T) => string
  emptyTitle?: string
  emptyDescription?: string
}

export function DataTable<T>({ columns, rows, keyField, emptyTitle, emptyDescription }: DataTableProps<T>) {
  if (rows.length === 0) {
    return <EmptyState title={emptyTitle ?? 'Nothing here yet'} description={emptyDescription} />
  }

  return (
    <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)]">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)] bg-[var(--color-background-elevated)]">
            {columns.map((col) => (
              <th key={col.header} className="whitespace-nowrap px-4 py-3 font-medium text-[var(--color-text-secondary)]">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={keyField(row)} className="border-b border-[var(--color-border)] last:border-0 hover:bg-white/[0.02]">
              {columns.map((col) => (
                <td key={col.header} className={`px-4 py-3.5 text-[var(--color-text-primary)] ${col.className ?? ''}`}>
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
