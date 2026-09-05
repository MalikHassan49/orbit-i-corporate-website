import { useEffect, useRef, useState } from 'react'
import { Button, Card, Input } from '@/components/ui'
import { blogService, taxonomyService } from '@/services/contentService'
import type { BlogPost, Category, Tag } from '@/types'
import { RichTextEditor } from '@/components/editor/RichTextEditor'
import { getApiErrorMessage } from '@/utils/apiError'

export function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [editing, setEditing] = useState<BlogPost | null>(null)
  const [form, setForm] = useState({ title: '', excerpt: '', content: '<p></p>', category: '', tags: '', status: 'draft' as BlogPost['status'], seoTitle: '', seoDescription: '', focusKeyword: '', canonicalUrl: '' })
  const [formError, setFormError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveState, setSaveState] = useState<'idle' | 'saved' | 'failed'>('idle')
  const hydrated = useRef(false)
  const load = async () => { const [p, c, t] = await Promise.all([blogService.listAll(), taxonomyService.categories(), taxonomyService.tags()]); setPosts(p); setCategories(c); setTags(t) }
  useEffect(() => { void load() }, [])
  useEffect(() => {
    if (!editing || !hydrated.current || !form.title.trim()) return
    const timer = window.setTimeout(async () => {
      try {
        setSaveState('idle')
        await blogService.update(editing.id, { ...form, ...(form.seoTitle ? { seoTitle: form.seoTitle } : {}), ...(form.seoDescription ? { seoDescription: form.seoDescription } : {}), ...(form.focusKeyword ? { focusKeyword: form.focusKeyword } : {}), canonicalUrl: form.canonicalUrl || undefined, tags: form.tags.split(',').map((x) => tags.find((t) => t.slug === x.trim() || t.name.toLowerCase() === x.trim().toLowerCase())?.id).filter(Boolean) })
        setSaveState('saved')
      } catch {
        setSaveState('failed')
      }
    }, 1200)
    return () => window.clearTimeout(timer)
  }, [editing, form, tags])
  const save = async () => {
    const title = form.title.trim()
    const excerpt = form.excerpt.trim()
    const content = form.content.trim()
    if (title.length < 3) return setFormError('Title must be at least 3 characters.')
    if (excerpt.length < 10) return setFormError('Excerpt must be at least 10 characters.')
    if (!form.category) return setFormError('Please select a category.')
    if (!content || content === '<p></p>') return setFormError('Please add blog content.')

    setFormError(null)
    setIsSaving(true)
    try {
      const payload = {
        ...form,
        ...(form.seoTitle ? { seoTitle: form.seoTitle } : {}),
        ...(form.seoDescription ? { seoDescription: form.seoDescription } : {}),
        ...(form.focusKeyword ? { focusKeyword: form.focusKeyword } : {}),
        canonicalUrl: form.canonicalUrl || undefined,
        title,
        excerpt,
        content,
        tags: form.tags.split(',').map((x) => tags.find((t) => t.slug === x.trim() || t.name.toLowerCase() === x.trim().toLowerCase())?.id).filter(Boolean) as string[],
      }
      if (editing) await blogService.update(editing.id, payload); else await blogService.create(payload)
      setEditing(null)
      setForm({ title: '', excerpt: '', content: '<p></p>', category: '', tags: '', status: 'draft', seoTitle: '', seoDescription: '', focusKeyword: '', canonicalUrl: '' })
      await load()
    } catch (err) {
      setFormError(getApiErrorMessage(err, editing ? 'Could not update the blog post.' : 'Could not create the blog post.'))
    } finally {
      setIsSaving(false)
    }
  }
  const edit = (post: BlogPost) => { hydrated.current = true; setEditing(post); setFormError(null); setForm({ title: post.title, excerpt: post.excerpt, content: post.content, category: post.category?.id || '', tags: post.tags?.map((t) => t.slug).join(', ') || '', status: post.status, seoTitle: post.seoTitle || '', seoDescription: post.seoDescription || '', focusKeyword: post.focusKeyword || '', canonicalUrl: post.canonicalUrl || '' }) }
  return <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr]"><Card><h2 className="text-xl font-semibold text-[var(--color-text-primary)]">{editing ? 'Edit post' : 'New post'}</h2><div className="mt-5 flex flex-col gap-4"><Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /><Input label="Excerpt" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} /><label className="text-sm text-[var(--color-text-secondary)]">Category<select className="mt-1 w-full rounded border bg-transparent p-2" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}><option value="">Select category</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label><Input label="Tags (comma separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} /><RichTextEditor value={form.content} onChange={(content) => setForm({ ...form, content })} /><Input label="SEO title" value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} /><Input label="Meta description" value={form.seoDescription} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} /><Input label="Focus keyword" value={form.focusKeyword} onChange={(e) => setForm({ ...form, focusKeyword: e.target.value })} /><Input label="Canonical URL" value={form.canonicalUrl} onChange={(e) => setForm({ ...form, canonicalUrl: e.target.value })} /><label className="text-sm text-[var(--color-text-secondary)]">Status<select className="mt-1 w-full rounded border bg-transparent p-2" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as BlogPost['status'] })}><option value="draft">Draft</option><option value="scheduled">Scheduled</option><option value="published">Published</option></select></label>{editing && <p className="text-xs text-[var(--color-text-muted)]">{saveState === 'saved' ? 'Autosaved' : saveState === 'failed' ? 'Autosave failed - use Update post' : 'Autosave enabled'}</p>}{formError && <p className="text-sm text-[var(--color-danger)]">{formError}</p>}<div className="flex gap-2"><Button onClick={() => void save()} isLoading={isSaving}>{editing ? 'Update' : 'Create'} post</Button>{editing && <Button variant="ghost" onClick={() => { setEditing(null); setFormError(null) }}>Cancel</Button>}</div></div></Card><div className="flex flex-col gap-3">{posts.map((post) => <Card key={post.id} className="flex items-center justify-between"><div><h3 className="font-medium text-[var(--color-text-primary)]">{post.title}</h3><p className="text-sm text-[var(--color-text-muted)]">{post.status}</p></div><div className="flex gap-2"><Button size="sm" variant="ghost" onClick={() => edit(post)}>Edit</Button><Button size="sm" variant="ghost" onClick={async () => { await (post.status === 'published' ? blogService.unpublish(post.id) : blogService.publish(post.id)); await load() }}>{post.status === 'published' ? 'Unpublish' : 'Publish'}</Button><Button size="sm" variant="danger" onClick={async () => { if (window.confirm('Delete this post?')) { await blogService.remove(post.id); await load() } }}>Delete</Button></div></Card>)}</div></div>
}
