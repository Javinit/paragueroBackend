import cors from 'cors'
import express, { json } from 'express'
import 'dotenv/config'
import { config } from './config/index.js'
import { startDb } from './config/mongo.js'
import { usersRoutes } from './routes/users.js'
const app = express()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(config.PORT, () => {
  console.log(`SERVER RUNNING ON PORT: ${config.PORT}`)
})
app.use(cors())
app.use(json({ limit: '2mb' }))

app.use('/users', usersRoutes)


await startDb()