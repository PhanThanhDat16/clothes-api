/* eslint-disable prefer-const */
import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { Order } from '@/models/order.model'

export const dashboardController = {
  // getDashboard: asyncHandler(async (req: Request, res: Response) => {
  //   const today = new Date()
  //   const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  //   const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  //   const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
  //   const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0)

  //   // Total Price
  //   const todayOrder = await Order.aggregate([
  //     { $match: { createdAt: { $gte: startOfToday } } },
  //     { $group: { _id: null, total: { $sum: '$finalTotal' } } }
  //   ])

  //   const thisMonth = await Order.aggregate([
  //     { $match: { createdAt: { $gte: startOfMonth } } },
  //     { $group: { _id: null, total: { $sum: '$finalTotal' } } }
  //   ])

  //   const lastMonth = await Order.aggregate([
  //     { $match: { createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
  //     { $group: { _id: null, total: { $sum: '$finalTotal' } } }
  //   ])

  //   const totalOrder = await Order.countDocuments()
  //   const orderPending = await Order.countDocuments({ status: 'pending' })
  //   const orderCancelled = await Order.countDocuments({ status: 'cancelled' })
  //   const orderPaid = await Order.countDocuments({ status: 'paid' })

  //   //  Chart
  //   // Line chart: statistics by day in the current month
  //   const lineChartAgg = await Order.aggregate([
  //     {
  //       $match: {
  //         createdAt: { $gte: startOfMonth, $lte: today }
  //       }
  //     },
  //     {
  //       $group: {
  //         _id: { $dayOfMonth: '$createdAt' },
  //         totalOrders: { $sum: 1 },
  //         totalRevenue: { $sum: '$finalTotal' }
  //       }
  //     },
  //     { $sort: { _id: 1 } }
  //   ])

  //   const daysInMonth = Array.from(
  //     { length: new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate() },
  //     (_, i) => `${i + 1}`
  //   )

  //   const totalOrderData = daysInMonth.map((day) => {
  //     const found = lineChartAgg.find((d) => d._id === parseInt(day))
  //     return found ? found.totalOrders : 0
  //   })

  //   const sumFinalTotalData = daysInMonth.map((day) => {
  //     const found = lineChartAgg.find((d) => d._id === parseInt(day))
  //     return found ? found.totalRevenue : 0
  //   })

  //   // Doughnut chart: status statistics
  //   const doughnutAgg = await Order.aggregate([
  //     {
  //       $group: {
  //         _id: '$status',
  //         count: { $sum: 1 }
  //       }
  //     }
  //   ])

  //   const defaultLabelsDoughnutChart = ['pending', 'cancelled', 'paid']
  //   const doughnutChartData = defaultLabelsDoughnutChart.map((status) => {
  //     const found = doughnutAgg.find((d) => d._id === status)
  //     return found ? found.count : 0
  //   })

  //   res.json({
  //     message: 'get dashboard successfully',
  //     data: {
  //       summary: {
  //         todayOrder: todayOrder[0]?.total || 0,
  //         thisMonth: thisMonth[0]?.total || 0,
  //         lastMonth: lastMonth[0]?.total || 0
  //       },
  //       orders: {
  //         totalOrder,
  //         orderPending,
  //         orderCancelled,
  //         orderPaid
  //       },
  //       charts: {
  //         lineChart: {
  //           labels: daysInMonth,
  //           datasets: {
  //             totalOrderData,
  //             sumFinalTotalData
  //           }
  //         },
  //         doughnutChart: {
  //           labels: defaultLabelsDoughnutChart,
  //           datasets: doughnutChartData
  //         }
  //       }
  //     }
  //   })
  // })
  // getDashboard: asyncHandler(async (req: Request, res: Response) => {
  //   const { startDate, endDate } = req.query

  //   const today = new Date()
  //   const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  //   const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  //   const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
  //   const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0)

  //   // Nếu có truyền startDate và endDate thì dùng, còn không thì dùng mặc định
  //   const filterStart = startDate ? new Date(startDate as string) : startOfMonth
  //   const filterEnd = endDate ? new Date(endDate as string) : today

  //   // === TOTAL PRICE ===
  //   const todayOrder = await Order.aggregate([
  //     {
  //       $match:
  //         startDate && endDate
  //           ? { createdAt: { $gte: filterStart, $lte: filterEnd } }
  //           : { createdAt: { $gte: startOfToday } }
  //     },
  //     { $group: { _id: null, total: { $sum: '$finalTotal' } } }
  //   ])

  //   const thisMonth = await Order.aggregate([
  //     {
  //       $match:
  //         startDate && endDate
  //           ? { createdAt: { $gte: filterStart, $lte: filterEnd } }
  //           : { createdAt: { $gte: startOfMonth } }
  //     },
  //     { $group: { _id: null, total: { $sum: '$finalTotal' } } }
  //   ])

  //   const lastMonth = await Order.aggregate([
  //     {
  //       $match:
  //         startDate && endDate
  //           ? { createdAt: { $gte: filterStart, $lte: filterEnd } }
  //           : { createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }
  //     },
  //     { $group: { _id: null, total: { $sum: '$finalTotal' } } }
  //   ])

  //   // === COUNT ORDERS BY STATUS ===
  //   const totalOrder = await Order.countDocuments(
  //     startDate && endDate ? { createdAt: { $gte: filterStart, $lte: filterEnd } } : {}
  //   )
  //   const orderPending = await Order.countDocuments(
  //     startDate && endDate
  //       ? { status: 'pending', createdAt: { $gte: filterStart, $lte: filterEnd } }
  //       : { status: 'pending' }
  //   )
  //   const orderCancelled = await Order.countDocuments(
  //     startDate && endDate
  //       ? { status: 'cancelled', createdAt: { $gte: filterStart, $lte: filterEnd } }
  //       : { status: 'cancelled' }
  //   )
  //   const orderPaid = await Order.countDocuments(
  //     startDate && endDate ? { status: 'paid', createdAt: { $gte: filterStart, $lte: filterEnd } } : { status: 'paid' }
  //   )

  //   // === LINE CHART ===
  //   const lineChartAgg = await Order.aggregate([
  //     {
  //       $match: {
  //         createdAt: { $gte: filterStart, $lte: filterEnd }
  //       }
  //     },
  //     {
  //       $group: {
  //         _id: { $dayOfMonth: '$createdAt' },
  //         totalOrders: { $sum: 1 },
  //         totalRevenue: { $sum: '$finalTotal' }
  //       }
  //     },
  //     { $sort: { _id: 1 } }
  //   ])

  //   // Tạo mảng ngày theo khoảng thời gian
  //   const diffTime = Math.abs(filterEnd.getTime() - filterStart.getTime())
  //   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  //   const daysRange = Array.from(
  //     { length: diffDays + 1 },
  //     (_, i) => `${new Date(filterStart.getTime() + i * 24 * 60 * 60 * 1000).getDate()}`
  //   )

  //   const totalOrderData = daysRange.map((day) => {
  //     const found = lineChartAgg.find((d) => d._id === parseInt(day))
  //     return found ? found.totalOrders : 0
  //   })

  //   const sumFinalTotalData = daysRange.map((day) => {
  //     const found = lineChartAgg.find((d) => d._id === parseInt(day))
  //     return found ? found.totalRevenue : 0
  //   })

  //   // === DOUGHNUT CHART ===
  //   const doughnutAgg = await Order.aggregate([
  //     startDate && endDate ? { $match: { createdAt: { $gte: filterStart, $lte: filterEnd } } } : { $match: {} },
  //     {
  //       $group: {
  //         _id: '$status',
  //         count: { $sum: 1 }
  //       }
  //     }
  //   ])

  //   const defaultLabelsDoughnutChart = ['pending', 'cancelled', 'paid']
  //   const doughnutChartData = defaultLabelsDoughnutChart.map((status) => {
  //     const found = doughnutAgg.find((d) => d._id === status)
  //     return found ? found.count : 0
  //   })

  //   // === RESPONSE ===
  //   res.json({
  //     message: 'get dashboard successfully',
  //     data: {
  //       summary: {
  //         todayOrder: todayOrder[0]?.total || 0,
  //         thisMonth: thisMonth[0]?.total || 0,
  //         lastMonth: lastMonth[0]?.total || 0
  //       },
  //       orders: {
  //         totalOrder,
  //         orderPending,
  //         orderCancelled,
  //         orderPaid
  //       },
  //       charts: {
  //         lineChart: {
  //           labels: daysRange,
  //           datasets: {
  //             totalOrderData,
  //             sumFinalTotalData
  //           }
  //         },
  //         doughnutChart: {
  //           labels: defaultLabelsDoughnutChart,
  //           datasets: doughnutChartData
  //         }
  //       }
  //     }
  //   })
  // })

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
      { $match: { createdAt: { $gte: filterStart, $lte: filterEnd } } },
      {
        $group: {
          _id: { $dayOfMonth: '$createdAt' },
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$finalTotal' }
        }
      },
      { $sort: { _id: 1 } }
    ])

    const diffDays = Math.ceil((filterEnd.getTime() - filterStart.getTime()) / (1000 * 60 * 60 * 24))
    const daysRange = Array.from(
      { length: diffDays + 1 },
      (_, i) => `${new Date(filterStart.getTime() + i * 24 * 60 * 60 * 1000).getDate()}`
    )

    const totalOrderData = daysRange.map((day) => {
      const found = lineChartAgg.find((d) => d._id === parseInt(day))
      return found ? found.totalOrders : 0
    })

    const sumFinalTotalData = daysRange.map((day) => {
      const found = lineChartAgg.find((d) => d._id === parseInt(day))
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
