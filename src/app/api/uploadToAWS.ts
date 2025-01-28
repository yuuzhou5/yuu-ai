import { AWSUrl, bucket, s3 } from "@/lib/s3";

// import { supabase } from "@/lib/supabase";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

export async function uploadToAWS(
  file: File,
  onProgress: (progress: number) => void
): Promise<string> {
  const key = crypto.randomUUID() + "-" + file.name.replaceAll(" ", "-");
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const s3 = new S3Client({
    region: "sa-east-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  const upload = new Upload({
    client: s3,
    params: {
      Bucket: bucket,
      Key: key,
      ContentType: file.type,
      Body: buffer,
    },
  });

  upload.on("httpUploadProgress", (progress) => {
    const percentage = Math.round((progress.loaded! / progress.total!) * 100);

    onProgress(percentage);
  });

  await upload.done();

  return `${AWSUrl}${key}`;
}

export async function uploadImage(image: File) {
  const key = crypto.randomUUID() + "-" + image.name.replaceAll(" ", "-");
  const bytes = await image.arrayBuffer();
  const buffer = Buffer.from(bytes);

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: image.type,
      Body: buffer,
    })
  );

  return AWSUrl + key;
}

// export async function uploadToSupabase(
//   file: File,
//   onProgress: (progress: number) => void
// ) {
//   const key = crypto.randomUUID() + "-" + file.name.replaceAll(" ", "-");

//   const { data: urlData, error: urlError } = await supabase.storage
//     .from("yai")
//     .createSignedUploadUrl(key);

//   console.log(urlData);

//   if (urlError || !urlData?.signedUrl) {
//     throw new Error("Erro ao obter URL de upload");
//   }

//   const uploadUrl = urlData.signedUrl;

//   return new Promise<void>((resolve, reject) => {
//     const xhr = new XMLHttpRequest();

//     xhr.open("PUT", uploadUrl);
//     xhr.setRequestHeader("Content-Type", file.type);

//     xhr.upload.addEventListener("progress", (event) => {
//       if (event.lengthComputable) {
//         const progress = (event.loaded / event.total) * 100; // Percentual
//         onProgress(progress);
//       }
//     });

//     xhr.onload = () => {
//       if (xhr.status === 200) {
//         resolve();
//       } else {
//         reject(new Error("Erro ao fazer upload do arquivo"));
//       }
//     };

//     xhr.onerror = () => reject(new Error("Erro de rede durante o upload"));

//     xhr.send(file);
//   });
// }
