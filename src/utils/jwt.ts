import { config } from 'dotenv'
import jwt, { SignOptions } from 'jsonwebtoken'
import { TokenPayload } from '~/models/requests/User.requests'
config()

/**
 * Signs a JWT token using the given payload, privateKey, and options.
 *
 * @param {object} options - The options for signing the token.
 * @param {string | Buffer | object} options.payload - The payload to be included in the token.
 * @param {string} options.privateKey - The private key used for signing the token.
 * @param {SignOptions} [options.options] - The options for signing the token, default value is { algorithm: 'HS256' }.
 * @return {Promise<string>} A promise that resolves to the signed token.
 */
export const signToken = ({
  payload,
  privateKey,
  options = {
    algorithm: 'HS256'
  }
}: {
  payload: string | Buffer | object
  privateKey: string
  options?: SignOptions
}) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, privateKey, options, (error, token) => {
      if (error) {
        throw reject(error)
      }

      resolve(token as string)
    })
  })
}

/**
 * Verifies a token using the provided secret or public key.
 *
 * @param {string} token - The token to be verified.
 * @param {string} secretOrPublicKey - The secret or public key used to verify the token.
 * @return {Promise<TokenPayload>} - A promise that resolves to the decoded token payload.
 */
export const verifyToken = ({ token, secretOrPublicKey }: { token: string; secretOrPublicKey: string }) => {
  return new Promise<TokenPayload>((resolve, reject) => {
    jwt.verify(token, secretOrPublicKey, (error, decoded) => {
      if (error) {
        throw reject(error)
      }

      resolve(decoded as TokenPayload)
    })
  })
}
