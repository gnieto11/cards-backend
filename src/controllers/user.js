import { Controller, Post, Get} from '@decorators/express'
import { ErrorHandler } from '../middlewares/error'
import database from '../models/datebase'
import UserModel from '../models/user_model'
import crypto from 'crypto'
import Access from '../middlewares/access'
import jwtDecode from 'jwt-decode'

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
      const {email, password, apellido, nombre} = req.body
      if (!email || !password || !apellido || !nombre) {
        throw new ErrorHandler(400, 'Bad request')
      }
      const encryptedPassword = await crypto.createHash('sha1').update(password).digest('hex'),
        user = await this.user.getUser(connection, email)
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

  @Post('/check-user')
  async checkUser (req, res, next) {
    let connection = null
    try {
      connection = await this.db.establishConnection()
      const { email } = req.body
      if (!email) {
        throw new ErrorHandler(400, 'Bad request')
      }
      const user = await this.user.getUser(connection, email)
      await this.db.endConnection(connection)
      return res.status(200).json(!!(user && user.length))
    } catch (e) {
      if (connection) {
        await this.db.endConnection(connection)
      }
      return next(e)
    }
  }

  @Get('/', [
    new Access()
  ])
  async userInfo (req, res, next) {
    let connection = null
    try {
      connection = await this.db.establishConnection()
      const token = req.headers['access-token'],
        decoded = jwtDecode(token)
      if (!decoded) {
        throw new ErrorHandler(403, 'Not authorized')
      }
      const user = await this.user.getUser(connection, decoded.email)
      await this.db.endConnection(connection)
      return res.status(200).json(user)
    } catch (e) {
      if (connection) {
        await this.db.endConnection(connection)
      }
      return next(e)
    }
  }

}

export default UserController