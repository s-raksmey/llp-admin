const GRAPHQL_API_URL =
  process.env.GRAPHQL_API_URL ?? "http://localhost:4000/api/graphql";

type GraphQLResponse<TData> = {
  data?: TData;
  errors?: Array<{ message: string }>;
};

export async function graphqlRequest<TData>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<TData> {
  const response = await fetch(GRAPHQL_API_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  const result = (await response.json()) as GraphQLResponse<TData>;

  if (!response.ok || result.errors?.length || !result.data) {
    throw new Error(result.errors?.[0]?.message ?? "GraphQL request failed");
  }

  return result.data;
}
