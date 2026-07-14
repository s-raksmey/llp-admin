import { graphqlRequest } from "@/lib/graphql-client";
import type { Category } from "./types";

type ApiCategory = {
  id: string | number;
  name: string;
  slug: string;
  description: string | null;
  scope: Category["scope"];
  status: Category["status"];
  updatedAt: string | null;
  lectureCount?: number | null;
};

type CategoriesQuery = {
  categories: ApiCategory[];
};

export type LectureCategoryOption = {
  id: string;
  name: string;
};

type ApiLectureCategoryOption = {
  id: string | number;
  name: string;
  scope: Category["scope"];
};

type LectureCategoryOptionsQuery = {
  categories: ApiLectureCategoryOption[];
};

type CreateCategoryMutation = {
  createCategory?: ApiCategory | null;
};

type UpdateCategoryMutation = {
  updateCategory?: ApiCategory | null;
};

type UpdateCategoryStatusMutation = {
  updateCategoryStatus?: ApiCategory | null;
};

export type CreateCategoryPayload = {
  name: string;
  slug: string;
  description: string;
  scope: Category["scope"];
};

export type UpdateCategoryPayload = CreateCategoryPayload & {
  id: string;
};

export type UpdateCategoryStatusPayload = {
  id: string;
  status: Category["status"];
};

type DeleteCategoryMutation = {
  deleteCategory: {
    id: string;
    success: boolean;
    message: string;
  };
};

const categoryRowFields = `
  id
  name
  slug
  description
  scope
  status
  updatedAt
  lectureCount
`;

export const adminCategories: Category[] = [];

export async function getLectureCategoryOptions(): Promise<LectureCategoryOption[]> {
  const data = await graphqlRequest<LectureCategoryOptionsQuery>(`
    query LectureCategoryOptions {
      categories(status: ACTIVE) {
        id
        name
        scope
      }
    }
  `);

  return data.categories
    .filter(
      (category) => category.scope === "LECTURE" || category.scope === "BOTH",
    )
    .map((category) => ({
      id: String(category.id),
      name: category.name,
    }));
}

export async function getAdminCategories(): Promise<Category[]> {
  const data = await graphqlRequest<CategoriesQuery>(`
    query AdminCategories {
      categories {
        ${categoryRowFields}
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
          ${categoryRowFields}
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

export async function updateAdminCategory(
  input: UpdateCategoryPayload,
): Promise<Category> {
  const data = await graphqlRequest<UpdateCategoryMutation>(
    `
      mutation UpdateCategory($input: UpdateCategoryInput!) {
        updateCategory(input: $input) {
          ${categoryRowFields}
        }
      }
    `,
    { input },
  );

  if (!isApiCategory(data.updateCategory)) {
    throw new Error("GraphQL did not return the updated category.");
  }

  return toAdminCategory(data.updateCategory);
}

export async function updateAdminCategoryStatus(
  input: UpdateCategoryStatusPayload,
): Promise<Category> {
  const data = await graphqlRequest<UpdateCategoryStatusMutation>(
    `
      mutation UpdateCategoryStatus($input: UpdateCategoryStatusInput!) {
        updateCategoryStatus(input: $input) {
          ${categoryRowFields}
        }
      }
    `,
    { input },
  );

  if (!isApiCategory(data.updateCategoryStatus)) {
    throw new Error("GraphQL did not return the updated category status.");
  }

  return toAdminCategory(data.updateCategoryStatus);
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
  return {
    id: String(category.id),
    name: category.name,
    slug: category.slug,
    description: category.description ?? "",
    scope: category.scope,
    status: category.status,
    itemCount: category.lectureCount ?? 0,
    updatedAt: formatDate(category.updatedAt),
    tableOfContents: [],
  };
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

