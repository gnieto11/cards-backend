import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import CustomRoutes from './src/routes/routes'

const app = express()

app.use(cors())
app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))
app.use(bodyParser.json({type: 'application/vnd.api+json'}))
app.enable('jsonp callback')


// Routes
const routes = new CustomRoutes(app)
routes.createRoutes()

// Start server
app.listen(3000, () => {
  console.log('Server started at port 3000')
})