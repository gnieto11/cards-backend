import { Controller, Post } from '@decorators/express'
import database from '../models/datebase'
import userModel from '../models/user_model'
import { ErrorHandler } from '../middlewares/error'
import { encryptedToken } from '../utils/authentication'
import crypto from 'crypto'

@Controller('/api/login')
class LoginController {
  constructor() {
    this.db = new database()
    this.user = new  userModel()
  }

  @Post('/')
  async login (req, res, next) {
    let connection = null,
      token = null
    try {
      connection = await this.db.establishConnection()
      const { email, password } = req.body
      if (!email || !password) {
        throw new ErrorHandler(400, 'Bad request')
      }
      const encryptedPassword = await crypto.createHash('sha1').update(password).digest('hex'),
        user = await this.user.getUser(connection, email)
      if (user && user.length) {
        if (email !== user[0].email || encryptedPassword !== user[0].password) {
          return res.status(403).json(false)
        } else {
          token = await encryptedToken({password: password, email:email})
          if (!token) {
            throw new ErrorHandler(403, 'Not authorized')
          }
          return res.status(200).json({token: token})
        }
      } else {
        throw new ErrorHandler(403, 'Not authorized')
      }
    } catch (e) {
      if (connection) {
        await this.db.endConnection(connection)
      }
      return next(e)
    }
  }
}
module.exports = LoginController