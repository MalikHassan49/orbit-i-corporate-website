import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { User, type UserDocument } from '../models/User'
import { ApiError } from '../utils/ApiError'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt'
import { ROLES } from '../constants/roles'

const SALT_ROUNDS = 12

interface RegisterInput {
  fullName: string
  email: string
  password: string
}

interface LoginInput {
  email: string
  password: string
}

async function issueTokens(user: UserDocument) {
  const payload = { sub: user.id as string, role: user.role as (typeof ROLES)[keyof typeof ROLES] }
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  }
}

export const authService = {
  async register(input: RegisterInput) {
    const existing = await User.findOne({ email: input.email })
    if (existing) {
      throw ApiError.conflict('An account with this email already exists')
    }

    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS)
    const emailVerificationToken = crypto.randomBytes(32).toString('hex')

    const user = await User.create({
      fullName: input.fullName,
      email: input.email,
      passwordHash,
      role: ROLES.CLIENT,
      emailVerificationToken,
    })

    // TODO: send verification email via the transactional email provider once configured.

    const tokens = await issueTokens(user)
    return { user, ...tokens }
  },

  async login(input: LoginInput) {
    const user = await User.findOne({ email: input.email }).select('+passwordHash')
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password')
    }
    if (!user.isActive) {
      throw ApiError.forbidden('This account has been deactivated. Contact support for help.')
    }

    const isValid = await user.comparePassword(input.password)
    if (!isValid) {
      throw ApiError.unauthorized('Invalid email or password')
    }

    const tokens = await issueTokens(user)
    return { user, ...tokens }
  },

  async refresh(refreshToken: string | undefined) {
    if (!refreshToken) {
      throw ApiError.unauthorized('No refresh token provided')
    }

    let payload
    try {
      payload = verifyRefreshToken(refreshToken)
    } catch {
      throw ApiError.unauthorized('Invalid or expired session')
    }

    const user = await User.findById(payload.sub)
    if (!user || !user.isActive) {
      throw ApiError.unauthorized('Invalid or expired session')
    }

    return issueTokens(user)
  },

  async forgotPassword(email: string) {
    const user = await User.findOne({ email })
    // Always behave the same way whether or not the user exists, so this
    // endpoint can't be used to enumerate registered email addresses.
    if (!user) return

    const resetToken = crypto.randomBytes(32).toString('hex')
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    user.set('passwordResetToken', hashedToken)
    user.set('passwordResetExpires', new Date(Date.now() + 60 * 60 * 1000))
    await user.save()

    // TODO: send the reset link (containing `resetToken`, not the hash) via email.
  },

  async resetPassword(token: string, newPassword: string) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    }).select('+passwordResetToken +passwordResetExpires')

    if (!user) {
      throw ApiError.badRequest('This reset link is invalid or has expired')
    }

    user.passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS)
    user.set('passwordResetToken', undefined)
    user.set('passwordResetExpires', undefined)
    await user.save()
  },
}
