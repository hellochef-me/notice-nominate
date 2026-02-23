export const departments = [
  "Engineering",
  "Product",
  "Marketing",
  "Digital Product",
  "Customer Loyalty",
  "Operations",
  "Procurement",
  "Finance",
  "SMT",
  "Data",
  "People & Culture",
] as const;

export type Department = (typeof departments)[number];
