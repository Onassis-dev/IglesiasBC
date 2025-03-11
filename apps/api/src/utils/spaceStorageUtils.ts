import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ObjectCannedACL,
} from '@aws-sdk/client-s3';
import * as dotenv from 'dotenv';
dotenv.config();

const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: 'auto',
  credentials: {
    accessKeyId: process.env.S3_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
});

export const uploadImage = async (file: any): Promise<string> => {
  const fileName = `${Date.now()}.${file.originalname.split('.').pop()}`;
  const params = {
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: fileName,
    Body: file.buffer,
    ACL: ObjectCannedACL.public_read,
  };

  await s3Client.send(new PutObjectCommand(params));

  const url = `https://cdn.iglesiasbc.com/${params.Key}`;

  return url;
};

export const deleteImage = async (url: string): Promise<void> => {
  try {
    const urlParts = new URL(url);
    const fileName = urlParts.pathname.substring(1);
    const params = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: fileName,
    };

    await s3Client.send(new DeleteObjectCommand(params));
  } catch (error) {
    console.error('Error deleting image:', error);
  }
};
