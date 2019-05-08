/* eslint-disable no-undef */

import { getFirstName, isValidPassword } from '../src/utils/user'

test('Should return first name when given full name', () => {
  const firstName = 'Taro'
  const lastName = 'Yamada'
  const fullName = `${firstName} ${lastName}`
  expect(getFirstName(fullName)).toBe(firstName)
})

test('Should return first name when given first name', () => {
  const firstName = 'Hanako'
  expect(getFirstName(firstName)).toBe(firstName)
})

test('Should reject password shorter than 8 characters', () => {
  const password = 'gtYGw52'
  expect(isValidPassword(password)).toBe(false)
})

test('Shoukd reject password that contains word password', () => {
  const password = 'gtYpasSWorDUhAxw52'
  expect(isValidPassword(password)).toBe(false)
})

test('Should correctly validate a valid password', () => {
  const password = 'dm9fezt9XFcAL2u8'
  expect(isValidPassword(password)).toBe(true)
})
