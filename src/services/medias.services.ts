import { config } from 'dotenv';
import { Request } from 'express';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { isProduction } from '~/constants/config';
import { UPLOAD_DIR } from '~/constants/dir';
import { MediaType } from '~/constants/enums';
import { Media } from '~/models/Other';
import { getNameFromFullName, handleUploadImage } from '~/utils/file';

config();
class MediaService {
  async handleUploadImage(req: Request) {
    const files = await handleUploadImage(req);
    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const newName = getNameFromFullName(file.newFilename);
        const newPath = path.resolve(UPLOAD_DIR, `${newName}.jpg`);
        await sharp(file.filepath).jpeg({ quality: 50 }).toFile(newPath);
        
        // Wait for sharp processing to complete before unlinking the file
        fs.unlinkSync(file.filepath);

        return {
          url: isProduction
            ? `${process.env.HOST}/static/${newName}.jpg`
            : `http://localhost:${process.env.PORT}/static/${newName}.jpg`,
          type: MediaType.Image
        };
      })
    );

    return result;
  }
}

const mediasService = new MediaService();

export default mediasService;
