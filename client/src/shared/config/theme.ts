import { createTheme } from "@mantine/core";

export const theme = createTheme({
  primaryColor: "blue",
  primaryShade: 7,
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  fontFamilyMonospace:
    '"SFMono-Regular", "Consolas", "Liberation Mono", "Menlo", monospace',
  headings: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeight: "600",
  },
  defaultRadius: "sm",
  white: "#ffffff",
  black: "#000000",
});
