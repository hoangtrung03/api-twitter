import { RunnableValidationChains } from 'express-validator/src/middlewares/schema'
import express from 'express'
import { validationResult, ValidationChain } from 'express-validator'
import { EntityError, ErrorWithStatus } from '~/models/Errors'
import httpStatus from '~/constants/httpStatus'
// can be reused by many routes

// sequential processing, stops running validations chain if the previous one fails.
export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await validation.run(req)
    const errors = validationResult(req)
    //Khong co loi thi next tiep tuc request
    if (errors.isEmpty()) {
      return next()
    }
    const errorsObject = errors.mapped()
    const entityError = new EntityError({ errors: {} })
    for (const key in errorsObject) {
      const { msg } = errorsObject[key]
      //Tra ve loi khong phai loi do validate
      if (msg instanceof ErrorWithStatus && msg.status !== httpStatus.UNPROCESSABLE_ENTITY) {
        return next(msg)
      }
      entityError.errors[key] = errorsObject[key]
    }
    

    next(entityError)
  }
}
