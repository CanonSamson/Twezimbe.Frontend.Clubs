"use client";

import { uploadFile } from "@/api/upload";
import { useState } from "react";

import { v4 } from "uuid";

export const useInChatFileUpload = () => {
  const [fileUrls, setFileUrls] = useState<{
    [key: string]: {
      url: string;
      id: string;
      file: File | null;
      uploading: boolean;
      completed: boolean;
      name: string;
      size: number;
      type: string;
    };
  }>({});

  const [uploadingFiles, setUploadingFiles] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState(false);

  const upload = async (file: File) => {
    try {
      const response = await uploadFile(file);
      if (!response?.data?.success) {
        throw new Error("Failed to upload file");
      }
      if (response.data.url) {
        return response.data.url;
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleAddFiles = async (files: File[]) => {
    // First update the state with new files
    const newFiles = files.reduce((acc, file) => {
      const id = v4();

      acc[id] = {
        url: URL.createObjectURL(file),
        id,
        file: file,
        uploading: true,
        completed: false,
        name: file.name,
        size: file.size,
        type: file.type,
      };
      return acc;
    }, {} as typeof fileUrls);

    // Update both states
    setFileUrls((prev) => ({ ...prev, ...newFiles }));

    // Start upload process
    await uploadFiles(newFiles);
  };

  const uploadFiles = async (files: typeof fileUrls) => {
    setUploadingFiles(true);
    try {
      const updatedFiles = { ...files };

      const uploadPromises = Object.values(files)
        .filter((file) => !file.completed)
        .map(async (file) => {
          try {
            const url = await upload(file.file as File);
            if (url) {
              updatedFiles[file.id] = {
                ...file,
                uploading: false,
                completed: true,
                url: url,
              };
            }
          } catch (error) {
            console.error("Error uploading file:", error);
            updatedFiles[file.id] = {
              ...file,
              uploading: false,
              completed: false,
            };
          }
        });

      await Promise.all(uploadPromises);
      setFileUrls(updatedFiles); // <- single state update here
    } catch (error) {
      console.log(error);
    } finally {
      setUploadingFiles(false);
    }
  };

  const handleRemoveFile = (id: string) => {
    setFileUrls((prev) => {
      const newFiles = { ...prev };
      delete newFiles[id];
      return newFiles;
    });
  };

  const handleClearFiles = () => {
    setFileUrls({});
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    e.preventDefault();
    handleDragLeave(e);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      try {
        handleAddFiles(Array.from(files));
        // Handle successful upload (e.g., refresh messages)
      } catch (error) {
        // Handle upload error
        console.error("Upload failed:", error);
      }
    }
    // Handle file drop logic here if needed
  };
  return {
    handleDrop,
    handleDragOver,
    isDragging,
    handleRemoveFile,
    handleAddFiles,
    fileUrls,
    setFileUrls,
    handleClearFiles,
    handleDragLeave,
    uploadingFiles
  };
};
