import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import path from "path";

export const config = {
  api: {
    bodyParser: false, // Disable default body parsing for file upload
  },
};

const region = process.env.AWS_REGION!;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID!;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY!;

// Configure AWS S3 client
const s3 = new S3Client({
  region: region,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
});

// Function to upload CSV to S3
async function uploadCSVToS3(filePath: string) {
  const fileContent = fs.readFileSync(filePath);
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: `uploads/${path.basename(filePath)}`,
    Body: fileContent,
  };

  try {
    const command = new PutObjectCommand(params);
    await s3.send(command);
    return {
      success: true,
      location: `https://${process.env.AWS_BUCKET_NAME}.s3.${
        process.env.AWS_REGION
      }.amazonaws.com/uploads/${path.basename(filePath)}`,
    };
  } catch (error) {
    console.error("Error uploading CSV to S3:", error);
    return { success: false };
  }
}

export async function POST(request: NextRequest) {
  const formData = await request.formData(); // Get the form data

  // Handle multiple files
  const files = formData.getAll("files"); // Get all files from the input (note 'files' should match the input field's name)

  if (!files || files.length === 0) {
    return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
  }

  const uploadedFiles = [];

  for (const file of files) {
    if (!(file instanceof File)) {
      continue; // Skip if it's not a valid file
    }

    const buffer = await file.arrayBuffer(); // Get the file as an ArrayBuffer
    const filePath = path.join(process.cwd(), file.name); // Create a temp file path

    // Write the file to the temp path
    fs.writeFileSync(filePath, Buffer.from(buffer));

    // Upload the file to S3
    const s3UploadResult = await uploadCSVToS3(filePath);

    // Cleanup: Delete the temporary file after upload
    fs.unlinkSync(filePath);

    if (s3UploadResult.success) {
      uploadedFiles.push(s3UploadResult.location); // Collect the uploaded file URLs
    } else {
      return NextResponse.json(
        { error: `Failed to upload file: ${file.name}` },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({
    message: "Files uploaded successfully!",
    urls: uploadedFiles, // Return all uploaded file URLs
  });
}
