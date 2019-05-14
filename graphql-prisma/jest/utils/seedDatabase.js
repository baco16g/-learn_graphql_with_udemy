/* eslint-disable no-undef */

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../../src/prisma'

const users = [
  {
    input: {
      name: 'Jen',
      email: 'jen@example.com',
      password: bcrypt.hashSync('Red098!@$')
    },
    user: undefined,
    jwt: undefined
  },
  {
    input: {
      name: 'Andrew',
      email: 'andres@example.com',
      password: bcrypt.hashSync('Blue098!@$')
    },
    user: undefined,
    jwt: undefined
  }
]

const posts = [
  {
    input: {
      title: 'My published post',
      body: '',
      published: true
    },
    authorIndex: 0,
    post: undefined
  },
  {
    input: {
      title: 'My draft post',
      body: '',
      published: false
    },
    authorIndex: 0,
    post: undefined
  }
]

const comments = [
  {
    input: {
      text: 'Great post. Thanks for shareing!'
    },
    authorIndex: 1,
    postIndex: 0,
    comment: undefined
  },
  {
    input: {
      text: 'I am glad you enjoyed it!'
    },
    authorIndex: 0,
    postIndex: 0,
    comment: undefined
  }
]

const seedDatabase = async () => {
  jest.setTimeout(100000)

  // Delete test data
  await prisma.mutation.deleteManyComments()
  await prisma.mutation.deleteManyPosts()
  await prisma.mutation.deleteManyUsers()

  // Create users
  await Promise.all(
    users.map((o, index) =>
      (async () => {
        o.user = await prisma.mutation.createUser({
          data: o.input
        })
        o.jwt = jwt.sign({ userId: o.user.id }, process.env.JWT_SECRET)
        const attachUser = data =>
          data
            .filter(p => p.authorIndex === index)
            .forEach(p => {
              p.input.author = {
                connect: {
                  id: o.user.id
                }
              }
            })
        attachUser(posts)
        attachUser(comments)
      })()
    )
  )

  // Create posts
  await Promise.all(
    posts.map((o, index) =>
      (async () => {
        o.post = await prisma.mutation.createPost({
          data: {
            ...o.input
          }
        })
        const attachPost = data => {
          data
            .filter(p => p.postIndex === index)
            .forEach(p => {
              p.input.post = {
                connect: {
                  id: o.post.id
                }
              }
            })
        }
        attachPost(comments)
      })()
    )
  )

  // Create comments
  await Promise.all(
    comments.map(o =>
      (async () => {
        o.comment = await prisma.mutation.createComment({
          data: {
            ...o.input
          }
        })
      })()
    )
  )
}

export { seedDatabase as default, users, posts, comments }
