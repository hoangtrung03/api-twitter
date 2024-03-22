import { config } from 'dotenv'
import express from 'express'
import databaseService from '~/services/database.services'
import { UPLOAD_VIDEO_DIR } from './constants/dir'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import mediasRouter from './routes/medias.routes'
import staticRouter from './routes/static.routes'
import usersRouter from './routes/users.routes'
import { initFolder } from './utils/file'

config()
databaseService.connect().then(() => {
  databaseService.indexUsers()
})
const app = express()
const port = process.env.PORT || 4000

// Create folder uploads
initFolder()

app.use(express.json())
app.use('/users', usersRouter)
app.use('/medias', mediasRouter)
app.use('/static', staticRouter)
app.use('/static', express.static(UPLOAD_VIDEO_DIR))
app.use('/health-check', (req, res) => {
  res.status(200).send('OK')
})
app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`App already listening on port ${port}`)
})
