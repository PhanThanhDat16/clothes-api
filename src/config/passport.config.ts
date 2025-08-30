import { PassportStatic } from 'passport'
import { Strategy as GoogleStrategy, Profile, StrategyOptions } from 'passport-google-oauth20'
import dotenv from 'dotenv'
import { User } from '@/models/user.model' // ⚠️ nhớ kiểm tra bạn export default hay named

interface GoogleStrategyOptions {
  clientID: string
  clientSecret: string
  callbackURL: string
  passReqToCallback: false
}

dotenv.config()

// Lấy biến môi trường và kiểm tra
const { CLIENT_ID, CLIENT_SECRET, GOOGLE_CALLBACK_URL } = process.env

if (!CLIENT_ID || !CLIENT_SECRET || !GOOGLE_CALLBACK_URL) {
  throw new Error('Missing Google OAuth environment variables in .env')
}

function initPassport(passport: PassportStatic) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: CLIENT_ID!,
        clientSecret: CLIENT_SECRET!,
        callbackURL: GOOGLE_CALLBACK_URL!,
        passReqToCallback: false
      } as GoogleStrategyOptions,
      async (
        _accessToken: string,
        _refreshToken: string,
        profile: Profile,
        done: (error: any, user?: any) => void
      ) => {
        try {
          const email = profile.emails?.[0]?.value
          if (!email) {
            return done(new Error('No email found in Google profile'), null)
          }

          // Tìm user trong DB
          const existingUser = await User.findOne({ email }).exec()
          if (existingUser) {
            return done(null, existingUser)
          }

          // Nếu chưa có thì tạo mới
          const newUser = await User.create({
            fullName: profile.displayName,
            email,
            username: email.split('@')[0],
            password: '', // vì login bằng Google
            provider: 'google',
            googleId: profile.id
          })

          return done(null, newUser)
        } catch (error) {
          return done(error, null)
        }
      }
    )
  )

  // Serialize & Deserialize User (bắt buộc cho session login)
  passport.serializeUser((user: any, done) => {
    done(null, user.id)
  })

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await User.findById(id).exec()
      done(null, user)
    } catch (error) {
      done(error, null)
    }
  })
}

export default initPassport
