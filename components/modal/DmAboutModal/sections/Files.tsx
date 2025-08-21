"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { FileIcon, Loader2 } from "lucide-react";

interface FileItem {
  id: string;
  name: string;
  type: string;
  icon: string;
  date: string;
  size?: string;
}

interface FilesProps {
  isLoading?: boolean;
  filesData?: FileItem[];
}

const defaultFiles: FileItem[] = [
  // {
  //   id: "1",
  //   name: "Outreach report (1).pdf",
  //   type: "Word",
  //   icon: "/icon/word.svg",
  //   date: "Saturday, 10th May, 2025",
  //   size: "2.4 MB"
  // },
  // {
  //   id: "2",
  //   name: "Outreach report (1).pdf",
  //   type: "PDF",
  //   icon: "/icon/pdf.svg",
  //   date: "Saturday, 10th May, 2025",
  //   size: "1.8 MB"
  // },
  // {
  //   id: "3",
  //   name: "Outreach report (1).pdf",
  //   type: "PDF",
  //   icon: "/icon/pdf.svg",
  //   date: "Monday, 5th May, 2025",
  //   size: "3.2 MB"
  // }
];

const Files: React.FC<FilesProps> = ({ isLoading = false, filesData }) => {
  const [loading, setLoading] = useState(isLoading);
  const displayFiles = filesData || defaultFiles;

  useEffect(() => {
    if (isLoading) {
      setLoading(true);
      // Simulate loading time
      const timer = setTimeout(() => setLoading(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // Group files by date
  const groupedFiles = displayFiles.reduce((acc, file) => {
    const date = file.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(file);
    return acc;
  }, {} as Record<string, FileItem[]>);

  // Loading state
  if (loading) {
    return (
      <div className="max-h-[40vh] w-full overflow-y-auto">
        <div className="flex flex-col items-center justify-center h-40 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <p className="text-sm text-gray-500">Loading files...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!displayFiles || displayFiles.length === 0) {
    return (
      <div className="max-h-[40vh] w-full overflow-y-auto">
        <div className="flex flex-col items-center justify-center h-40 space-y-4">
          <div className="p-4 bg-gray-100 rounded-full">
            <FileIcon className="h-8 w-8 text-gray-400" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm font-medium text-gray-600">No files found</p>
            <p className="text-xs text-gray-400">
              Documents and files shared in this conversation will appear here
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Files list
  return (
    <div className="max-h-[40vh] w-full overflow-y-auto">
      {Object.entries(groupedFiles).map(([date, files]) => (
        <div key={date} className="w-full px-4 py-2 mt-4">
          <h1 className="text-sm font-medium text-gray-500 mb-3">{date}</h1>
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-start justify-between border border-gray-200 bg-gray-100 rounded-md p-3 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <Image
                    src={file.icon}
                    alt={file.type}
                    width={40}
                    height={40}
                    className="shrink-0"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-black font-medium truncate">
                      {file.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-400">{file.type}</span>
                      {file.size && (
                        <>
                          <span className="text-xs text-gray-300">•</span>
                          <span className="text-xs text-gray-400">{file.size}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Files;
