// docusaurus/sidebars.ts
import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    { type: 'doc', id: 'README' },
    { type: 'doc', id: '00-TOC' },
    {
      type: 'category', label: '👩‍💻 Frontend（前端）', collapsed: false, items: [
        'frontend/01-frontend-architecture',
        'frontend/02-frontend-components',
        'frontend/03-frontend-ngxs-state',
        'frontend/04-frontend-editor-wireframe',
        'frontend/05-frontend-routing-navigation',
        'frontend/06-i18n-seo',
      ]
    },
    {
      type: 'category', label: '🧩 Backend（后端）', collapsed: false, items: [
        'backend/10-backend-architecture',
        'backend/11-backend-apis',
        'backend/12-backend-stripe-payments',
        'backend/13-backend-ai-suggestions-jd',
        'backend/14-backend-importers',
        'backend/15-backend-security-privacy',
      ]
    },
    {
      type: 'category', label: '📈 Content & SEO（内容/SEO）', collapsed: false, items: [
        'content-seo/20-content-mdx-and-prerender',
        'content-seo/21-templates-tokens-thumbnails',
        'content-seo/22-figma-wireframes',
      ]
    },
    {
      type: 'category', label: '🧪 Quality（测试/质量）', collapsed: false, items: [
        'quality/30-testing-unit-e2e',
        'quality/31-analytics-events-abtesting',
      ]
    },
    {
      type: 'category', label: '🚀 Ops（运维/上线）', collapsed: false, items: [
        'ops/40-ci-cd-workflows',
        'ops/41-deploy-and-runtime',
        'ops/42-observability-and-alerts',
      ]
    },
    {
      type: 'category', label: '📝 Claude Prompts（提示词）', collapsed: false, items: [
        'prompts/50-prompts-frontend',
        'prompts/51-prompts-backend',
        'prompts/52-prompts-content-seo',
        'prompts/53-prompts-ops-and-checks',
      ]
    },
    {
      type: 'category', label: '🗺 Roadmap（路线图）', collapsed: false, items: [
        'roadmap/60-roadmap-and-risks',
      ]
    }
  ],
};

export default sidebars;
