import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import path from "path";
import axios from "axios"; // Add axios for HTTP requests

export const config = {
  api: {
    bodyParser: false,
  },
};

// AWS S3 configuration
const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Function to upload CSV to S3
async function uploadCSVToS3(filePath: string, userId: string) {
  const fileContent = fs.readFileSync(filePath);

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: `uploads/${userId}/${path.basename(filePath)}`,
    Body: fileContent,
  };

  try {
    const command = new PutObjectCommand(params);
    await s3.send(command);
    return {
      success: true,
      location: `https://${process.env.AWS_BUCKET_NAME}.s3.${
        process.env.AWS_REGION
      }.amazonaws.com/uploads/${userId}/${path.basename(filePath)}`,
    };
  } catch (error) {
    console.error("Error uploading CSV to S3:", error);
    return { success: false };
  }
}

// Function to trigger Databricks job
async function triggerDatabricksJob(s3Paths: string[]) {
  const url = `https://dbc-f53a120f-3946.cloud.databricks.com/api/2.0/jobs/run-now`;
  const jobId = "17018373764833"; // replace with your actual job ID

  try {
    const response = await axios.post(
      url,
      {
        job_id: jobId,
        notebook_params: { file_paths: s3Paths.join(",") }, // Pass multiple S3 paths as a comma-separated string
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.DATABRICKS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error triggering Databricks job:", error);
    throw new Error("Failed to trigger Databricks job.");
  }
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const userId = formData.get("userId") as string;

  if (!userId) {
    return NextResponse.json(
      { error: "User ID not provided" },
      { status: 400 }
    );
  }

  const files = formData.getAll("files");

  if (!files || files.length === 0) {
    return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
  }

  const uploadedFiles = [];
  const s3Paths = []; // Array to collect S3 paths

  for (const file of files) {
    if (!(file instanceof File)) {
      continue;
    }

    const buffer = await file.arrayBuffer();
    const filePath = path.join(process.cwd(), file.name);
    fs.writeFileSync(filePath, Buffer.from(buffer));
    const s3UploadResult = await uploadCSVToS3(filePath, userId);
    fs.unlinkSync(filePath);

    if (s3UploadResult.success) {
      uploadedFiles.push(s3UploadResult.location);
      s3Paths.push(s3UploadResult.location); // Collect S3 paths
    } else {
      return NextResponse.json(
        { error: `Failed to upload file: ${file.name}` },
        { status: 500 }
      );
    }
  }

  // Trigger Databricks job with multiple file paths
  await triggerDatabricksJob(
    s3Paths.filter((path): path is string => path !== undefined)
  );

  return NextResponse.json({
    message: "Files uploaded and Databricks job triggered successfully!",
    urls: uploadedFiles,
  });
}
