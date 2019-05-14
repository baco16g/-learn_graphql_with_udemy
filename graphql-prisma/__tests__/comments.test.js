/* eslint-disable no-undef */

import 'cross-fetch/polyfill'
import prisma from '../src/prisma'
import seedDatabase, {
  comments,
  users,
  posts
} from '../jest/utils/seedDatabase'
import getClient from '../jest/utils/getClient'
import * as operations from '../jest/utils/operations'

beforeEach(seedDatabase)

test('Should delete own comment', async () => {
  const client = getClient(users[0].jwt)
  const variables = { id: comments[1].comment.id }
  await client.mutate({ mutation: operations.deleteComment, variables })
  const exists = await prisma.exists.Comment({
    id: comments[1].comment.id
  })
  expect(exists).toBe(false)
})

test('Should not delete other users comment', async () => {
  const client = getClient(users[0].jwt)
  const variables = { id: comments[0].comment.id }
  await expect(
    client.mutate({ mutation: operations.deleteComment, variables })
  ).rejects.toThrow()
})

test('Should subscribe to comments for a post', async done => {
  const client = getClient(users[1].jwt)
  const variables = { postId: posts[0].post.id }
  client
    .subscribe({ query: operations.subscribeToComments, variables })
    .subscribe({
      next(response) {
        expect(response.data.comment.mutation).toBe('DELETED')
        done()
      }
    })
  await prisma.mutation.deleteComment({ where: { id: comments[0].comment.id } })
})

test('Should subscribe to changes for published posts', async done => {
  const client = getClient(users[0].jwt)
  client.subscribe({ query: operations.subscribeToPosts }).subscribe({
    next(response) {
      expect(response.data.post.mutation).toBe('DELETED')
      done()
    }
  })
  await prisma.mutation.deletePost({ where: { id: posts[0].post.id } })
})
