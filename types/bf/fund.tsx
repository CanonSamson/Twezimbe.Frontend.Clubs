type SubscriptionCategory =
  | "youngChildren"
  | "youth"
  | "adult"
  | "preSeniors"
  | "seniors";

export type SubscriptionType = {
  [key in SubscriptionCategory]: string;
};

export type BenefitType = {
  reserveRatio: number;
  adminCostCap: number;
  payoutPool: number;
  mortalityRate: number;
};

export type FundRulesType = {
  name: string;
  fundDetails: string;
  baseCurrency: string;
  updated: boolean
  id: string;
  fundId: string;
  maxBeneficiariesPerPrincipal: number;
  membershipFee: number;
  caseActions: number;
  principalBenefit: number;
  spouseBenefit: number;
  childBenefit: number;
  parentsBenefit: number;
  othersBenefit: number;
  cashContribution: number;
  inKindContribution: string;
  paymentInLieuOfFailure: number;
  waitingPeriod: string;
  annualSubscription: number;
  subscription: SubscriptionType;
  benefits: BenefitType;
  inKindContributions?: {
    attendanceVigil: boolean;
    attendanceRequiemMass: boolean;
    attendanceBurial: boolean;
    attendancePostDeathVisit: boolean;
    offerMusic: boolean;
    escortBody: boolean;
    volunteerCook: boolean;
    coordinateTransport: boolean;
    helpVenueSetup: boolean;
    createTribute: boolean;
    helpCleanup: boolean;
    joinPrayerGroup: boolean;
    writeTribute: boolean;
    checkInBereaved: boolean;
  };
};

export type FundRuleResponseType = {
  name: string;
  fundDetails: string;
  baseCurrency: string;
  fundRule: FundRulesType;
};
