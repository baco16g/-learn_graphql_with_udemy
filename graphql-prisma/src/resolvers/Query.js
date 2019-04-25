import getUserId from '../utils/getUserId'

const Query = {
  users(parent, args, { prisma }, info) {
    return prisma.query.users(args, info)
  },
  posts(parent, args, { prisma }, info) {
    return prisma.query.posts(
      {
        where: {
          published: true,
          ...(args.query
            ? {
                OR: [
                  {
                    title_contains: args.query
                  },
                  {
                    body_contains: args.query
                  }
                ]
              }
            : {})
        }
      },
      info
    )
  },
  myPosts(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    return prisma.query.posts(
      {
        where: {
          ...(args.query
            ? {
                OR: [
                  {
                    title_contains: args.query
                  },
                  {
                    body_contains: args.query
                  }
                ]
              }
            : {}),
          author: {
            id: userId
          }
        }
      },
      info
    )
  },
  comments(parent, args, { prisma }, info) {
    return prisma.comments.posts(args, info)
  },
  me(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    return prisma.query.user(
      {
        where: {
          id: userId
        }
      },
      info
    )
  },
  async post(parent, args, { prisma, request }, info) {
    const userId = getUserId(request, false)
    const post = await prisma.query.posts(
      {
        where: {
          id: args.id,
          OR: [
            {
              published: true
            },
            {
              author: {
                id: userId
              }
            }
          ]
        }
      },
      info
    )
    if (post.length === 0) throw new Error('Post not found.')
    return post[0]
  }
}

export { Query as default }
