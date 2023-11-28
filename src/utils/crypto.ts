import { createHash } from 'crypto'
import { config } from 'dotenv'
config()

/**
 * Generates the SHA256 hash of the given content.
 *
 * @param {string} content - The content to hash.
 * @return {string} The SHA256 hash of the content.
 */
export function sha256(content: string) {
  return createHash('sha256').update(content).digest('hex')
}

/**
 * Hashes a password by combining it with a secret and using the SHA256 algorithm.
 *
 * @param {string} password - The password to hash.
 * @return {string} - The hashed password.
 */
export function hashPassword(password: string) {
  return sha256(password + process.env.PASSWORD_SECRET)
}
