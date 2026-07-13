import type { OutlineItem } from "@/lib/outline";

export type CategoryScope = "COURSE" | "LECTURE" | "BOTH";

export type CategoryStatus = "ACTIVE" | "ARCHIVED";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  scope: CategoryScope;
  status: CategoryStatus;
  itemCount: number;
  updatedAt: string;
  tableOfContents: OutlineItem[];
};

export type CategoryFormInput = {
  name: string;
  slug: string;
  description: string;
  scope: CategoryScope;
  outline: string;
};
