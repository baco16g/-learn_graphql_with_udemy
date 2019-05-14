/* eslint-disable no-undef */

import 'cross-fetch/polyfill'
import prisma from '../src/prisma'
import seedDatabase, { users, posts } from '../jest/utils/seedDatabase'
import getClient from '../jest/utils/getClient'
import * as operations from '../jest/utils/operations'

const client = getClient()

beforeEach(seedDatabase)

test('Should expose published posts', async () => {
  const response = await client.query({
    query: operations.getPosts
  })
  expect(response.data.posts.length).toBe(1)
  expect(response.data.posts[0].published).toBe(true)
})

test('Should fetch user profile', async () => {
  const client = getClient(users[0].jwt)
  const { data } = await client.query({ query: operations.myPosts })
  expect(data.myPosts.length).toBe(2)
})

test('Should be able to update own post', async () => {
  const client = getClient(users[0].jwt)
  const variables = {
    id: posts[0].post.id,
    data: {
      published: false
    }
  }
  const { data } = await client.mutate({
    mutation: operations.updatePost,
    variables
  })
  const exists = await prisma.exists.Post({
    id: posts[0].post.id,
    published: false
  })
  expect(data.updatePost.published).toBe(false)
  expect(exists).toBe(true)
})

test('Should create a new post', async () => {
  const client = getClient(users[0].jwt)
  const post = { title: 'A test post', body: '', published: true }
  const variables = {
    data: {
      title: post.title,
      body: post.body,
      published: post.published
    }
  }
  const { data } = await client.mutate({
    mutation: operations.createPost,
    variables
  })
  expect(data.createPost.title).toBe(post.title)
  expect(data.createPost.body).toBe(post.body)
  expect(data.createPost.published).toBe(post.published)
})

test('Should delete post', async () => {
  const client = getClient(users[0].jwt)
  const variables = { id: posts[1].post.id }
  await client.mutate({ mutation: operations.deletePost, variables })
  const exists = await prisma.exists.Post({
    id: posts[1].post.id
  })
  expect(exists).toBe(false)
})
