import { Category } from '../models/Category'
import { ApiError } from '../utils/ApiError'
import { Tag } from '../models/Tag'
import { BlogPost } from '../models/BlogPost'
import { slugify } from '../utils/sanitize'

export const categoryService = {
  async list() {
    return Category.find().sort({ name: 1 })
  },
  async create(data: { name: string; slug?: string; description?: string; seoTitle?: string; metaDescription?: string }) {
    const payload = { ...data, slug: data.slug || slugify(data.name) }
    const existing = await Category.findOne({ slug: payload.slug })
    if (existing) throw ApiError.conflict('A category with this slug already exists')
    return Category.create(payload)
  },
  async update(id: string, data: { name?: string; slug?: string; description?: string; seoTitle?: string; metaDescription?: string }) {
    const category = await Category.findByIdAndUpdate(id, data, { new: true, runValidators: true })
    if (!category) throw ApiError.notFound('Category not found')
    return category
  },
  async remove(id: string) {
    if (await BlogPost.exists({ category: id })) throw ApiError.conflict('Cannot delete a category used by blog posts')
    const category = await Category.findByIdAndDelete(id)
    if (!category) throw ApiError.notFound('Category not found')
  },
}

export const tagService = {
  async list() { return Tag.find().sort({ name: 1 }) },
  async create(data: { name: string; slug?: string }) {
    const payload = { ...data, slug: data.slug || slugify(data.name) }
    if (await Tag.findOne({ slug: payload.slug })) throw ApiError.conflict('A tag with this slug already exists')
    return Tag.create(payload)
  },
  async update(id: string, data: { name?: string; slug?: string }) {
    const tag = await Tag.findByIdAndUpdate(id, data, { new: true, runValidators: true })
    if (!tag) throw ApiError.notFound('Tag not found')
    return tag
  },
  async remove(id: string) {
    await BlogPost.updateMany({ tags: id }, { $pull: { tags: id } })
    const tag = await Tag.findByIdAndDelete(id)
    if (!tag) throw ApiError.notFound('Tag not found')
  },
  async merge(sourceId: string, targetId: string) {
    if (sourceId === targetId) throw ApiError.badRequest('Source and target tags must be different')
    const [source, target] = await Promise.all([Tag.findById(sourceId), Tag.findById(targetId)])
    if (!source || !target) throw ApiError.notFound('Source or target tag not found')
    await BlogPost.updateMany({ tags: sourceId }, { $addToSet: { tags: targetId } })
    await BlogPost.updateMany({ tags: sourceId }, { $pull: { tags: sourceId } })
    await Tag.findByIdAndDelete(sourceId)
    return target
  },
}
