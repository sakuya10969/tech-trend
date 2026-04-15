import { getGithubToken } from "../../lib/env";
import { GithubGraphqlClient } from "../clients/github-graphql-client";
import type {
  GithubRepositoryNode,
  TrendPeriod,
  TrendingRepositoriesResponse,
  TrendingRepository,
} from "../types/github";

const DEFAULT_RESULT_LIMIT = 12;
const MULTI_LANGUAGE_LIMIT = 6;

export const getTrendingRepositories = async (
  env: { GITHUB_TOKEN?: string },
  params: {
    language?: string;
    period: TrendPeriod;
  },
): Promise<TrendingRepositoriesResponse> => {
  const token = getGithubToken(env);
  const client = new GithubGraphqlClient(token);
  const languages = parseLanguages(params.language);

  const rawRepositories =
    languages.length > 1
      ? await Promise.all(
          languages.map((language) =>
            client.searchTrendingRepositories({
              language,
              period: params.period,
              limit: MULTI_LANGUAGE_LIMIT,
            }),
          ),
        ).then((results) => results.flat())
      : await client.searchTrendingRepositories({
          language: languages[0],
          period: params.period,
          limit: DEFAULT_RESULT_LIMIT,
        });

  const repositories = dedupeRepositories(rawRepositories)
    .map((repository) => toTrendingRepository(repository, params.period))
    .sort((left, right) => right.trendScore - left.trendScore)
    .slice(0, DEFAULT_RESULT_LIMIT);

  return {
    repositories,
    period: params.period,
    fetchedAt: new Date().toISOString(),
  };
};

const parseLanguages = (value?: string) =>
  value
    ?.split(",")
    .map((language) => language.trim())
    .filter(Boolean) ?? [];

const dedupeRepositories = (repositories: GithubRepositoryNode[]) => {
  const unique = new Map<string, GithubRepositoryNode>();

  for (const repository of repositories) {
    unique.set(repository.url, repository);
  }

  return Array.from(unique.values());
};

const toTrendingRepository = (
  repository: GithubRepositoryNode,
  period: TrendPeriod,
): TrendingRepository => {
  const recencyWindowHours = period === "daily" ? 24 : 24 * 7;
  const ageHours = Math.max(
    1,
    (Date.now() - new Date(repository.createdAt).getTime()) / (1000 * 60 * 60),
  );
  const freshness =
    Math.max(0, recencyWindowHours - ageHours) / recencyWindowHours;
  const trendScore = Number(
    (
      repository.stargazerCount * 0.7 +
      repository.forkCount * 0.2 +
      freshness * 100
    ).toFixed(1),
  );

  return {
    name: repository.name,
    owner: repository.owner.login,
    description: repository.description,
    language: repository.primaryLanguage?.name ?? null,
    languageColor: repository.primaryLanguage?.color ?? null,
    stars: repository.stargazerCount,
    forks: repository.forkCount,
    url: repository.url,
    trendScore,
  };
};
