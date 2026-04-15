export type TrendPeriod = "daily" | "weekly";

export type TrendingRepository = {
  name: string;
  owner: string;
  description: string | null;
  language: string | null;
  languageColor: string | null;
  stars: number;
  forks: number;
  url: string;
  trendScore: number;
};

export type TrendingRepositoriesResponse = {
  repositories: TrendingRepository[];
  period: TrendPeriod;
  fetchedAt: string;
};

export type TrendingLanguage = {
  name: string;
  color: string | null;
};

export type TrendingLanguagesResponse = {
  languages: TrendingLanguage[];
};

export type GithubRepositoryNode = {
  name: string;
  description: string | null;
  url: string;
  stargazerCount: number;
  forkCount: number;
  owner: {
    login: string;
  };
  primaryLanguage: {
    name: string;
    color: string | null;
  } | null;
  createdAt: string;
  pushedAt: string;
};
