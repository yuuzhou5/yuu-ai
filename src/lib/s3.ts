import { S3Client } from "@aws-sdk/client-s3";

export const bucket = process.env.AWS_BUCKET_NAME;

const region = process.env.AWS_REGION || "sa-east-1";

export const s3 = new S3Client([
  {
    region,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  },
]);

export const AWSUrl = `https://${bucket}.s3.${region}.amazonaws.com/`;
