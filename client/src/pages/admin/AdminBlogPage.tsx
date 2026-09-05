import { useEffect, useState } from 'react'
import { Button, Card, Input } from '@/components/ui'
import { blogService, taxonomyService } from '@/services/contentService'
import type { BlogPost, Category, Tag } from '@/types'
import { RichTextEditor } from '@/components/editor/RichTextEditor'

export function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [editing, setEditing] = useState<BlogPost | null>(null)
  const [form, setForm] = useState({ title: '', excerpt: '', content: '<p></p>', category: '', tags: '', status: 'draft' as 'draft' | 'published' })
  const load = async () => { const [p, c, t] = await Promise.all([blogService.listAll(), taxonomyService.categories(), taxonomyService.tags()]); setPosts(p); setCategories(c); setTags(t) }
  useEffect(() => { void load() }, [])
  const save = async () => {
    const payload = { ...form, tags: form.tags.split(',').map((x) => tags.find((t) => t.slug === x.trim() || t.name.toLowerCase() === x.trim().toLowerCase())?.id).filter(Boolean) as string[] }
    if (editing) await blogService.update(editing.id, payload); else await blogService.create(payload)
    setEditing(null); setForm({ title: '', excerpt: '', content: '<p></p>', category: '', tags: '', status: 'draft' }); await load()
  }
  const edit = (post: BlogPost) => { setEditing(post); setForm({ title: post.title, excerpt: post.excerpt, content: post.content, category: post.category?.id || '', tags: post.tags?.map((t) => t.slug).join(', ') || '', status: post.status }) }
  return <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr]"><Card><h2 className="text-xl font-semibold text-[var(--color-text-primary)]">{editing ? 'Edit post' : 'New post'}</h2><div className="mt-5 flex flex-col gap-4"><Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /><Input label="Excerpt" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} /><label className="text-sm text-[var(--color-text-secondary)]">Category<select className="mt-1 w-full rounded border bg-transparent p-2" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}><option value="">Select category</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label><Input label="Tags (comma separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} /><RichTextEditor value={form.content} onChange={(content) => setForm({ ...form, content })} /><label className="text-sm text-[var(--color-text-secondary)]">Status<select className="mt-1 w-full rounded border bg-transparent p-2" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as 'draft' | 'published' })}><option value="draft">Draft</option><option value="published">Published</option></select></label><div className="flex gap-2"><Button onClick={() => void save()}>{editing ? 'Update' : 'Create'} post</Button>{editing && <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>}</div></div></Card><div className="flex flex-col gap-3">{posts.map((post) => <Card key={post.id} className="flex items-center justify-between"><div><h3 className="font-medium text-[var(--color-text-primary)]">{post.title}</h3><p className="text-sm text-[var(--color-text-muted)]">{post.status}</p></div><div className="flex gap-2"><Button size="sm" variant="ghost" onClick={() => edit(post)}>Edit</Button><Button size="sm" variant="ghost" onClick={async () => { await (post.status === 'published' ? blogService.unpublish(post.id) : blogService.publish(post.id)); await load() }}>{post.status === 'published' ? 'Unpublish' : 'Publish'}</Button><Button size="sm" variant="danger" onClick={async () => { await blogService.remove(post.id); await load() }}>Delete</Button></div></Card>)}</div></div>
}
