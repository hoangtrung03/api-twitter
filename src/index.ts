import express, { Request, Response, NextFunction } from 'express'
import databaseService from '~/services/database.services'
import usersRouter from './routes/users.routes'

databaseService.connect()
const app = express()
const port = 4000
app.use(express.json())
app.use('/users', usersRouter)
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  res.status(400).json({ error: error.message })
})

app.listen(port, () => {
  console.log(`App already listening on port ${port}`)
})
