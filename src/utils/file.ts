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

/**
 * Handle video upload using formidable library.
 *
 * @param {Request} req - the request object
 * @return {Promise<File[]>} a promise that resolves to an array of File objects
 */
export const handleUploadVideo = async (req: Request) => {
  // Way import formidable with commonjs
  // const formidable = (await import('formidable')).default
  const form = formidable({
    uploadDir: UPLOAD_VIDEO_DIR,
    maxFiles: 1,
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

      const videos = files.video as File[]

      videos.forEach((video) => {
        const ext = getExtension(video.originalFilename as string)
        fs.renameSync(video.filepath, video.filepath + '.' + ext)
        video.newFilename = video.newFilename + '.' + ext
      })

      resolve(files.video as File[])
    })
  })
}

/**
 * Splits the full name into an array using '.' as the delimiter, removes the last element, and then joins the elements into a single string.
 *
 * @param {string} fullName - the full name to be processed
 * @return {string} the name extracted from the full name
 */
export const getNameFromFullName = (fullName: string) => {
  const nameArr = fullName.split('.')
  nameArr.pop()

  return nameArr.join('')
}

/**
 * Splits the full name by '.' and returns the last element.
 *
 * @param {string} fullName - the full name to extract the extension from
 * @return {string} the extension extracted from the full name
 */
export const getExtension = (fullName: string) => {
  const nameArr = fullName.split('.')

  return nameArr[nameArr.length - 1]
}
