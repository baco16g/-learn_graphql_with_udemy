/* eslint-disable no-undef */

import 'cross-fetch/polyfill'
import prisma from '../src/prisma'
import seedDatabase, { users } from '../jest/utils/seedDatabase'
import getClient from '../jest/utils/getClient'
import * as operations from '../jest/utils/operations'

const client = getClient()

beforeEach(seedDatabase)

test('Should create a new uesr', async () => {
  const variables = {
    data: {
      name: 'Andrew',
      email: 'andrew@example.com',
      password: 'MyPass123'
    }
  }
  const response = await client.mutate({
    mutation: operations.createUser,
    variables
  })
  const exists = await prisma.exists.User({
    id: response.data.createUser.user.id
  })
  expect(exists).toBe(true)
})

test('Should expose public author profiles', async () => {
  const response = await client.query({
    query: operations.getUsers
  })
  expect(response.data.users.length).toBe(2)
  expect(response.data.users[0].email).toBe(null)
  expect(response.data.users[0].name).toBe('Jen')
})

test('Should not login with bad credentials', async () => {
  const variables = {
    data: { email: 'jefn@example.com', password: 'Red098!@$' }
  }
  await expect(
    client.mutate({ mutation: operations.login, variables })
  ).rejects.toThrow()
})

test('Should not signup user with invalid password', async () => {
  const variables = {
    data: { name: 'Andrew', email: 'andrew@example.com', password: 'pass' }
  }
  await expect(
    client.mutate({ mutation: operations.createUser, variables })
  ).rejects.toThrow()
})

test('Should fetch user profile', async () => {
  const client = getClient(users[0].jwt)
  const { data } = await client.query({ query: operations.getProfile })
  expect(data.me.id).toBe(users[0].user.id)
  expect(data.me.name).toBe(users[0].user.name)
  expect(data.me.email).toBe(users[0].user.email)
})
