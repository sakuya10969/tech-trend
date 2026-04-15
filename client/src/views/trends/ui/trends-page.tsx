"use client";

import {
  Alert,
  Badge,
  Box,
  Container,
  Group,
  MultiSelect,
  Paper,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useState } from "react";
import { useTrendFilters } from "@/features/filter-trends/model/use-trend-filters";
import {
  useGetTrendingLanguages,
  useGetTrendingRepositories,
} from "@/shared/api/generated/github-trending/github-trending";
import { formatCompactNumber } from "@/shared/lib/format";
import type { TrendPeriod } from "@/shared/types/filter";
import { TrendList } from "@/widgets/trend-list/ui/trend-list";

export const TrendsPage = () => {
  const {
    languages,
    period,
    deferredLanguages,
    deferredPeriod,
    setLanguages,
    setPeriod,
  } = useTrendFilters();
  const [comparedRepositoryUrls, setComparedRepositoryUrls] = useState<
    string[]
  >([]);

  const repositoriesQuery = useGetTrendingRepositories({
    language: deferredLanguages.join(",") || undefined,
    period: deferredPeriod,
  });
  const languagesQuery = useGetTrendingLanguages({
    period: deferredPeriod,
  });

  const repositories = repositoriesQuery.data?.data.repositories ?? [];
  const fetchedAt = repositoriesQuery.data?.data.fetchedAt
    ? new Date(repositoriesQuery.data.data.fetchedAt).toLocaleString("ja-JP")
    : null;
  const comparisonItems = repositories.filter((repository) =>
    comparedRepositoryUrls.includes(repository.url),
  );
  const highestTrendScore = comparisonItems.length
    ? Math.max(...comparisonItems.map((repository) => repository.trendScore))
    : 0;

  const toggleCompare = (url: string) => {
    setComparedRepositoryUrls((current) =>
      current.includes(url)
        ? current.filter((currentUrl) => currentUrl !== url)
        : current.length >= 4
          ? [...current.slice(1), url]
          : [...current, url],
    );
  };

  return (
    <Box bg="white" mih="100vh">
      <Container size="xl" py="xl">
        <Stack gap="xl">

          {/* Hero Section */}
          <Paper
            p="xl"
            radius="sm"
            style={{
              border: "1px solid var(--mantine-color-gray-3)",
              background: "white",
            }}
          >
            <Stack gap="lg">
              <Group justify="space-between" align="flex-start">
                <div>
                  <Badge color="blue" radius="sm" size="lg" variant="light">
                    GitHub Trends
                  </Badge>
                  <Title mt="md" order={1} c="dark.9" fw={600}>
                    スター数だけじゃない、開発者の注目度を可視化する
                  </Title>
                  <Text c="dark.5" maw={720} mt="sm" size="md">
                    GitHub のトレンドリポジトリを期間・言語で絞り込み、注目度を比較できます。
                  </Text>
                </div>
                <Paper
                  p="md"
                  radius="sm"
                  style={{
                    border: "1px solid var(--mantine-color-gray-3)",
                    background: "var(--mantine-color-gray-0)",
                    minWidth: 120,
                  }}
                >
                  <Text c="dark.5" size="xs">
                    表示件数
                  </Text>
                  <Text c="blue.7" fw={700} size="xl">
                    {formatCompactNumber(repositories.length)}
                  </Text>
                </Paper>
              </Group>

              <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
                <MultiSelect
                  clearable
                  searchable
                  data={(languagesQuery.data?.data.languages ?? []).map(
                    (language) => ({
                      label: language.name,
                      value: language.name,
                    }),
                  )}
                  label="言語"
                  placeholder="言語を選択"
                  value={languages}
                  onChange={setLanguages}
                />
                <Stack gap={8}>
                  <Text fw={500} size="sm" c="dark.5">
                    期間
                  </Text>
                  <SegmentedControl
                    color="blue"
                    data={[
                      { label: "Daily", value: "daily" },
                      { label: "Weekly", value: "weekly" },
                    ]}
                    fullWidth
                    value={period}
                    onChange={(value) => setPeriod(value as TrendPeriod)}
                  />
                </Stack>
              </SimpleGrid>

              <Group gap="xl">
                <div>
                  <Text c="dark.5" size="xs">
                    取得状況
                  </Text>
                  <Text c="dark.9" fw={600} size="sm">
                    {repositoriesQuery.isFetching ? "更新中…" : "最新"}
                  </Text>
                </div>
                <div>
                  <Text c="dark.5" size="xs">
                    最終更新
                  </Text>
                  <Text c="dark.9" fw={600} size="sm">
                    {fetchedAt ?? "—"}
                  </Text>
                </div>
              </Group>
            </Stack>
          </Paper>

          {/* Comparison Rail */}
          <Paper
            p="xl"
            radius="sm"
            style={{
              border: "1px solid var(--mantine-color-gray-3)",
              background: "white",
            }}
          >
            <Stack gap="md">
              <Group justify="space-between" align="center">
                <div>
                  <Title order={2} c="dark.9" fw={600}>
                    比較
                  </Title>
                  <Text c="dark.5" size="sm">
                    最大4件まで選択して注目度を比較できます。
                  </Text>
                </div>
                <Badge color="blue" radius="sm" size="lg" variant="light">
                  {comparedRepositoryUrls.length}/4 件選択中
                </Badge>
              </Group>

              {comparisonItems.length === 0 ? (
                <Alert color="blue" radius="sm" title="未選択" variant="light">
                  リポジトリの「比較する」ボタンで対象を追加すると、注目度を並べて比較できます。
                </Alert>
              ) : (
                <SimpleGrid cols={{ base: 1, md: 2, xl: 4 }} spacing="md">
                  {comparisonItems.map((repository) => {
                    const relativeScore =
                      highestTrendScore > 0
                        ? (repository.trendScore / highestTrendScore) * 100
                        : 0;

                    return (
                      <Paper
                        key={repository.url}
                        p="md"
                        radius="sm"
                        style={{
                          border: "1px solid var(--mantine-color-gray-3)",
                          background: "var(--mantine-color-gray-0)",
                        }}
                      >
                        <Stack gap="sm">
                          <div>
                            <Text c="dark.9" fw={600} size="sm" lineClamp={1}>
                              {repository.owner}/{repository.name}
                            </Text>
                            <Text c="dark.5" size="xs">
                              {repository.language ?? "言語不明"}
                            </Text>
                          </div>
                          <Text c="blue.7" fw={700} size="xl">
                            {repository.trendScore.toFixed(1)}
                          </Text>
                          <Box
                            h={8}
                            w="100%"
                            bg="gray.2"
                            style={{ borderRadius: 4, overflow: "hidden" }}
                          >
                            <Box
                              h="100%"
                              bg="blue.7"
                              style={{
                                width: `${relativeScore}%`,
                                borderRadius: 4,
                                transition: "width 0.3s ease",
                              }}
                            />
                          </Box>
                        </Stack>
                      </Paper>
                    );
                  })}
                </SimpleGrid>
              )}
            </Stack>
          </Paper>

          {/* Repository List */}
          <TrendList
            repositories={repositories}
            isLoading={repositoriesQuery.isLoading || languagesQuery.isLoading}
            isError={repositoriesQuery.isError || languagesQuery.isError}
            comparedRepositoryUrls={comparedRepositoryUrls}
            onToggleCompare={toggleCompare}
          />
        </Stack>
      </Container>
    </Box>
  );
};
