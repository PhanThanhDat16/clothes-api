/* eslint-disable prefer-const */
import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { Order } from '@/models/order.model'

export const dashboardController = {
  getDashboard: asyncHandler(async (req: Request, res: Response) => {
    const { startDate, endDate } = req.query

    const today = new Date()
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

    // Nếu có filter thì dùng khoảng thời gian đó, nếu không thì dùng mặc định
    const filterStart = startDate ? new Date(startDate as string) : startOfMonth
    const filterEnd = endDate ? new Date(endDate as string) : today

    // === TOTAL PRICE ===
    const totalInRange = await Order.aggregate([
      {
        $match: { createdAt: { $gte: filterStart, $lte: filterEnd }, status: 'paid' }
      },
      { $group: { _id: null, total: { $sum: '$finalTotal' } } }
    ])

    const todayOrder = await Order.aggregate([
      { $match: { createdAt: { $gte: startOfToday }, status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$finalTotal' } } }
    ])

    const thisMonth = await Order.aggregate([
      { $match: { createdAt: { $gte: startOfMonth }, status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$finalTotal' } } }
    ])

    // === COUNT ORDERS BY STATUS ===
    const totalOrder = await Order.countDocuments({ createdAt: { $gte: filterStart, $lte: filterEnd } })
    const orderPending = await Order.countDocuments({
      status: 'pending',
      createdAt: { $gte: filterStart, $lte: filterEnd }
    })
    const orderCancelled = await Order.countDocuments({
      status: 'cancelled',
      createdAt: { $gte: filterStart, $lte: filterEnd }
    })
    const orderConfirmed = await Order.countDocuments({
      status: 'confirmed',
      createdAt: { $gte: filterStart, $lte: filterEnd }
    })
    const orderPaid = await Order.countDocuments({ status: 'paid', createdAt: { $gte: filterStart, $lte: filterEnd } })

    // === LINE CHART ===
    const lineChartAgg = await Order.aggregate([
      {
        $match: { createdAt: { $gte: filterStart, $lte: filterEnd } }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt',
              timezone: 'Asia/Ho_Chi_Minh'
            }
          },
          totalOrders: { $sum: 1 }, // đếm tất cả đơn
          totalRevenue: {
            $sum: {
              $cond: [{ $eq: ['$status', 'paid'] }, '$finalTotal', 0] // chỉ cộng revenue nếu paid
            }
          }
        }
      },
      { $sort: { _id: 1 } }
    ])

    const diffDays = Math.ceil((filterEnd.getTime() - filterStart.getTime()) / (1000 * 60 * 60 * 24))
    const daysRange = Array.from({ length: diffDays + 1 }, (_, i) => {
      const d = new Date(filterStart.getTime() + i * 24 * 60 * 60 * 1000)
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return `${y}-${m}-${day}`
    })

    const totalOrderData = daysRange.map((date) => {
      const found = lineChartAgg.find((d) => d._id === date)
      return found ? found.totalOrders : 0
    })

    const sumFinalTotalData = daysRange.map((date) => {
      const found = lineChartAgg.find((d) => d._id === date)
      return found ? found.totalRevenue : 0
    })

    // === DOUGHNUT CHART ===
    const doughnutAgg = await Order.aggregate([
      { $match: { createdAt: { $gte: filterStart, $lte: filterEnd } } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ])

    const defaultLabelsDoughnutChart = ['pending', 'cancelled', 'paid', 'confirmed']
    const doughnutChartData = defaultLabelsDoughnutChart.map((status) => {
      const found = doughnutAgg.find((d) => d._id === status)
      return found ? found.count : 0
    })

    res.json({
      message: 'get dashboard successfully',
      data: {
        summary: {
          todayOrder: todayOrder[0]?.total || 0,
          thisMonth: thisMonth[0]?.total || 0,
          totalInRange: totalInRange[0]?.total || 0
        },
        orders: {
          totalOrder,
          orderPending,
          orderCancelled,
          orderConfirmed,
          orderPaid
        },
        charts: {
          lineChart: {
            labels: daysRange,
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
