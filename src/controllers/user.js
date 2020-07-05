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
      const {email, password, documento, apellido, nombre} = req.body
      if (!email || !password || !documento || !apellido || !nombre) {
        throw new ErrorHandler(400, 'Bad request')
      }
      const encryptedPassword = await crypto.createHash('sha1').update(password).digest('hex'),
        user = await this.user.getUser(connection, documento)
      if (user && user.length) {
        throw new ErrorHandler (403, 'User already exists')
      }
      req.body.encryptedPassword = encryptedPassword
      const createdUser = await this.user.createUser(connection, req.body)
      await this.db.endConnection(connection)
      return res.status(200).json(createdUser)
    } catch (e) {
      if (connection) {
        await this.db.endConnection(connection)
      }
      return next(e)
    }
  }

}

export default UserController