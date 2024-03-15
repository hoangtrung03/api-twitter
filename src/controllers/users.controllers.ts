import { config } from 'dotenv'
import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'
import { UserVerifyStatus } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { USER_MESSAGES } from '~/constants/messages'
import {
  ChangePasswordReqBody,
  FollowReqBody,
  ForgotPasswordReqBody,
  GetProfileReqParams,
  LoginRequestBody,
  LogoutReqBody,
  RefreshTokenReqBody,
  RegisterRequestBody,
  ResetPasswordReqBody,
  TokenPayload,
  UnFollowReqParams,
  UpdateMeReqBody,
  VerifyEmailReqBody,
  VerifyForgotPasswordReqBody
} from '~/models/requests/User.requests'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import { default as userService, default as usersService } from '~/services/users.services'
config()

/**
 * Handles the login request and returns the login result.
 *
 * @param {Request<ParamsDictionary, any, LoginRequestBody>} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} - The JSON response containing the login success message and the login result.
 */
export const loginController = async (req: Request<ParamsDictionary, any, LoginRequestBody>, res: Response) => {
  const user = req.user as User
  const user_id = user._id as ObjectId
  const result = await userService.login({
    user_id: user_id.toString(),
    verify: UserVerifyStatus.Verified
  })

  return res.json({
    message: USER_MESSAGES.LOGIN_SUCCESS,
    result
  })
}

/**
 * Handles the OAuth flow for the API.
 *
 * @param {Request} req - The request object containing the query parameters.
 * @param {Response} res - The response object used to redirect the user.
 * @return {void} - This function does not return a value.
 */
export const oAuthController = async (req: Request, res: Response) => {
  const { code } = req.query
  const result = await userService.oAuth(code as string)
  const urlRedirect = `${process.env.CLIENT_REDIRECT_CALLBACK}?access_token=${result.access_token}&refresh_token=${result.refresh_token}&new_user=${result.newUser}&verify=${result.verify}`

  return res.redirect(urlRedirect)
}

/**
 * Registers a new user.
 *
 * @param {Request<ParamsDictionary, any, RegisterRequestBody>} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function.
 * @return {Promise<any>} A promise that resolves to the registration result.
 */
export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await userService.register(req.body)
  return res.json({
    message: USER_MESSAGES.REGISTER_SUCCESS,
    result
  })
}

/**
 * Logout controller function.
 *
 * @param {Request<ParamsDictionary, any, LogoutReqBody>} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<Response>} The JSON response containing the result.
 */
export const logoutController = async (req: Request<ParamsDictionary, any, LogoutReqBody>, res: Response) => {
  const { refresh_token } = req.body
  const result = await userService.logout(refresh_token)
  return res.json({
    result
  })
}

export const refreshTokenController = async (req: Request<ParamsDictionary, any, RefreshTokenReqBody>, res: Response) => {
  const { user_id, verify } = req.decoded_refresh_token as TokenPayload
  const { refresh_token } = req.body
  const result = await userService.refreshToken({user_id, verify, refresh_token})
  return res.json({
    message: USER_MESSAGES.REFRESH_TOKEN_SUCCESS,
    result
  })
}

/**
 * Controller function to verify user email.
 *
 * @param {Request<ParamsDictionary, any, VerifyEmailReqBody>} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function.
 * @return {Promise<void>} Promise that resolves to void.
 */
export const verifyEmailController = async (
  req: Request<ParamsDictionary, any, VerifyEmailReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_email_verify_token as TokenPayload
  const user = await databaseService.users.findOne({
    _id: new ObjectId(user_id)
  })

  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USER_MESSAGES.USER_NOT_FOUND
    })
  }

  if (user.email_verify_token === '') {
    return res.json({
      message: USER_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE
    })
  }

  try {
    const result = await userService.verifyEmail(user_id)

    return res.json({
      message: USER_MESSAGES.EMAIL_VERIFY_SUCCESS,
      result
    })
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Đã xảy ra lỗi trong quá trình xác minh email.'
    })
  }
}

/**
 * Resends the verification email to a user.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function.
 * @return {Promise<Response>} The response containing the result of the resend.
 */
