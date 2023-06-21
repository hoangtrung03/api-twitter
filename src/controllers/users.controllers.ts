import { Request, Response } from 'express'
import userService from '~/services/users.services'

export const loginController = (req: Request, res: Response) => {
  const { email, password } = req.body
}

export const registerController = async (req: Request, res: Response) => {
  const { email, password } = req.body
  try {
    const result = await userService.register({ email, password })
    return res.json({
      message: 'Registration successful',
      result
    })
  } catch (error) {
    console.log(error)
    return res.json({ message: 'Registration failed', error })
  }
}
