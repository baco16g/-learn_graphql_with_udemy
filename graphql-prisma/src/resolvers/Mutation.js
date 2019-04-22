const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    return prisma.mutation.createUser({ data: args.data }, info)
  },
  async deleteUser(parent, args, { prisma }, info) {
    return prisma.mutation.deleteUser(args, info)
  },
  async updateUser(parent, args, { prisma }, info) {
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
