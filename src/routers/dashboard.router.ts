import { dashboardController } from '@/controllers/dashboard/dashboard.controller'
import { Router } from 'express'

const router = Router()

router.get('/', dashboardController.getDashboard)

export const routerDashboard = router
