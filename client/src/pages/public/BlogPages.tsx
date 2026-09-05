import { Link, useParams, useSearchParams } from 'react-router-dom'
import { FileText } from 'lucide-react'
import { Badge, Card } from '@/components/ui'
import { EmptyState, ErrorState } from '@/components/ui/States'
import { PageLoader } from '@/components/ui/Loader'
import { SEO } from '@/components/seo/SEO'
import { buildArticleJsonLd, buildBreadcrumbJsonLd } from '@/config/seo'
import { ROUTES } from '@/constants'
import { blogService } from '@/services/contentService'
import { useFetch } from '@/hooks/useFetch'

export function BlogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get('search') || undefined
  const { data, isLoading, error, refetch } = useFetch(() => blogService.list({ search }), [search])
  return <><SEO title="Insights | ORBIT-I" description="Engineering insights from ORBIT-I." path={ROUTES.blog} />
    <div className="container-app py-20"><h1 className="text-4xl font-semibold text-[var(--color-text-primary)]">Insights</h1>
      <p className="mt-4 text-[var(--color-text-secondary)]">Practical ideas for building reliable digital products.</p>
      <form className="mt-6 flex max-w-xl gap-2" onSubmit={(event) => { event.preventDefault(); const value = new FormData(event.currentTarget).get('search')?.toString() || ''; setSearchParams(value ? { search: value } : {}) }}><input name="search" defaultValue={search} placeholder="Search insights" className="min-w-0 flex-1 rounded border bg-transparent px-3 py-2 text-sm" /><button className="rounded bg-primary-500 px-4 py-2 text-sm text-white" type="submit">Search</button></form>
      <div className="mt-10">{isLoading ? <PageLoader /> : error ? <ErrorState onRetry={refetch} /> : !data?.items.length ? <EmptyState icon={<FileText className="size-5" />} title="No posts published yet" /> :
        <div className="grid gap-6 sm:grid-cols-2">{data.items.map((post) => <Link to={ROUTES.blogDetail(post.slug)} key={post.id}><Card className="h-full"><Badge tone="primary">{post.category?.name}</Badge><h2 className="mt-4 text-xl font-semibold text-[var(--color-text-primary)]">{post.title}</h2><p className="mt-3 text-sm text-[var(--color-text-secondary)]">{post.excerpt}</p><div className="mt-5 flex flex-wrap gap-2">{post.tags?.map((tag) => <Badge tone="neutral" key={tag.id}>{tag.name}</Badge>)}</div></Card></Link>)}</div>}</div>
    </div></>
}

export function BlogTaxonomyPage({ type }: { type: 'category' | 'tag' }) {
  const { slug } = useParams<{ slug: string }>()
  const { data, isLoading, error, refetch } = useFetch(() => blogService.list(type === 'category' ? { category: slug } : { tag: slug }), [type, slug])
  return <><SEO title={`${slug} | Insights | ORBIT-I`} description={`ORBIT-I insights tagged ${slug}.`} path={`/blog/${type}/${slug}`} /><div className="container-app py-20"><Link to={ROUTES.blog} className="text-sm text-[var(--color-text-secondary)]">← All insights</Link><h1 className="mt-5 text-4xl font-semibold text-[var(--color-text-primary)]">{slug}</h1>{isLoading ? <PageLoader /> : error ? <ErrorState onRetry={refetch} /> : <div className="mt-10 grid gap-6 sm:grid-cols-2">{data?.items.map((post) => <Link to={ROUTES.blogDetail(post.slug)} key={post.id}><Card className="h-full"><h2 className="text-xl font-semibold text-[var(--color-text-primary)]">{post.title}</h2><p className="mt-3 text-sm text-[var(--color-text-secondary)]">{post.excerpt}</p></Card></Link>)}</div>}</div></>
}

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: post, isLoading, error, refetch } = useFetch(() => blogService.getBySlug(slug!), [slug])
  if (isLoading) return <div className="py-24"><PageLoader /></div>
  if (error || !post) return <div className="container-app py-24"><ErrorState onRetry={refetch} /></div>
  return <article className="container-app py-20"><SEO title={post.seoTitle || `${post.title} | ORBIT-I`} description={post.seoDescription || post.excerpt} path={ROUTES.blogDetail(post.slug)} canonicalUrl={post.canonicalUrl} robots={post.robots} image={post.ogImage || post.coverImage} noindex={post.robots?.startsWith('noindex')} keywords={[post.focusKeyword, ...(post.secondaryKeywords || [])].filter(Boolean).join(',')} jsonLd={[buildArticleJsonLd(post), buildBreadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Blog', path: ROUTES.blog }, { name: post.title, path: ROUTES.blogDetail(post.slug) }])]} />
    <Link to={ROUTES.blog} className="text-sm text-[var(--color-text-secondary)]">← All insights</Link>
    <Badge tone="primary" className="mt-6">{post.category?.name}</Badge><h1 className="mt-5 max-w-4xl text-4xl font-semibold text-[var(--color-text-primary)] sm:text-5xl">{post.title}</h1>
    <p className="mt-5 max-w-2xl text-lg text-[var(--color-text-secondary)]">{post.excerpt}</p>
    <div className="prose prose-invert mt-12 max-w-3xl text-[var(--color-text-secondary)]" dangerouslySetInnerHTML={{ __html: post.content }} />
  </article>
}
