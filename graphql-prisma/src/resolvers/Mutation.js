import bcrypt from 'bcryptjs'

const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    if (args.data.password.length < 8) {
      throw new Error('Password must be 8 characters or longer.')
    }
    const password = await bcrypt.hash(args.data.password, 10)
    return prisma.mutation.createUser(
      {
        data: {
          ...args.data,
          password
        }
      },
      info
    )
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
