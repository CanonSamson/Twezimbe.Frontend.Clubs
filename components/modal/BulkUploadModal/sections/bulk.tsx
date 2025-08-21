"use client";

import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import { uploadFiles } from "@/api/file-upload";

const Bulk: React.FC<{
  handleToggleModal: () => void;
}> = ({ handleToggleModal }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setUploadError(null); // Clear any previous errors
      setUploadedFileUrl(null); // Clear any previous upload URL
    }
  };

  const uploadFile = async (file: File) => {
    try {
      const response = await uploadFiles([file]);
      if (!response?.data?.success) {
        throw new Error("Failed to upload file");
      }
      return response.data.files[0].url;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw new Error("Failed to upload file");
    }
  };

  const handleNext = async () => {
    if (!selectedFile) {
      setUploadError("Please select a file to upload");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const fileUrl = await uploadFile(selectedFile);
      setUploadedFileUrl(fileUrl);

      // Process the uploaded file or navigate to next step
      // You might want to parse the CSV/Excel file here or pass the URL to a parent component
      console.log("File uploaded successfully:", fileUrl);

      // For now, we'll just close the modal after successful upload
      // You can modify this based on your needs
      handleToggleModal();
    } catch (error) {
      console.log(error)
      setUploadError("Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];

      // Check file type - for bulk upload, we primarily want CSV/Excel files
      const allowedTypes = [
        "text/csv",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
        "application/pdf",
        "image/jpeg",
        "image/png",
      ];

      if (!allowedTypes.includes(file.type)) {
        setUploadError("Only CSV/XLSX/PDF/JPEG/PNG files are accepted");
        return;
      }

      // Check file size (100MB = 100 * 1024 * 1024 bytes)
      if (file.size > 100 * 1024 * 1024) {
        setUploadError("File size must be less than 100MB");
        return;
      }

      setSelectedFile(file);
      setUploadError(null);
      setUploadedFileUrl(null);
    }
  };

  const handleDownloadTemplate = () => {
    // You can implement template download logic here
    // For example, create a CSV template or fetch from your API
    console.log("Download template clicked");
    // Example: window.open('/api/download-template', '_blank');
  };

  return (
    <div className="max-h-[80vh] w-full overflow-x-auto">
      <div className="p-6">
        <div className="flex justify-end items-center mb-4">
          <button
            className="text-divider-200 hover:text-divider-300 duration-500 transition-colors"
            onClick={() => handleToggleModal()}
          >
            <IoClose size={34} />
          </button>
        </div>

        <div className="text-start mt-5">
          <h2 className="text-xl font-bold">Bulk Upload Members</h2>
          <p className="text-[14px] text-divider-200 mb-6">
            Easily upload member information in bulk using our standardized
            template. This ensures all data is clean, consistent, and ready to
            use across the platform.
          </p>

          <div className="mb-5">
            <h1 className="font-semibold">Step 1:</h1>
            <div className="flex items-center gap-2 mt-2">
              {/* <PiDownloadSimple className="text-2xl text-primary" /> */}
              <span className="text-sm text-gray-400">
                Download the member upload template{" "}
                <span
                  className="text-primary underline cursor-pointer hover:text-primary/80"
                  onClick={handleDownloadTemplate}
                >
                  here
                </span>
              </span>
            </div>
          </div>

          <div className="mb-5">
            <h2 className="font-semibold">Step 2:</h2>
            <div className="flex items-center gap-2 mt-2">
              {/* <MdInsertDriveFile className="text-primary text-[50px]" /> */}
              <span className="text-sm text-gray-400">
                Fill in the template with your member details. Make sure all
                required fields are completed and formatted correctly.
              </span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold">Step 3:</h3>
            <div className="flex items-center gap-2 mt-2">
              {/* <PiUploadSimple className="text-primary text-[50px]" /> */}
              <span className="text-sm text-gray-400">
                Upload your completed file below. Drag and drop your document or
                click to browse.
              </span>
            </div>
          </div>

          <div className="mb-4 w-full">
            <label
              htmlFor="file-upload"
              className="cursor-pointer block w-full"
            >
              <div
                className="w-full h-[220px] bg-[#F3F4F6] flex flex-col items-center justify-center text-center rounded-md px-4 border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors"
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <FaPlus className="text-xl text-gray-800 mb-2" />
                <h1 className="font-inter text-md text-gray-800 mb-1">
                  Drag and drop your document
                </h1>
                <p className="font-inter text-sm text-gray-500">
                  Only CSV/XLSX/PDF/JPEG/PNG types are accepted. The maximum
                  file size is 100 MB
                </p>
              </div>
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".csv,.xlsx,.xls,application/pdf,image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {selectedFile && (
              <div className="mt-3 text-sm text-gray-700">
                <strong>Selected file:</strong> {selectedFile.name}
              </div>
            )}

            {uploadError && (
              <div className="mt-3 text-sm text-red-600">{uploadError}</div>
            )}

            {uploadedFileUrl && (
              <div className="mt-3 text-sm text-green-600">
                File uploaded successfully!
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex bg-white p-3 gap-14">
        <button
          className="w-1/2 px-4 py-2 text-primary bg-white rounded-md border border-gray-600"
          onClick={() => handleToggleModal()}
          disabled={isUploading}
        >
          Go Back
        </button>
        <button
          className="w-1/2 px-4 py-2 bg-primary text-white rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
          onClick={handleNext}
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Upload & Process"}
        </button>
      </div>
    </div>
  );
};

export default Bulk;
