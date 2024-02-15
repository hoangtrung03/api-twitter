import { Request } from 'express'
import formidable, { File } from 'formidable'
import fs from 'fs'
import { UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_DIR, UPLOAD_VIDEO_TEMP_DIR } from '~/constants/dir'

/**
 * Initializes a folder for uploading files.
 *
 * @return {void} No return value.
 */
export const initFolder = () => {
  ;[UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_TEMP_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true // create parent folder nested
      })
    }
  })
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
    uploadDir: UPLOAD_IMAGE_TEMP_DIR,
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

      // eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(files.image)) {
        return reject(new Error('File is required'))
      }

      resolve(files.image as File[])
    })
  })
}

export const handleUploadVideo = async (req: Request) => {
  // Way import formidable with commonjs
  // const formidable = (await import('formidable')).default
  const form = formidable({
    uploadDir: UPLOAD_VIDEO_DIR,
    maxFiles: 1,
    keepExtensions: true,
    maxFileSize: 50 * 1024 * 1024, // 50 MB
    filter: function ({ name, originalFilename, mimetype }) {
      return true
      // const valid = name === 'image' && Boolean(mimetype?.includes('image/'))

      // if (!valid) {
      //   form.emit('error' as any, new Error('Invalid file type') as any)
      // }

      // return valid
    }
  })

  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }

      // eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(files.video)) {
        return reject(new Error('File is required'))
      }

      resolve(files.video as File[])
    })
  })
}

export const getNameFromFullName = (fullName: string) => {
  const nameArr = fullName.split('.')
  nameArr.pop()

  return nameArr.join('')
}
