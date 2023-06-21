import { Router } from 'express'
import { loginController, registerController } from '~/controllers/users.controllers'

const usersRouter = Router()

usersRouter.post('/login', loginController)
usersRouter.get('/register', registerController)

export default usersRouter
