import React from "react";
import { Button } from "@/components/ui/button";
import { IoCloudUploadOutline } from "react-icons/io5";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { getCaseInKindContributionSummary } from "@/api/bereavement-fund/contribution";
import { useParams } from "next/navigation";

// Define types for the API response
type VolunteerData = {
  userId: string;
  firstName: string;
  lastName: string;
  profileImage: string | null;
  userName: string;
};

type ContributionItem = {
  text: string;
  volunteerCount: number;
  volunteers: VolunteerData[];
};

type ContributionSection = {
  section: string;
  title: string;
  totalVolunteers: number;
  items: ContributionItem[];
};


const ContributionSummary = () => {
  const caseId = useParams().caseId as string;

  const { data, isPending, error } = useQuery({
    queryKey: ["contribution-summary", caseId],
    queryFn: () => getCaseInKindContributionSummary(caseId),
    enabled: !!caseId,
  });

  // Loading state
  if (isPending) {
    return (
      <div className="bg-white mt-6 rounded-xl shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-gray-300 rounded-xl p-4">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="space-y-2">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-3 bg-gray-200 rounded w-3/4"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white mt-6 rounded-xl shadow-sm p-6">
        <div className="text-center py-8">
          <p className="text-red-500 mb-2">Error loading contribution data</p>
          <p className="text-sm text-gray-600">Please try again later</p>
        </div>
      </div>
    );
  }

  // Helper function to get first volunteer name and count
  const getVolunteerText = (volunteers: VolunteerData[], totalCount: number) => {
    if (volunteers.length === 0) return "No volunteers yet";
    
    const firstVolunteer = volunteers[0];
    const firstName = firstVolunteer.firstName || firstVolunteer.userName || "Anonymous";
    const lastName = firstVolunteer.lastName || "";
    const fullName = `${firstName} ${lastName}`.trim();
    
    if (totalCount === 1) return `${fullName} will do this`;
    return `${fullName} & ${totalCount - 1} others will do this`;
  };

  // Helper function to render volunteer avatars
  const renderVolunteerAvatars = (volunteers: VolunteerData[]) => {
    const displayVolunteers = volunteers.slice(0, 8); // Show max 8 avatars
    
    return (
      <div className="flex">
        {displayVolunteers.map((volunteer, index) => (
          <div
            key={volunteer.userId}
            className={`rounded-full ${index > 0 ? '-ml-4' : ''}`}
            style={{ zIndex: displayVolunteers.length - index }}
          >
            {volunteer.profileImage ? (
              <Image
                src={volunteer.profileImage}
                alt={`${volunteer.firstName} ${volunteer.lastName}`}
                width={40}
                height={40}
                className="rounded-full border-2 border-white"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-400 border-2 border-white flex items-center justify-center text-white text-sm font-semibold">
                {(volunteer.firstName?.[0] || volunteer.userName?.[0] || "?").toUpperCase()}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Helper function to get all unique volunteers for section display
  const getSectionVolunteers = (items: ContributionItem[]) => {
    const uniqueVolunteers = new Map<string, VolunteerData>();
    items.forEach(item => {
      item.volunteers.forEach(volunteer => {
        uniqueVolunteers.set(volunteer.userId, volunteer);
      });
    });
    return Array.from(uniqueVolunteers.values());
  };
  const sections = data?.data?.contributionDetails?.sections || [];
  return (
    <div className="bg-white mt-6 rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center pt-6 pb-6">
        <h1 className="font-inter text-[20px] text-[#475467]">
          In-kind contribution Summary
        </h1>
        <Button
          className="relative top-4 mb-4 flex hover:bg-[#F3BF93] text-black items-center gap-2 bg-[#F3BF93] rounded-full p-1 
    size-[22px]
    tablet-lg:rounded-md tablet-lg:size-auto tablet-lg:px-4 tablet-lg:py-2"
          size="icon"
        >
          <IoCloudUploadOutline className="size-[24px] tablet-lg:size-[40px] text-white tablet-lg:text-black" />
          <span className="max-tablet-lg:hidden ml-2">Export report</span>
        </Button>
      </div>

      {sections?.map((section, sectionIndex) => {
        const sectionVolunteers = getSectionVolunteers(section.items);
        
        return (
          <div 
            key={section.section} 
            className={`border border-gray-300 rounded-xl p-4 ${sectionIndex > 0 ? 'mt-5' : ''}`}
          >
            <div className="flex justify-between items-center">
              <h1 className="text-[16px] font-inter">{section.title}</h1>
              <p className="relative mr-8 text-[18px] font-inter text-[#595959] top-3">
                {section.totalVolunteers} members volunteered
              </p>
            </div>
            
            <div className="mt-6 flex justify-between items-center">
              <div>
                {section.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center mb-3 text-[13px] text-[#595959] relative bottom-4"
                  >
                    <span>{item.text}</span>
                    <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold ml-3">
                      {item.volunteerCount}
                    </span>
                  </div>
                ))}
              </div>

              <div className={`${section.items.length > 4 ? 'mb-28' : section.items.length > 2 ? 'mb-20' : 'mb-12'}`}>
                <p className="mb-2 text-sm text-gray-600 mr-6">
                  {getVolunteerText(sectionVolunteers, section.totalVolunteers)}
                </p>
                {sectionVolunteers.length > 0 && (
                  <div className="flex justify-end">
                    {renderVolunteerAvatars(sectionVolunteers)}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Show message if no data */}
      {(!sections || sections?.length === 0) && (
        <div className="text-center py-8">
          <p className="text-gray-500">No contribution data available</p>
        </div>
      )}
    </div>
  );
};

export default ContributionSummary;