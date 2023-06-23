import { RunnableValidationChains } from 'express-validator/src/middlewares/schema'
import express from 'express'
import { validationResult, ValidationChain } from 'express-validator'
import { ErrorWithStatus } from '~/models/Errors'
// can be reused by many routes

// sequential processing, stops running validations chain if the previous one fails.
export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await validation.run(req)
    const errors = validationResult(req)
    const errorsObject = errors.mapped()
    for (const key in errorsObject) {
      const { msg } = errorsObject[key]
      if (msg instanceof ErrorWithStatus && msg.status === 422) {
        errorsObject[key] = errorsObject[key].msg
      }
    }
    if (errors.isEmpty()) {
      return next()
    }

    res.status(400).json({ errors: errorsObject })
  }
}
