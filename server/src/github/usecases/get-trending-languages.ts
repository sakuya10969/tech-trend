import type { TrendPeriod, TrendingLanguagesResponse } from "../types/github";
import { getTrendingRepositories } from "./get-trending-repositories";

export const getTrendingLanguages = async (
  env: { GITHUB_TOKEN?: string },
  params: { period: TrendPeriod },
): Promise<TrendingLanguagesResponse> => {
  const response = await getTrendingRepositories(env, {
    period: params.period,
  });

  const languages = Array.from(
    response.repositories.reduce((map, repository) => {
      if (repository.language) {
        map.set(repository.language, {
          name: repository.language,
          color: repository.languageColor,
        });
      }

      return map;
    }, new Map<string, { name: string; color: string | null }>()),
  )
    .map(([, language]) => language)
    .sort((left, right) => left.name.localeCompare(right.name));

  return {
    languages,
  };
};
