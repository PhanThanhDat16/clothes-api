import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { Order } from '@/models/order.model'

export const dashboardController = {
  getDashboard: asyncHandler(async (req: Request, res: Response) => {
    const today = new Date()
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0)

    // ==== 1. Tổng tiền ====
    const todayOrder = await Order.aggregate([
      { $match: { createdAt: { $gte: startOfToday } } },
      { $group: { _id: null, total: { $sum: '$finalTotal' } } }
    ])

    const thisMonth = await Order.aggregate([
      { $match: { createdAt: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: '$finalTotal' } } }
    ])

    const lastMonth = await Order.aggregate([
      { $match: { createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
      { $group: { _id: null, total: { $sum: '$finalTotal' } } }
    ])

    // ==== 2. Thống kê đơn ====
    const totalOrder = await Order.countDocuments()
    const orderPending = await Order.countDocuments({ status: 'pending' })
    const orderCancelled = await Order.countDocuments({ status: 'cancelled' })
    const orderSuccess = await Order.countDocuments({ status: 'paid' })

    // ==== 3. Chart ====

    // Line chart: thống kê theo từng ngày trong tháng hiện tại
    const lineChartAgg = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth, $lte: today }
        }
      },
      {
        $group: {
          _id: { $dayOfMonth: '$createdAt' },
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$finalTotal' }
        }
      },
      { $sort: { _id: 1 } }
    ])

    const daysInMonth = Array.from(
      { length: new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate() },
      (_, i) => `${i + 1}`
    )

    const totalOrderData = daysInMonth.map((day) => {
      const found = lineChartAgg.find((d) => d._id === parseInt(day))
      return found ? found.totalOrders : 0
    })

    const sumFinalTotalData = daysInMonth.map((day) => {
      const found = lineChartAgg.find((d) => d._id === parseInt(day))
      return found ? found.totalRevenue : 0
    })

    // Doughnut chart: thống kê theo status
    const doughnutAgg = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ])

    const defaultLabelsDoughnutChart = ['pending', 'cancelled', 'paid']
    const doughnutChartData = defaultLabelsDoughnutChart.map((status) => {
      const found = doughnutAgg.find((d) => d._id === status)
      return found ? found.count : 0
    })

    // ==== Response ====
    res.json({
      message: 'get dashboard successfully',
      data: {
        summary: {
          todayOrder: todayOrder[0]?.total || 0,
          thisMonth: thisMonth[0]?.total || 0,
          lastMonth: lastMonth[0]?.total || 0
        },
        orders: {
          totalOrder,
          orderPending,
          orderCancelled,
          orderSuccess
        },
        charts: {
          lineChart: {
            labels: daysInMonth,
            datasets: {
              totalOrderData,
              sumFinalTotalData
            }
          },
          doughnutChart: {
            labels: defaultLabelsDoughnutChart,
            datasets: doughnutChartData
          }
        }
      }
    })
  })
}
