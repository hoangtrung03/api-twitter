import express from 'express'
import databaseService from '~/services/database.services'
import usersRouter from './routes/users.routes'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import mediasRouter from './routes/medias.routes'
import fs from 'fs'
import { initFolder } from './utils/file'

databaseService.connect()
const app = express()
const port = 4000

// Create folder uploads
initFolder()

app.use(express.json())
app.use('/users', usersRouter)
app.use('/medias', mediasRouter)
app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`App already listening on port ${port}`)
})
