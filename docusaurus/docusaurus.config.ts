// docusaurus/docusaurus.config.ts
import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'AlignCV Docs',
  url: 'https://docs.aligncv.com',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  i18n: { defaultLocale: 'zh-CN', locales: ['zh-CN'] }, // 文档当前以中文为主
  presets: [
    [
      'classic',
      {
        docs: {
          path: '../docs',
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.ts'),
          editUrl: undefined,
          showLastUpdateAuthor: false,
          showLastUpdateTime: true
        },
        blog: false,
        theme: { customCss: require.resolve('./src/css/custom.css') },
        sitemap: { changefreq: 'weekly', priority: 0.5 }
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    image: 'img/social-card.jpg',
    navbar: {
      title: 'AlignCV Docs',
      items: [
        { to: '/00-TOC', label: 'TOC 目录', position: 'left' },
        { href: 'https://www.aligncv.com', label: 'App', position: 'right' }
      ],
    },
    footer: {
      style: 'dark',
      links: [
        { title: '产品', items: [{ label: 'AlignCV', href: 'https://www.aligncv.com' }] },
        { title: '文档', items: [{ label: '总览', to: '/00-TOC' }] },
        { title: '支持', items: [{ label: 'FAQ', to: '/ops/41-deploy-and-runtime' }] }
      ],
      copyright: `© ${new Date().getFullYear()} AlignCV.`,
    },
    prism: { theme: prismThemes.github, darkTheme: prismThemes.dracula },
    algolia: {
      // 👉 用你自己的 DocSearch 账号替换下列占位符
      appId: 'YOUR_APP_ID',
      apiKey: 'YOUR_SEARCH_API_KEY',
      indexName: 'aligncv_docs',
      contextualSearch: true
    }
  } satisfies Preset.ThemeConfig,
};
export default config;
