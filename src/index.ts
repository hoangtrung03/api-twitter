import express from 'express'
import databaseService from '~/services/database.services'
import usersRouter from './routes/users.routes'

databaseService.connect()
const app = express()
const port = 4000
app.use(express.json())
app.use('/users', usersRouter)

app.listen(port, () => {
  console.log(`App already listening on port ${port}`)
})
