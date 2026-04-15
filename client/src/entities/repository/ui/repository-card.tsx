"use client";

import {
  Badge,
  Box,
  Button,
  Group,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import { formatCompactNumber } from "@/shared/lib/format";
import type { Repository } from "../model/repository";

type RepositoryCardProps = {
  repository: Repository;
  isCompared: boolean;
  maxTrendScore: number;
  onToggleCompare: (url: string) => void;
};

export const RepositoryCard = ({
  repository,
  isCompared,
  maxTrendScore,
  onToggleCompare,
}: RepositoryCardProps) => {
  const progressValue =
    maxTrendScore > 0 ? (repository.trendScore / maxTrendScore) * 100 : 0;

  return (
    <Paper
      p="md"
      radius="sm"
      style={{
        border: "1px solid var(--mantine-color-gray-3)",
        background: "white",
        transition: "background 0.15s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--mantine-color-blue-0)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "white";
      }}
    >
      <Stack gap="md">
        <Group justify="space-between" align="flex-start">
          <div style={{ minWidth: 0, flex: 1 }}>
            <Text
              component="a"
              href={repository.url}
              target="_blank"
              rel="noopener noreferrer"
              c="blue.7"
              fw={600}
              size="md"
              style={{ display: "inline-block" }}
              onClick={(e) => e.stopPropagation()}
            >
              {repository.owner}/{repository.name}
            </Text>
            <Text c="dark.5" mt={4} size="sm" lineClamp={2}>
              {repository.description ?? "説明なし"}
            </Text>
          </div>
          <Button
            color="blue"
            variant={isCompared ? "filled" : "outline"}
            size="xs"
            radius="sm"
            onClick={() => onToggleCompare(repository.url)}
          >
            {isCompared ? "比較中" : "比較する"}
          </Button>
        </Group>

        <Group gap="sm">
          {repository.language ? (
            <Badge
              variant="light"
              color="blue"
              size="sm"
              radius="sm"
              leftSection={
                repository.languageColor ? (
                  <span
                    aria-hidden
                    style={{
                      backgroundColor: repository.languageColor,
                      borderRadius: "999px",
                      display: "inline-block",
                      height: 8,
                      width: 8,
                    }}
                  />
                ) : undefined
              }
            >
              {repository.language}
            </Badge>
          ) : null}
          <Badge variant="light" color="blue" size="sm" radius="sm">
            Stars {formatCompactNumber(repository.stars)}
          </Badge>
          <Badge variant="light" color="blue" size="sm" radius="sm">
            Forks {formatCompactNumber(repository.forks)}
          </Badge>
        </Group>

        <Stack gap={4}>
          <Group justify="space-between">
            <Text c="dark.5" fw={500} size="xs">
              Trend score
            </Text>
            <Text c="blue.7" fw={700} size="sm">
              {repository.trendScore.toFixed(1)}
            </Text>
          </Group>
          <Box
            h={6}
            w="100%"
            bg="gray.2"
            style={{ borderRadius: 3, overflow: "hidden" }}
          >
            <Box
              h="100%"
              bg="blue.7"
              style={{
                width: `${progressValue}%`,
                borderRadius: 3,
                transition: "width 0.3s ease",
              }}
            />
          </Box>
        </Stack>
      </Stack>
    </Paper>
  );
};
