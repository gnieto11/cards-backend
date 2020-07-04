import UserController from '../controllers/user'
import { attachControllers } from '@decorators/express'
import { handleError } from '../middlewares/error'
import Access from '../middlewares/access'
import LoginController from '../controllers/login'

class CustomRoutes {
  constructor (app) {
    this.app = app
  }
  createRoutes () {
    attachControllers(this.app, [
      LoginController,
      UserController
    ])
    this.app.use((err, req, res, next) => { handleError(err, res) })
    this.app.use(Access)
  }
}

export default CustomRoutes