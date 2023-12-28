import { Request } from 'express'
import formidable, { File } from 'formidable'
import fs from 'fs'
import { UPLOAD_TEMP_DIR } from '~/constants/dir'

/**
 * Initializes a folder for uploading files.
 *
 * @return {void} No return value.
 */
export const initFolder = () => {
  if (!fs.existsSync(UPLOAD_TEMP_DIR)) {
    fs.mkdirSync(UPLOAD_TEMP_DIR, {
      recursive: true // create parent folder nested
    })
  }
}

/**
 * Handles the upload of a image.
 *
 * @param {Request} req - The request object.
 * @return {Promise} - A promise that resolves to the uploaded files.
 */
export const handleUploadImage = async (req: Request) => {
  // Way import formidable with commonjs
  // const formidable = (await import('formidable')).default
  const form = formidable({
    uploadDir: UPLOAD_TEMP_DIR,
    maxFiles: 4,
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024, // 5 MB
    maxTotalFileSize: 10 * 1024 * 1024, // 10 MB
    // filename(name: string, ext: string, part: any, form: any): string {
    //   return part.originalFilename || ''
    // },
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'image' && Boolean(mimetype?.includes('image/'))

      if (!valid) {
        form.emit('error' as any, new Error('Invalid file type') as any)
      }

      return valid
    }
  })

  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }

      if (!Boolean(files.image)) {
        return reject(new Error('File is required'))
      }

      resolve(files.image as File[])
    })
  })
}

export const getNameFromFullName = (fullName: string) => {
  const nameArr = fullName.split('.')
  nameArr.pop()

  return nameArr.join('')
}
