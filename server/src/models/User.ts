import { Schema, model, Model, type HydratedDocument } from 'mongoose'
import bcrypt from 'bcryptjs'
import { ALL_ROLES, ROLES, type Role } from '../constants/roles'

export interface IUser {
  fullName: string
  email: string
  passwordHash: string
  role: Role
  isVerified: boolean
  isActive: boolean
  avatarUrl?: string
  emailVerificationToken?: string
  passwordResetToken?: string
  passwordResetExpires?: Date
  createdAt: Date
  updatedAt: Date
}

export interface IUserMethods {
  comparePassword(candidate: string): Promise<boolean>
}

type UserModel = Model<IUser, Record<string, never>, IUserMethods>

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ALL_ROLES, default: ROLES.CLIENT },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    avatarUrl: { type: String },
    emailVerificationToken: { type: String, select: false },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
  },
  { timestamps: true }
)

userSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.passwordHash)
}

userSchema.set('toJSON', {
  transform: (_doc, ret: any) => {
    delete ret.passwordHash
    delete ret.emailVerificationToken
    delete ret.passwordResetToken
    delete ret.passwordResetExpires
    ret.id = ret._id
    delete ret._id
    delete ret.__v
    return ret
  },
})

export type UserDocument = HydratedDocument<IUser, IUserMethods>

export const User = model<IUser, UserModel>('User', userSchema)
