const path = require("path");
const { projects } = require("./fixtures/projects");
const { env } = require("./src/env");

const rootDir = path.resolve(__dirname, "..", "..");
const pathToAppRelativeToRoot = __dirname
  .replace(rootDir, "")
  .replaceAll("\\", "/");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Yet Another Stack",
  tagline: "A collection of React and Typescript libraries",
  favicon: "img/favicon.ico",
  url: env.docsUrl,
  baseUrl: "/",
  organizationName: env.git.owner,
  projectName: env.git.project,
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "throw",
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  plugins: [
    "docusaurus-plugin-sass",
    env.analytics ? "@gracefullight/docusaurus-plugin-vercel-analytics" : false,
  ],

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./fixtures/sidebars.js"),
          editUrl: env.git.sourceUrl(pathToAppRelativeToRoot),
          remarkPlugins: [
            [
              require("shiki-twoslash-remark"),
              require("./shiki-twoslash.config"),
            ],
          ],
        },
        theme: {
          customCss: require.resolve("./src/styles/global.scss"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: "img/card.png",
      navbar: {
        title: "YAS",
        logo: {
          alt: "YAS Logo",
          src: "img/logo.webp",
          width: 32,
          height: 32,
        },
        items: [
          ...projects
            .filter((p) => p.sidebar)
            .map(({ sidebar: [sidebarId], title }) => ({
              type: "docSidebar",
              sidebarId,
              position: "left",
              label: title,
            })),
          {
            href: env.git.projectUrl,
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        copyright:
          `Made by <a href="${env.git.ownerUrl}">@${env.git.owner}</a> ` +
          `using <a href="https://docusaurus.io/">Docusaurus</a>.`,
      },
    }),
};

module.exports = config;
