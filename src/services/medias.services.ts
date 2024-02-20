import { config } from 'dotenv'
import { Request } from 'express'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { isProduction } from '~/constants/config'
import { UPLOAD_IMAGE_DIR } from '~/constants/dir'
import { MediaType } from '~/constants/enums'
import { Media } from '~/models/Other'
import { getNameFromFullName, handleUploadImage, handleUploadVideo } from '~/utils/file'

config()
class MediaService {
  /**
   * Uploads an image from the request and processes it before returning the resulting media objects.
   *
   * @param {Request} req - the request object containing the image to upload
   * @return {Promise<Media[]>} an array of media objects representing the uploaded and processed images
   */
  async uploadImage(req: Request) {
    const files = await handleUploadImage(req)
    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const newName = getNameFromFullName(file.newFilename)
        const newPath = path.resolve(UPLOAD_IMAGE_DIR, `${newName}.jpg`)
        await sharp(file.filepath).jpeg({ quality: 50 }).toFile(newPath)

        // Wait for sharp processing to complete before unlinking the file
        fs.unlinkSync(file.filepath)

        return {
          url: isProduction
            ? `${process.env.HOST}/static/image/${newName}.jpg`
            : `http://localhost:${process.env.PORT ? process.env.PORT : 4000}/static/image/${newName}.jpg`,
          type: MediaType.Image
        }
      })
    )

    return result
  }

  /**
   * Uploads a video based on the given request.
   *
   * @param {Request} req - the request object containing the video to be uploaded
   * @return {Media[]} an array of Media objects representing the uploaded videos
   */
  async uploadVideo(req: Request) {
    const files = await handleUploadVideo(req)
    const result: Media[] = files.map((file) => {
      return {
        url: isProduction
          ? `${process.env.HOST}/static/video/${file.newFilename}`
          : `http://localhost:${process.env.PORT ? process.env.PORT : 4000}/static/video/${file.newFilename}`,
        type: MediaType.Video
      }
    })

    return result
  }
}

const mediasService = new MediaService()

export default mediasService
