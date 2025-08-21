export type BeneficiaryTypeTypes =
  | 'son'
  | 'daughter'
  | 'spouse'
  | 'father'
  | 'mother'
  | 'brother'
  | 'sister'
  | 'others'

export const BeneficiaryType: BeneficiaryTypeTypes[] = [
  'son',
  'daughter',
  'spouse',
  'father',
  'mother',
  'brother',
  'sister',
  'others'
]

export const beneficiaryMethodOptions = [
  { value: 'son', label: 'Son' },
  { value: 'daughter', label: 'Daughter' },
  { value: 'spouse', label: 'Spouse' },
  { value: 'father', label: 'Father' },
  { value: 'mother', label: 'Mother' },
  { value: 'brother', label: 'Brother' },
  { value: 'sister', label: 'Sister' },
  { value: 'others', label: 'Others' }
]