export const resendVerifyEmailController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USER_MESSAGES.USER_NOT_FOUND
    })
  }
  if (user.verify === UserVerifyStatus.Verified) {
    return res.json({
      message: USER_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE
    })
  }
  const result = await userService.resendVerifyEmail(user_id)
  return res.json(result)
}

/**
 * Controller function for handling forgot password requests.
 *
 * @param {Request<ParamsDictionary, any, ForgotPasswordReqBody>} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @return {Promise<Response>} The JSON response containing the result of the forgot password operation.
 */
export const forgotPasswordController = async (
  req: Request<ParamsDictionary, any, ForgotPasswordReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { _id, verify } = req.user as User
  const result = await userService.forgotPassword({
    user_id: (_id as ObjectId)?.toString(),
    verify: UserVerifyStatus.Verified
  })
  return res.json(result)
}

/**
 * Verify the forgot password controller.
 *
 * @param {Request<ParamsDictionary, any, VerifyForgotPasswordReqBody>} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function.
 * @return {any} The JSON response with the success message.
 */
export const verifyForgotPasswordController = async (
  req: Request<ParamsDictionary, any, VerifyForgotPasswordReqBody>,
  res: Response,
  next: NextFunction
) => {
  return res.json({
    message: USER_MESSAGES.VERIFY_FORGOT_PASSWORD_SUCCESS
  })
}

/**
 * Resets the password for a user.
 *
 * @param {Request<ParamsDictionary, any, ResetPasswordReqBody>} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function.
 * @return {Promise<void>} - Returns a promise that resolves to void.
 */
export const resetPasswordsController = async (
  req: Request<ParamsDictionary, any, ResetPasswordReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_forgot_password_token as TokenPayload
  const { password } = req.body
  const result = await userService.resetPassword(user_id, password)
  return res.json({
    message: USER_MESSAGES.RESET_PASSWORD_SUCCESS,
    result
  })
}

/**
 * Retrieves the user's information.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function.
 * @return {Promise<any>} The JSON response containing the user's information.
 */
export const getMeController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await userService.getMe(user_id)
  return res.json({
    message: USER_MESSAGES.GET_ME_SUCCESS,
    result
  })
}

/**
 * Updates the user information.
 *
 * @param {Request<ParamsDictionary, any, UpdateMeReqBody>} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function.
 * @return {Promise<void>} A promise that resolves with the updated user information.
 */
export const updateMeController = async (
  req: Request<ParamsDictionary, any, UpdateMeReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { body } = req
  const user = await userService.updateMe(user_id, body)
  return res.json({
    message: USER_MESSAGES.UPDATE_ME_SUCCESS,
    result: user
  })
}

/**
 * Retrieves the profile of a user.
 *
 * @param {Request<GetProfileReqParams>} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function.
 * @return {Promise<void>} - A promise that resolves to the JSON response containing the user profile.
 */
export const getProfileController = async (req: Request<GetProfileReqParams>, res: Response, next: NextFunction) => {
  const { username } = req.params
  const user = await usersService.getProfile(username)

  return res.json({
    message: USER_MESSAGES.GET_PROFILE_SUCCESS,
    result: user
  })
}

/**
 * Controller function to handle following a user.
 *
 * @param {Request<ParamsDictionary, any, FollowReqBody>} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @return {Promise<Response>} The JSON response.
 */
export const followController = async (
  req: Request<ParamsDictionary, any, FollowReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { followed_user_id } = req.body
  const result = await usersService.follow(user_id, followed_user_id)
  return res.json(result)
}

/**
 * Unfollows a user.
 *
 * @param {Request<UnFollowReqParams>} req - the request object
 * @param {Response} res - the response object
 * @param {NextFunction} next - the next function
 * @return {Promise<void>} - a promise that resolves with no value
 */
export const unFollowController = async (req: Request<UnFollowReqParams>, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { user_id: followed_user_id } = req.params
  const result = await usersService.unFollow(user_id, followed_user_id)
  return res.json(result)
}

/**
 * Handles the request to change the user's password.
 *
 * @param {Request<ParamsDictionary, any, ChangePasswordReqBody>} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @return {Promise<Response>} The response object with the result of the password change.
 */
export const changePasswordController = async (
  req: Request<ParamsDictionary, any, ChangePasswordReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { new_password } = req.body
  const result = await usersService.changePassword(user_id, new_password)
  return res.json(result)
}
