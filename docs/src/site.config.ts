import type { SiteConfig } from "@mrmartineau/zui-theme/nav";

export const site: SiteConfig = {
  author: "Zander Martineau",
  authorHref: "https://zander.wtf",
  description:
    "A tiny dev tool for any framework. Hold Ctrl+Shift to see the data-debug value of any element.",
  social: [
    {
      ariaLabel: "View on GitHub",
      href: "https://github.com/mrmartineau/lil-debugger",
      icon: "github-logo",
      label: "Repo",
    },
    {
      ariaLabel: "View on npm",
      href: "https://www.npmjs.com/package/@mrmartineau/lil-debugger",
      icon: "package",
    },
  ],
  title: "Lil' Debugger",
  version: "0.0.0",
  versionHref: "/changelog",
};
