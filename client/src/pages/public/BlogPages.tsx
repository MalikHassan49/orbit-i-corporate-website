import { Link, useParams } from 'react-router-dom'
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
  const { data, isLoading, error, refetch } = useFetch(() => blogService.list(), [])
  return <><SEO title="Insights | ORBIT-I" description="Engineering insights from ORBIT-I." path={ROUTES.blog} />
    <div className="container-app py-20"><h1 className="text-4xl font-semibold text-[var(--color-text-primary)]">Insights</h1>
      <p className="mt-4 text-[var(--color-text-secondary)]">Practical ideas for building reliable digital products.</p>
      <div className="mt-10">{isLoading ? <PageLoader /> : error ? <ErrorState onRetry={refetch} /> : !data?.items.length ? <EmptyState icon={<FileText className="size-5" />} title="No posts published yet" /> :
        <div className="grid gap-6 sm:grid-cols-2">{data.items.map((post) => <Link to={ROUTES.blogDetail(post.slug)} key={post.id}><Card className="h-full"><Badge tone="primary">{post.category?.name}</Badge><h2 className="mt-4 text-xl font-semibold text-[var(--color-text-primary)]">{post.title}</h2><p className="mt-3 text-sm text-[var(--color-text-secondary)]">{post.excerpt}</p><div className="mt-5 flex flex-wrap gap-2">{post.tags?.map((tag) => <Badge tone="neutral" key={tag.id}>{tag.name}</Badge>)}</div></Card></Link>)}</div>}</div>
    </div></>
}

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: post, isLoading, error, refetch } = useFetch(() => blogService.getBySlug(slug!), [slug])
  if (isLoading) return <div className="py-24"><PageLoader /></div>
  if (error || !post) return <div className="container-app py-24"><ErrorState onRetry={refetch} /></div>
  return <article className="container-app py-20"><SEO title={post.seoTitle || `${post.title} | ORBIT-I`} description={post.seoDescription || post.excerpt} path={ROUTES.blogDetail(post.slug)} image={post.coverImage} jsonLd={[buildArticleJsonLd(post), buildBreadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Blog', path: ROUTES.blog }, { name: post.title, path: ROUTES.blogDetail(post.slug) }])]} />
    <Link to={ROUTES.blog} className="text-sm text-[var(--color-text-secondary)]">← All insights</Link>
    <Badge tone="primary" className="mt-6">{post.category?.name}</Badge><h1 className="mt-5 max-w-4xl text-4xl font-semibold text-[var(--color-text-primary)] sm:text-5xl">{post.title}</h1>
    <p className="mt-5 max-w-2xl text-lg text-[var(--color-text-secondary)]">{post.excerpt}</p>
    <div className="prose prose-invert mt-12 max-w-3xl text-[var(--color-text-secondary)]" dangerouslySetInnerHTML={{ __html: post.content }} />
  </article>
}
