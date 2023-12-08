import { Request } from 'express'
import formidable from 'formidable'
import fs from 'fs'
import path from 'path'

/**
 * Initializes a folder for uploading files.
 *
 * @return {void} No return value.
 */
export const initFolder = () => {
    const uploadFolderPath = path.resolve('uploads')

    if(!fs.existsSync(uploadFolderPath)){
        fs.mkdirSync(uploadFolderPath, {
            recursive: true // create parent folder nested
        })
    }
}

/**
 * Handles the upload of a single image.
 *
 * @param {Request} req - The request object.
 * @return {Promise} - A promise that resolves to the uploaded files.
 */
export const handleUploadSingleImage = async (req: Request) => {
    // Way import formidable with commonjs
  // const formidable = (await import('formidable')).default
  const form = formidable({
    uploadDir: path.resolve('uploads'),
    maxFiles: 1,
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024, // 5 MB
    filename(name: string, ext: string, part: any, form: any): string {
      return part.originalFilename || ''
    },
    filter: function({name, originalFilename, mimetype}) {
        const valid = name === 'image' && Boolean(mimetype?.includes('image/'))

        if(!valid){
            form.emit('error' as any, new Error('Invalid file type') as any)
        }

        return valid
    }
    
  })

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
        if (err) {
          return reject(err)
        }

        if(!Boolean(files.image)){
            return reject(new Error('File is required'))
        }
    
        resolve(files)
      })
  })
}