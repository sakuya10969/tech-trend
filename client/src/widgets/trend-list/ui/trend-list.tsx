"use client";

import {
  Alert,
  Box,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import type { Repository } from "@/entities/repository/model/repository";
import { RepositoryCard } from "@/entities/repository/ui/repository-card";

type TrendListProps = {
  repositories: Repository[];
  isLoading: boolean;
  isError: boolean;
  comparedRepositoryUrls: string[];
  onToggleCompare: (url: string) => void;
};

export const TrendList = ({
  repositories,
  isLoading,
  isError,
  comparedRepositoryUrls,
  onToggleCompare,
}: TrendListProps) => {
  if (isLoading) {
    const skeletonKeys = [
      "skeleton-1",
      "skeleton-2",
      "skeleton-3",
      "skeleton-4",
      "skeleton-5",
      "skeleton-6",
    ];

    return (
      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
        {skeletonKeys.map((key) => (
          <Skeleton key={key} height={200} radius="sm" />
        ))}
      </SimpleGrid>
    );
  }

  if (isError) {
    return (
      <Alert
        color="red"
        icon={<IconAlertCircle size={16} />}
        radius="sm"
        title="トレンドの取得に失敗しました"
      >
        API トークンとバックエンドの起動状態を確認してください。
      </Alert>
    );
  }

  if (repositories.length === 0) {
    return (
      <Box
        p="xl"
        ta="center"
        bg="gray.0"
        style={{ borderRadius: "var(--mantine-radius-sm)" }}
      >
        <Stack align="center" gap="sm">
          <Text c="dark.4" fw={600}>
            該当するリポジトリが見つかりませんでした
          </Text>
          <Text c="dark.5" size="sm">
            言語や期間を変更して再度お試しください。
          </Text>
        </Stack>
      </Box>
    );
  }

  const maxTrendScore = Math.max(
    ...repositories.map((repository) => repository.trendScore),
  );

  return (
    <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
      {repositories.map((repository) => (
        <RepositoryCard
          key={repository.url}
          repository={repository}
          isCompared={comparedRepositoryUrls.includes(repository.url)}
          maxTrendScore={maxTrendScore}
          onToggleCompare={onToggleCompare}
        />
      ))}
    </SimpleGrid>
  );
};
