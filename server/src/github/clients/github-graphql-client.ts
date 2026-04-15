import { ClientError, GraphQLClient, gql } from "graphql-request";
import { AppError, isRateLimitError } from "../../lib/errors";
import type { GithubRepositoryNode, TrendPeriod } from "../types/github";

const GITHUB_GRAPHQL_ENDPOINT = "https://api.github.com/graphql";

const TRENDING_REPOSITORIES_QUERY = gql`
  query TrendingRepositories($query: String!, $first: Int!) {
    search(query: $query, type: REPOSITORY, first: $first) {
      nodes {
        ... on Repository {
          name
          description
          url
          stargazerCount
          forkCount
          createdAt
          pushedAt
          owner {
            login
          }
          primaryLanguage {
            name
            color
          }
        }
      }
    }
  }
`;

type TrendingRepositoriesQueryResponse = {
  search: {
    nodes: Array<GithubRepositoryNode | null>;
  };
};

export class GithubGraphqlClient {
  private readonly client: GraphQLClient;

  constructor(token: string) {
    this.client = new GraphQLClient(GITHUB_GRAPHQL_ENDPOINT, {
      headers: {
        authorization: `Bearer ${token}`,
        "user-agent": "tech-trend-server",
      },
    });
  }

  async searchTrendingRepositories(params: {
    language?: string;
    period: TrendPeriod;
    limit: number;
  }): Promise<GithubRepositoryNode[]> {
    const query = buildRepositorySearchQuery(params.language, params.period);

    try {
      const response =
        await this.client.request<TrendingRepositoriesQueryResponse>(
          TRENDING_REPOSITORIES_QUERY,
          {
            first: params.limit,
            query,
          },
        );

      return response.search.nodes.filter(
        (node): node is GithubRepositoryNode => node !== null,
      );
    } catch (error) {
      console.error("[GithubGraphqlClient] request failed:", error);
      if (error instanceof ClientError && isRateLimitError(error)) {
        throw new AppError(
          "RATE_LIMIT_EXCEEDED",
          "GitHub API rate limit exceeded",
          429,
        );
      }

      if (error instanceof ClientError) {
        throw new AppError(
          "EXTERNAL_API_ERROR",
          `GitHub API request failed: ${error.message}`,
          502,
        );
      }

      if (isRateLimitError(error)) {
        throw new AppError(
          "RATE_LIMIT_EXCEEDED",
          "GitHub API rate limit exceeded",
          429,
        );
      }

      throw new AppError(
        "EXTERNAL_API_ERROR",
        `GitHub API request failed: ${error instanceof Error ? error.message : String(error)}`,
        502,
      );
    }
  }
}

const buildRepositorySearchQuery = (
  language: string | undefined,
  period: TrendPeriod,
) => {
  const days = period === "daily" ? 1 : 7;
  const createdSince = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const parts = [
    "is:public",
    "archived:false",
    "fork:false",
    `created:>=${createdSince}`,
    "sort:stars-desc",
  ];

  if (language) {
    parts.push(`language:${language}`);
  }

  return parts.join(" ");
};
