import { Controller, Post, Get, Put } from '@decorators/express'
import database from '../models/datebase'
import { ErrorHandler } from '../middlewares/error'
import TaskModel from '../models/task_model'
import Access from '../middlewares/access'

@Controller('/api/task')
class TaskController {
  constructor() {
    this.db = new database()
    this.model = new TaskModel()
  }
  @Post('/', [
    new Access()
  ])
  async createTask (req, res, next) {
    let connection = null
    try {
      const {titulo, descripcion, id_usuario} = req.body
      if (!titulo || !descripcion || !id_usuario ) {
        throw new ErrorHandler(400, 'Bad request')
      }
      connection = await this.db.establishConnection()
      const task = await this.model.insertTask(connection, descripcion, titulo, id_usuario)
      await this.db.endConnection(connection)
      return res.status(200).json(task)
    } catch (e) {
      if (connection) {
        await this.db.endConnection(connection)
      }
      return next(e)
    }
  }
  @Put('/', [
    new Access()
  ])
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
  @Get('/:userId', [
    new Access()
  ])
  async getAllTask (req, res, next) {
    let connection = null
    try {
      connection = await this.db.establishConnection()
      const task = await this.model.allTask(connection, req.params.userId)
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