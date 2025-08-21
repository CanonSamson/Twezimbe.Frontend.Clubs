export type ContactInfoType = {
  nationality: string
  countryOfResidence: string
  stateProvinceRegion: string
  city?: string
  landmark?: string
  zipPostalCode?: string
  addressLine1: string
  addressLine2?: string
}

export type CreateContactInfoType = {
    nationality: string;
    countryOfResidence: string;
    stateProvinceRegion: string;
    city: string;
    landmark: string;
    zipPostalCode: string;
    addressLine1: string;
    addressLine2: string
  }

export type UpdateContactInfoType = {
  nationality?: string
  countryOfResidence?: string
  stateProvinceRegion?: string
  city?: string
  landmark?: string
  zipPostalCode?: string
  addressLine1?: string
  addressLine2?: string
}
