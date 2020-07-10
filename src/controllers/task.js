import { Controller, Post, Get, Put } from '@decorators/express'
import database from '../models/datebase'
import { ErrorHandler } from '../middlewares/error'
import TaskModel from '../models/task_model'

@Controller('/api/task')
class TaskController {
  constructor() {
    this.db = new database()
    this.model = new TaskModel()
  }
  @Post('/')
  async createTask (req, res, next) {
    let connection = null
    try {
      const {titulo, descripcion} = req.body
      if (!titulo || !descripcion) {
        throw new ErrorHandler(400, 'Bad request')
      }
      connection = await this.db.establishConnection()
      const task = await this.model.insertTask(connection, descripcion, titulo)
      await this.db.endConnection(connection)
      return res.status(200).json(task)
    } catch (e) {
      if (connection) {
        await this.db.endConnection(connection)
      }
      return next(e)
    }
  }
  @Put('/')
  async editTask (req, res, next) {
    let connection = null
    try {
      const {titulo, descripcion, id} = req.body
      if (!titulo || !descripcion) {
        throw new ErrorHandler(400, 'Bad request')
      }
      connection = await this.db.establishConnection()
      const task = await this.model.updateTask(connection, descripcion, titulo, id)
      await this.db.endConnection(connection)
      return res.status(200).json(task)
    } catch (e) {
      if (connection) {
        await this.db.endConnection(connection)
      }
      return next(e)
    }
  }
  @Get('/')
  async getAllTask (req, res, next) {
    let connection = null
    try {
      connection = await this.db.establishConnection()
      const task = await this.model.allTask(connection)
      await this.db.endConnection(connection)
      return res.status(200).json(task)
    } catch (e) {
      if (connection) {
        await this.db.endConnection(connection)
      }
      return next(e)
    }
  }
}
module.exports = TaskController