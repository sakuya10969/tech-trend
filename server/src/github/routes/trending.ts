import { OpenAPIHono } from "@hono/zod-openapi";
import {
  getTrendingLanguagesRoute,
  getTrendingRepositoriesRoute,
} from "../schemas/trending";
import { getTrendingLanguages } from "../usecases/get-trending-languages";
import { getTrendingRepositories } from "../usecases/get-trending-repositories";

export const githubTrendingRoutes = new OpenAPIHono<{
  Bindings: {
    GITHUB_TOKEN?: string;
  };
}>();

githubTrendingRoutes.openapi(getTrendingRepositoriesRoute, async (c) => {
  const query = c.req.valid("query");
  const data = await getTrendingRepositories(c.env, {
    language: query.language,
    period: query.period,
  });

  return c.json(data, 200);
});

githubTrendingRoutes.openapi(getTrendingLanguagesRoute, async (c) => {
  const query = c.req.valid("query");
  const data = await getTrendingLanguages(c.env, {
    period: query.period,
  });

  return c.json(data, 200);
});
