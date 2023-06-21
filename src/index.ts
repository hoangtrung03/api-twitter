import express from 'express'
import databaseService from '~/services/database.services'
const app = express()
const port = 4000
app.use(express.json())
databaseService.connect()

app.listen(port, () => {
  console.log(`App already listening on port ${port}`)
})
