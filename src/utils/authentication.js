const jwt = require('jsonwebtoken')
import * as secretKey from '../config/all.js'

export const encryptedToken = (token) => {
  return jwt.sign(token, secretKey.secret_key, {expiresIn : 1440})
}
