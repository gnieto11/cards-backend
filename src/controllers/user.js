import { Controller, Post } from '@decorators/express'
import { ErrorHandler } from '../middlewares/error'
import database from '../models/datebase'
import UserModel from '../models/user_model'
import crypto from 'crypto'


@Controller ('/api/user')
class UserController {
  constructor() {
    this.db = new database()
    this.user = new UserModel()
  }

  @Post('/')
  async createUser (req, res, next) {
    let connection = null
    try {
      connection = await this.db.establishConnection()
      const {email, password, document, lastName, name} = req.body
      if (!email || !password || !document || !lastName || !name) {
        throw new ErrorHandler(400, 'Bad request')
      }
      const encryptedPassword = await crypto.createHash('sha1').update(password).digest('hex'),
        user = await this.user.getUser(connection, document)
      if (user && user.length) {
        throw new ErrorHandler (403, 'User already exists')
      }
      req.body.encryptedPassword = encryptedPassword
      await this.user.createUser(connection, req.body)
      await this.db.endConnection(connection)
      return res.status(200).json('User created')
    } catch (e) {
      if (connection) {
        await this.db.endConnection(connection)
      }
      return next(e)
    }
  }

}

export default UserController