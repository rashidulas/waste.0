"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs"; // Import Clerk's useUser hook

export default function CSVUploadForm() {
  const { user } = useUser(); // Get the current authenticated user
  const [files, setFiles] = useState<File[]>([]); // Store multiple files
  const [uploadStatus, setUploadStatus] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files)); // Convert FileList to Array
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!user?.id) {
      setUploadStatus("User not authenticated.");
      return;
    }

    if (files.length === 0) {
      setUploadStatus("Please select at least one file.");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file); // Append each file to FormData
    });

    // Append the user ID from Clerk to the form data
    formData.append("userId", user.id);

    try {
      setUploadStatus("Uploading...");

      const response = await fetch("/api/upload-csv", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setUploadStatus(
          `Files successfully uploaded: ${result.urls.join(", ")}`
        );
      } else {
        setUploadStatus("Error uploading files.");
      }
    } catch (error) {
      console.error("Error uploading files", error);
      setUploadStatus("Error uploading files.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" accept=".csv" multiple onChange={handleFileChange} />
      <button type="submit">Upload CSV Files</button>
      <p>{uploadStatus}</p>
    </form>
  );
}
