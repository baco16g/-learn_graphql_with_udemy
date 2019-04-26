import getUserId from '../utils/getUserId'

const Query = {
  users(parent, args, { prisma }, info) {
    const { query, first, skip, after, orderBy } = args
    return prisma.query.users(
      {
        first,
        skip,
        after,
        orderBy,
        where: {
          ...(query
            ? {
                OR: [
                  {
                    name_contains: query
                  }
                ]
              }
            : {})
        }
      },
      info
    )
  },
  posts(parent, args, { prisma }, info) {
    const { query, first, skip, after, orderBy } = args
    return prisma.query.posts(
      {
        first,
        skip,
        after,
        orderBy,
        where: {
          published: true,
          ...(query
            ? {
                OR: [
                  {
                    title_contains: query
                  },
                  {
                    body_contains: query
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
    const { query, first, skip, after, orderBy } = args
    const userId = getUserId(request)
    return prisma.query.posts(
      {
        first,
        skip,
        after,
        orderBy,
        where: {
          ...(query
            ? {
                OR: [
                  {
                    title_contains: query
                  },
                  {
                    body_contains: query
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
    const { first, skip, after, orderBy } = args
    return prisma.query.comments({ first, skip, after, orderBy }, info)
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
