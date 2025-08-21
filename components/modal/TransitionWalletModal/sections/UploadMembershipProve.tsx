"use client";

import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import { uploadFiles } from "@/api/file-upload";
import { useSettingModal } from "@/contexts/modal-setting";

const UploadMembershipProve: React.FC<{
  next: () => void;
  back: () => void;
  handleToggleModal: () => void;
}> = ({ next, back, handleToggleModal }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const { updateModalData } = useSettingModal();
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
      return response.data?.files?.[0]?.url 
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

      updateModalData("transitionWalletModal", {
        fileUrl,
      });

    
      next();
    } catch (error) {
      console.log(error);
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

      // Check file type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "application/pdf",
        "text/csv",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];

      if (!allowedTypes.includes(file.type)) {
        setUploadError("Only JPEG/PNG/PDF/CSV/XLSX files are accepted");
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

  return (
    <>
      <div className="max-h-[70vh] w-full overflow-x-auto">
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
            <h2 className="text-xl font-bold">Upload your document</h2>
            <p className="text-[14px] text-divider-200 mb-6">
              Upload document containing proof of fund from the member.
            </p>

            <div className="mb-4 w-full">
              <label
                htmlFor="file-upload"
                className="cursor-pointer block w-full"
              >
                <div
                  className="w-full h-[220px] bg-[#F3F4F6] flex flex-col items-center justify-center text-center rounded-md px-4 border-gray-300 hover:border-gray-400 transition-colors"
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
                    Only PDF/CSV/XLSX types are accepted. The maximum file size
                    is 100 MB
                  </p>
                </div>
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/*,application/pdf,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
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

        <div className="flex justify-end bg-white p-3 gap-3">
          <button
            className="px-8 py-2 text-primary bg-white rounded-md border border-gray-600"
            onClick={() => back()}
            disabled={isUploading}
          >
            Go Back
          </button>
          <button
            className="px-8 py-2 bg-primary text-white rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={handleNext}
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Next"}
          </button>
        </div>
      </div>
    </>
  );
};

export default UploadMembershipProve;
