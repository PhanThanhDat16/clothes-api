import express from 'express'
import passport from 'passport'

import { googleCallback } from '@/controllers/auth-google/auth-google.Controller'

const router = express.Router()

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  googleCallback as any
)

export const authLoginGoogleRoute = router
