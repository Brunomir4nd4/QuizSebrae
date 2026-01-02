import type { StorybookConfig } from '@storybook/nextjs-vite';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-onboarding",
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-vitest",
  ],
  "framework": {
    "name": "@storybook/nextjs-vite",
    "options": {
      builder: {
        viteConfigPath: undefined,
      },
    }
  },
  typescript: {
    reactDocgen: "react-docgen",
    check: false,
  },
  staticDirs: ["../public", { from: "../public/fonts", to: "/fonts" }],
};
export default config;