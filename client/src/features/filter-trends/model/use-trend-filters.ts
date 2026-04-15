"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDeferredValue, useMemo } from "react";
import type { TrendPeriod } from "@/shared/types/filter";

const normalizeLanguages = (value: string | null) =>
  value
    ? value
        .split(",")
        .map((language) => language.trim())
        .filter(Boolean)
    : [];

export const useTrendFilters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const languages = useMemo(
    () => normalizeLanguages(searchParams.get("language")),
    [searchParams],
  );
  const period = (searchParams.get("period") as TrendPeriod | null) ?? "daily";

  const deferredLanguages = useDeferredValue(languages);
  const deferredPeriod = useDeferredValue(period);

  const update = (next: { languages?: string[]; period?: TrendPeriod }) => {
    const params = new URLSearchParams(searchParams.toString());
    const nextLanguages = next.languages ?? languages;
    const nextPeriod = next.period ?? period;

    if (nextLanguages.length > 0) {
      params.set("language", nextLanguages.join(","));
    } else {
      params.delete("language");
    }

    params.set("period", nextPeriod);

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return {
    languages,
    period,
    deferredLanguages,
    deferredPeriod,
    setLanguages: (nextLanguages: string[]) =>
      update({ languages: nextLanguages }),
    setPeriod: (nextPeriod: TrendPeriod) => update({ period: nextPeriod }),
  };
};
