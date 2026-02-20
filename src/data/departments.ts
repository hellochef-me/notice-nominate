export const departments = [
  'Engineering',
  'Marketing',
  'Digital Product',
  'Operations',
  'Procurement',
  'Customer Loyalty',
  'Finance',
  'Data',
] as const

export type Department = (typeof departments)[number]
