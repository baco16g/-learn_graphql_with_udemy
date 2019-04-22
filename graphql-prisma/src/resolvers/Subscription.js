const Subscription = {
  comment: {
    subscribe(parent, args, { prisma }, info) {
      return prisma.subscription.comment(args, info)
    }
  },
  post: {
    subscribe(parent, args, { prisma }, info) {
      return prisma.subscription.post(args, info)
    }
  }
}

export { Subscription as default }
