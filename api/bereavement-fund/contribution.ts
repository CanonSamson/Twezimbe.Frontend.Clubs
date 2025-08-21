import axiosServices from '@/utils/axios'

export interface Beneficiary {
  id: string
  fundId: string
  userId: string
  updatedAt: string
  createdAt: string
  beneficiaryId: string | null
  relationship: string
  lastName: string
  firstName: string
  email: string
  phoneNumber: string
  dateOfBirth: string
  image?: string
  beneficiary: {
    profile: {
      firstName: string
      lastName: string
      userName?: string
      profileImage?: string
    }
  } | null
}

export interface FiledByUser {
  id: string
  profile: {
    firstName: string
    lastName: string
    userName?: string
    profileImage?: string
  }
}

export interface ContributionDetails {
  id: string
  fundId: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | "OPEN"
  caseName: string
  reason: string
  coverImage: string | null
  targetAmount: number
  timeLine: string
  description: string
  bereavementFund: {
    cashContribution: number
    selectedInKindContribution: {
      fundRuleId: string
      attendanceVigil: boolean
      attendanceRequiemMass: boolean
      attendanceBurial: boolean
      attendancePostDeathVisit: boolean
      escortBody: boolean
      volunteerCook: boolean
      coordinateTransport: boolean
      helpVenueSetup: boolean
      offerMusic: boolean
      createTribute: boolean
      helpCleanup: boolean
      joinPrayerGroup: boolean
      writeTribute: boolean
      checkInBereaved: boolean
    }
  }
  createdAt: string
  filedById: string
  reference: string
  beneficiaryId: string
  updatedAt: string
  totalcontributions: number
  aprovedBy: string | null
  beneficiary: {
    userId: string
    id: string
    firstName: string
    lastName: string
    profileImage: string | null
    userName: string | null
  }
  filedByUser: {
    id: string
    firstName: string
    lastName: string
    profileImage: string | null
    userName: string | null
  }
  contributions: any[]


  shareUpdate: {
    message: string
    createdAt: string
    updatedBy: {
      id: string;
      profileImage: string | null | undefined;
      firstName: string | undefined;
      lastName: string | undefined;
      userName: string | null | undefined;
    }
  }[]
}

export type ContributionDetailsResponse = {
  data: {
    success: boolean
    message: string
    case: ContributionDetails

  }
}

export const getCaseContributionDetails = async (
  caseId: string
): Promise<ContributionDetailsResponse> => {
  return await axiosServices.get(
    `/v1/tenancy/bf-contribution/${caseId}/details`
  )
}

export const getCaseDonationContribution = async (
  caseId: string
): Promise<{
  success: boolean
  message: string
  data: {
    data: {
      id: string
      fundId: string
      amount: number
      type: string
      contributorId: string
      createdAt: string
      caseId: string
      updatedAt: string
      contributor: {
        id: string
        profile: {
          firstName: string
          lastName: string
          profileImage: string | null
          userName: string
          bio: string
        }
      }
    }[]
  }
}> => {
  return await axiosServices.get(
    `/v1/tenancy/bf-contribution/${caseId}/donation-contributions`
  )
}



export const inKindContribution = async (
  caseId: string,
  data: {
    inKind: { inKindTextId: string; inKindText: string }[]
  }
): Promise<{
  data: {
    success: boolean
    message: string
    data: {
      id: string;
      fundId: string;
      amount: number;
      type: string;
      contributorId: string;
      createdAt: Date;
      isInKind: boolean;
      inKindContribution: string[];
      caseId: string | null;
      updatedAt: Date;
    }
  }
}> => {
  return await axiosServices.post(
    `/v1/tenancy/bf-contribution/${caseId}/in-kind-contribution`, data
  )
}



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

type ApiResponse = {
  data: {
    success: boolean;
    contributionDetails: {
      sections: ContributionSection[];
      raw: any[];
    };
  }
};



export const getCaseInKindContributionSummary = async (
  caseId: string,

): Promise<ApiResponse> => {
  return await axiosServices.get(
    `/v1/tenancy/bf-contribution/${caseId}/contribution/case-in-kind`
  )
}
