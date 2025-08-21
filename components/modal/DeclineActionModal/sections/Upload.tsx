"use client";

import { useState } from "react";
import { IoClose } from "react-icons/io5";

import { FaPlus } from "react-icons/fa6";

const Upload: React.FC<{
  next: () => void;
  back: () => void;
  handleToggleModal: () => void;
  onComplete: () => void;
  isRejecting: boolean;
}> = ({ isRejecting, onComplete, back, handleToggleModal }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);



  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
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
                htmlFor="image-upload"
                className="cursor-pointer block w-full"
              >
                <div className="w-full h-[220px] bg-[#F3F4F6] flex flex-col items-center justify-center text-center rounded-md px-4">
                  <FaPlus className="text-xl text-gray-800 mb-2" />
                  <h1 className="font-inter text-md text-gray-800 mb-1">
                    Drag and drop your document
                  </h1>
                  <p className="font-inter text-sm text-gray-500">
                    Only JPEG/PNG/PDF/CSV/XLSX types are accepted. The maximum
                    file size is 100 MB
                  </p>
                </div>
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*,application/pdf,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                onChange={handleImageChange}
                className="hidden"
              />

              {selectedImage && (
                <div className="mt-3 text-sm text-gray-700">
                  <strong></strong> {selectedImage.name}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end bg-white p-3 gap-3">
          <button
            className="px-8 py-2 text-primary bg-white rounded-md border border-gray-600"
            onClick={() => back()}
          >
            Go Back
          </button>
          <button
            className="px-8 py-2 bg-primary text-white rounded-md"
            onClick={() =>  onComplete()}
          >
            {isRejecting ? "Declining..." : "Decline"}
          </button>
        </div>
      </div>
    </>
  );
};

export default Upload;
