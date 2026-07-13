import type { Category } from "./types";

export const adminCategories: Category[] = [
  {
    id: "cat-core-ui",
    name: "Core UI",
    slug: "core-ui",
    description: "Foundational interface design and layout lessons.",
    scope: "BOTH",
    status: "ACTIVE",
    itemCount: 8,
    updatedAt: "Today",
    tableOfContents: [
      {
        title: "Interface Foundations",
        children: ["Layout systems", "Visual hierarchy"],
      },
      { title: "Reusable Component Patterns" },
      { title: "Responsive Admin Screens" },
    ],
  },
  {
    id: "cat-data-engineering",
    name: "Data Engineering",
    slug: "data-engineering",
    description: "GraphQL, caching, API, and database-focused content.",
    scope: "LECTURE",
    status: "ACTIVE",
    itemCount: 5,
    updatedAt: "Yesterday",
    tableOfContents: [
      { title: "GraphQL Operations" },
      { title: "Cache Strategy", children: ["Apollo cache", "Local drafts"] },
      { title: "Publishing Workflow" },
    ],
  },
  {
    id: "cat-media-library",
    name: "Media Library",
    slug: "media-library",
    description: "Images, PDFs, video embeds, and downloadable materials.",
    scope: "COURSE",
    status: "ARCHIVED",
    itemCount: 3,
    updatedAt: "2 days ago",
    tableOfContents: [
      { title: "Image Uploads" },
      { title: "PDF Attachments" },
      { title: "Video Embeds", children: ["YouTube", "Direct video"] },
    ],
  },
];
