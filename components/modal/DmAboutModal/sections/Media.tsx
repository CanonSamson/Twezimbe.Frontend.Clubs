"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { ImageIcon, Loader2 } from "lucide-react";

interface MediaProps {
  isLoading?: boolean;

}

const Media: React.FC<MediaProps> = ({ isLoading = false }) => {
  const [loading, setLoading] = useState(isLoading);
  const displayMedia: string[] = []

  useEffect(() => {
    if (isLoading) {
      setLoading(true);
      // Simulate loading time
      const timer = setTimeout(() => setLoading(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // Loading state
  if (loading) {
    return (
      <div className="max-h-[40vh] w-full overflow-y-auto p-3">
        <div className="flex flex-col items-center justify-center h-40 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <p className="text-sm text-gray-500">Loading media...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!displayMedia || displayMedia.length === 0) {
    return (
      <div className="max-h-[40vh] w-full overflow-y-auto p-3">
        <div className="flex flex-col items-center justify-center h-40 space-y-4">
          <div className="p-4 bg-gray-100 rounded-full">
            <ImageIcon className="h-8 w-8 text-gray-400" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm font-medium text-gray-600">No media found</p>
            <p className="text-xs text-gray-400">
              Photos and videos shared in this conversation will appear here
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Media grid
  return (
    <div className="max-h-[40vh] w-full overflow-y-auto p-3">
      <div className="grid grid-cols-4 gap-1.5">
        {displayMedia.map((src, index) => (
          <div key={index} className="p-2">
            <Image
              src={src}
              alt="media"
              width={80}
              height={80}
              className="rounded-md w-full h-auto object-contain hover:opacity-80 transition-opacity cursor-pointer"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Media;
