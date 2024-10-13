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
          `Files successfully uploaded`
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
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
  <h2 className="text-2xl font-semibold mb-4 text-center">Upload Inventory Data</h2>
  
  <div className="mb-4">
    <label
      htmlFor="fileUpload"
      className="block mb-2 text-sm font-medium text-gray-700"
    >
      Select CSV Files:
    </label>
    <input
      type="file"
      id="fileUpload"
      accept=".csv"
      multiple
      onChange={handleFileChange}
      className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
    <p className="mt-2 text-sm text-gray-500">
      You can select multiple CSV files. Accepted format: <strong>.csv</strong>
    </p>
  </div>

  <button
    type="submit"
    className="w-full px-4 py-2 bg-orange-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
  >
    Upload CSV Files
  </button>

  {uploadStatus && (
    <p className="mt-4 text-center text-sm text-green-500">{uploadStatus}</p>
  )}
</form>

  );
}
