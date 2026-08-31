import { z } from 'zod'

export const createProductSchema = z.object({
  name: z.string().trim().min(2).max(160),
  slug: z.string().trim().toLowerCase().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens'),
  category: z.string().min(1, 'Category is required'),
  shortDescription: z.string().trim().min(10).max(240),
  description: z.string().trim().min(20),
  images: z.array(z.string().url()).default([]),
  features: z.array(z.string()).default([]),
  price: z.number().min(0),
  currency: z.string().default('USD'),
  status: z.enum(['available', 'coming_soon', 'archived']).default('available'),
})

export const updateProductSchema = createProductSchema.partial()

export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1).default(1),
      })
    )
    .min(1, 'At least one item is required'),
})

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']),
})

export const contactMessageSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email(),
  phone: z.string().trim().optional(),
  company: z.string().trim().optional(),
  subject: z.string().trim().min(3).max(160),
  message: z.string().trim().min(10).max(5000),
})

export const jobApplicationSchema = z.object({
  jobId: z.string().min(1, 'Job is required'),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email(),
  phone: z.string().trim().optional(),
  resumeUrl: z.string().url('A resume link is required'),
  coverLetter: z.string().trim().max(5000).optional(),
  linkedin: z.string().trim().optional(),
  portfolio: z.string().trim().optional(),
})
