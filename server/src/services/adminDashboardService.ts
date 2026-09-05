import { User } from '../models/User'
import { Order } from '../models/Order'
import { Product } from '../models/Product'
import { Project } from '../models/Project'
import { ContactMessage } from '../models/ContactMessage'
import { BlogPost } from '../models/BlogPost'
import { Category } from '../models/Category'
import { Tag } from '../models/Tag'

export const adminDashboardService = {
  async getMetrics() {
    const [totalClients, totalOrders, activeProducts, activeProjects, pendingLeads, revenueAgg] =
      await Promise.all([
        User.countDocuments({ role: 'client' }),
        Order.countDocuments(),
        Product.countDocuments({ status: 'available' }),
        Project.countDocuments({ status: { $in: ['planning', 'in_progress'] } }),
        ContactMessage.countDocuments({ status: 'new' }),
        Order.aggregate([
          { $match: { status: { $in: ['confirmed', 'in_progress', 'completed'] } } },
          { $group: { _id: null, total: { $sum: '$total' } } },
        ]),
      ])

    return {
      totalClients,
      totalOrders,
      activeProducts,
      activeProjects,
      pendingLeads,
      revenue: revenueAgg[0]?.total ?? 0,
    }
  },
  async getCmsMetrics() {
    const [totalPosts, publishedPosts, draftPosts, scheduledPosts, totalCategories, totalTags, totalAuthors, mostViewedPosts, seoIssues] = await Promise.all([
      BlogPost.countDocuments(),
      BlogPost.countDocuments({ status: 'published' }),
      BlogPost.countDocuments({ status: 'draft' }),
      BlogPost.countDocuments({ status: 'scheduled' }),
      Category.countDocuments(),
      Tag.countDocuments(),
      BlogPost.distinct('author').then((authors) => authors.length),
      BlogPost.find({ status: 'published' }).sort({ views: -1 }).limit(5).select('title slug views'),
      BlogPost.countDocuments({ $or: [{ seoTitle: { $in: [null, ''] } }, { seoDescription: { $in: [null, ''] } }] }),
    ])
    return { totalPosts, publishedPosts, draftPosts, scheduledPosts, totalCategories, totalTags, totalAuthors, mostViewedPosts, seoIssues, analytics: { provider: 'application', visitors: null, pageViews: null, organicTraffic: null } }
  },
}
