const Query = {
  users(parent, args, { prisma }, info) {
    return prisma.query.users(args, info)
  },
  posts(parent, args, { prisma }, info) {
    return prisma.query.posts(args, info)
  },
  comments(parent, args, { prisma }, info) {
    return prisma.comments.posts(args, info)
  },
  me() {
    return {
      id: '123098',
      name: 'Mike',
      email: 'mike@example.com'
    }
  },
  post() {
    return {
      id: '092',
      title: 'GraphQL 101',
      body: '',
      published: false
    }
  }
}

export { Query as default }
