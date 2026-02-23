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
] as const;

export type Department = (typeof departments)[number];
