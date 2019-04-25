import getUserId from '../utils/getUserId'

const User = {
  email: {
    fragment: 'fragment userId on User { id }',
    resolve(parent, args, { request }) {
      const userId = getUserId(request, false)
      return userId && userId === parent.id ? parent.email : null
    }
  },
  posts: {
    fragment: 'fragment userId on User { id }',
    resolve(parent, args, { prisma }, info) {
      return prisma.query.posts(
        {
          where: {
            published: true,
            author: {
              id: parent.id
            }
          }
        },
        info
      )
    }
  }
}

export { User as default }
