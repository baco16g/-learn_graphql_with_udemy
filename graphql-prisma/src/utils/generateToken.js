import jwt from 'jsonwebtoken'
import config from '../config'

const generateToken = userId =>
  jwt.sign({ userId }, config.SECRET_KEY, { expiresIn: '7 days' })

export { generateToken as default }
