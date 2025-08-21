"use client";

import Image from "next/image";
import { FaChevronRight } from "react-icons/fa6";
import { FaLink, FaSpinner } from "react-icons/fa";

interface LinkItem {
  id: string;
  url: string;
  title?: string;
  domain: string;
  icon?: string;
  timestamp: string;
}

interface LinksProps {
  isLoading?: boolean;
  linksData?: LinkItem[];
}

const Links: React.FC<LinksProps> = ({ isLoading = false, linksData = [] }) => {
  // Group links by date
  const groupedLinks = linksData.reduce((acc, link) => {
    const date = new Date(link.timestamp).toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(link);
    return acc;
  }, {} as Record<string, LinkItem[]>);

  const displayLinks = Object.keys(groupedLinks).length > 0 ? groupedLinks : null;

  // Loading state
  if (isLoading) {
    return (
      <div className="max-h-[40vh] w-full overflow-y-auto">
        <div className="flex flex-col items-center justify-center py-12">
          <FaSpinner className="animate-spin text-gray-400 text-2xl mb-3" />
          <p className="text-gray-500 text-sm">Loading links...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!displayLinks) {
    return (
      <div className="max-h-[40vh] w-full overflow-y-auto">
        <div className="flex flex-col items-center justify-center py-12">
          <FaLink className="text-gray-300 text-3xl mb-3" />
          <p className="text-gray-500 text-sm">No links found</p>
          <p className="text-gray-400 text-xs mt-1">Shared links will appear here</p>
        </div>
      </div>
    );
  }

  // Content with data
  return (
    <div className="max-h-[40vh] w-full overflow-y-auto">
      {Object.entries(displayLinks).map(([date, links]) => (
        <div key={date} className="w-full px-4 py-2 mt-4">
          <h1 className="text-sm font-medium text-gray-500 mb-3">
            {date}
          </h1>
          {links.map((link) => (
            <div key={link.id} className="flex items-start justify-between border border-gray-400 rounded-md p-3 mb-2 hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex items-start gap-3">
                <Image
                  src={link.icon || "/icon/link.svg"}
                  alt="link"
                  width={40}
                  height={40}
                  className="shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-black font-medium truncate">
                    {link.title || link.url}
                  </p>
                  <span className="text-xs text-gray-400">{link.domain}</span>
                </div>
              </div>
              <FaChevronRight className="text-gray-400 mt-1 shrink-0" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Links;
