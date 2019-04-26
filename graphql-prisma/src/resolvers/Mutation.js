import bcrypt from 'bcryptjs'

import getUserId from '../utils/getUserId'
import generateToken from '../utils/generateToken'
import hashPassword from '../utils/hashPassword'

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
      token: generateToken(user.id)
    }
  },
  async createUser(parent, args, { prisma }) {
    const password = await hashPassword(args.data.password)
    const user = prisma.mutation.createUser({
      data: {
        ...args.data,
        password
      }
    })
    return {
      user,
      token: generateToken(user.id)
    }
  },
  deleteUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    return prisma.mutation.deleteUser(
      {
        where: {
          id: userId
        }
      },
      info
    )
  },
  async updateUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    if (typeof args.data.password === 'string') {
      args.data.password = await hashPassword(args.data.password)
    }

    return prisma.mutation.updateUser(
      {
        where: {
          id: userId
        },
        data: args.data
      },
      info
    )
  },
  createPost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    return prisma.mutation.createPost(
      {
        ...args,
        data: {
          ...args.data,
          author: {
            connect: {
              id: userId
            }
          }
        }
      },
      info
    )
  },
  async deletePost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    const postExists = await prisma.exists.Post({
      id: args.id,
      author: {
        id: userId
      }
    })
    if (!postExists) throw new Error('Unable to delete post.')
    return prisma.mutation.deletePost(
      {
        ...args,
        where: {
          id: args.id
        }
      },
      info
    )
  },
  async updatePost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    const postExists = await prisma.exists.Post({
      id: args.id,
      author: {
        id: userId
      }
    })
    if (!postExists) throw new Error('Unable to update post.')
    const isPublished = await prisma.exists.Post({
      id: args.id,
      published: true
    })
    if (isPublished && !args.data.published) {
      await prisma.mutation.deleteManyComments({
        where: { post: { id: args.id } }
      })
    }
    return prisma.mutation.updatePost(
      {
        ...args,
        where: {
          id: args.id
        }
      },
      info
    )
  },
  async createComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    const postExists = await prisma.exists.Post({
      id: args.data.post,
      published: true
    })
    if (!postExists) throw new Error('Unable to find post.')
    return prisma.mutation.createComment(
      {
        ...args,
        data: {
          ...args.data,
          author: {
            connect: {
              id: userId
            }
          },
          post: {
            connect: {
              id: args.data.post
            }
          }
        }
      },
      info
    )
  },
  async deleteComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    const commentExists = await prisma.exists.Comment({
      id: args.id,
      author: {
        id: userId
      }
    })
    if (!commentExists) throw new Error('Unable to delete comment.')
    return prisma.mutation.deleteComment(
      {
        where: {
          id: args.id
        }
      },
      info
    )
  },
  async updateComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    const commentExists = await prisma.exists.Comment({
      id: args.id,
      author: {
        id: userId
      }
    })
    if (!commentExists) throw new Error('Unable to update comment.')
    return prisma.mutation.updateComment(
      ...args,
      {
        where: {
          id: args.id
        }
      },
      info
    )
  }
}

export { Mutation as default }
