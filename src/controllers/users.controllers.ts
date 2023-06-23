import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { RegisterRequestBody } from '~/models/requests/User.requests'
import userService from '~/services/users.services'

export const loginController = (req: Request, res: Response) => {
  const { email, password } = req.body
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterRequestBody>, res: Response) => {
  try {
    const result = await userService.register(req.body)
    return res.json({
      message: 'Registration successful',
      result
    })
  } catch (error) {
    console.log(error)
    return res.status(400).json({ message: 'Registration failed', error })
  }
}
