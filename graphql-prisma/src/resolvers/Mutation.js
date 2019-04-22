import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const SECRET_KEY = 'thisisasecret'

const signWithJwt = userId => jwt.sign({ userId }, SECRET_KEY)

const Mutation = {
  async login(parent, args, { prisma }) {
    const ERROR_MESSAGE = 'Unable to login.'
    const user = await prisma.query.user({
      where: {
        email: args.data.email
      }
    })
    if (!user) throw new Error(ERROR_MESSAGE)
    const isMatch = await bcrypt.compare(args.data.password, user.password)
    if (!isMatch) throw new Error(ERROR_MESSAGE)
    return {
      user,
      token: signWithJwt(user.id)
    }
  },
  async createUser(parent, args, { prisma }) {
    if (args.data.password.length < 8) {
      throw new Error('Password must be 8 characters or longer.')
    }
    const password = await bcrypt.hash(args.data.password, 10)
    const user = prisma.mutation.createUser({
      data: {
        ...args.data,
        password
      }
    })
    return {
      user,
      token: signWithJwt(user.id)
    }
  },
  deleteUser(parent, args, { prisma }, info) {
    return prisma.mutation.deleteUser(args, info)
  },
  updateUser(parent, args, { prisma }, info) {
    return prisma.mutation.updateUser(args, info)
  },
  createPost(parent, args, { prisma }, info) {
    return prisma.mutation.createPost(args, info)
  },
  deletePost(parent, args, { prisma }, info) {
    return prisma.mutation.deletePost(args, info)
  },
  updatePost(parent, args, { prisma }, info) {
    return prisma.mutation.updatePost(args, info)
  },
  createComment(parent, args, { prisma }, info) {
    return prisma.mutation.createComment(args, info)
  },
  deleteComment(parent, args, { prisma }, info) {
    return prisma.mutation.deleteComment(args, info)
  },
  updateComment(parent, args, { prisma }, info) {
    return prisma.mutation.updateComment(args, info)
  }
}

export { Mutation as default }
