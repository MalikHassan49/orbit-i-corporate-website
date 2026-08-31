import { User } from '../models/User'
import { Order } from '../models/Order'
import { Product } from '../models/Product'
import { Project } from '../models/Project'
import { ContactMessage } from '../models/ContactMessage'

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
}
