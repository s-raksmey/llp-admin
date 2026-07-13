import { graphqlRequest } from "@/lib/graphql-client";
import type { OutlineItem } from "@/lib/outline";
import type { Category } from "./types";

type ApiCategory = {
  id: string | number;
  name: string;
  slug: string;
  description: string | null;
  scope: Category["scope"];
  status: Category["status"];
  updatedAt: string | null;
  outlineItems?: Array<{
    id: string | number;
    parentId: string | number | null;
    title: string;
    sortOrder: number;
  }>;
  lectures?: Array<{ id: string | number }>;
};

type CategoriesQuery = {
  categories: ApiCategory[];
};

type CreateCategoryMutation = {
  createCategory?: ApiCategory | null;
};

export type CreateCategoryPayload = {
  name: string;
  slug: string;
  description: string;
  scope: Category["scope"];
};

type DeleteCategoryMutation = {
  deleteCategory: {
    id: string;
    success: boolean;
    message: string;
  };
};

const categoryFields = `
  id
  name
  slug
  description
  scope
  status
  updatedAt
  outlineItems {
    id
    parentId
    title
    sortOrder
  }
  lectures {
    id
  }
`;

export const adminCategories: Category[] = [];

export async function getAdminCategories(): Promise<Category[]> {
  const data = await graphqlRequest<CategoriesQuery>(`
    query AdminCategories {
      categories {
        ${categoryFields}
      }
    }
  `);

  return data.categories.filter(isApiCategory).map(toAdminCategory);
}

export async function createAdminCategory(
  input: CreateCategoryPayload,
): Promise<Category> {
  const data = await graphqlRequest<CreateCategoryMutation>(
    `
      mutation CreateCategory($input: CreateCategoryInput!) {
        createCategory(input: $input) {
          ${categoryFields}
        }
      }
    `,
    { input },
  );

  if (!isApiCategory(data.createCategory)) {
    throw new Error("GraphQL did not return the created category.");
  }

  return toAdminCategory(data.createCategory);
}

function isApiCategory(category: ApiCategory | null | undefined): category is ApiCategory {
  return Boolean(
    category &&
      category.id !== undefined &&
      typeof category.name === "string" &&
      typeof category.slug === "string" &&
      typeof category.scope === "string" &&
      typeof category.status === "string",
  );
}

function toAdminCategory(category: ApiCategory): Category {
  const outlineItems = category.outlineItems ?? [];
  const lectures = category.lectures ?? [];

  return {
    id: String(category.id),
    name: category.name,
    slug: category.slug,
    description: category.description ?? "",
    scope: category.scope,
    status: category.status,
    itemCount: outlineItems.length + lectures.length,
    updatedAt: formatDate(category.updatedAt),
    tableOfContents: toOutline(outlineItems),
  };
}

function toOutline(
  items: NonNullable<ApiCategory["outlineItems"]>,
): OutlineItem[] {
  const sortedItems = [...items].sort((first, second) => first.sortOrder - second.sortOrder);

  return sortedItems
    .filter((item) => !item.parentId)
    .map((item) => ({
      title: item.title,
      children: sortedItems
        .filter((child) => String(child.parentId) === String(item.id))
        .map((child) => child.title),
    }));
}

function formatDate(value: string | null) {
  if (!value) {
    return "Unknown";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export async function deleteAdminCategory(id: string) {
  const data = await graphqlRequest<DeleteCategoryMutation>(
    `
      mutation DeleteCategory($id: ID!) {
        deleteCategory(id: $id) {
          id
          success
          message
        }
      }
    `,
    { id },
  );

  return data.deleteCategory;
}