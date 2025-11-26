// docusaurus/src/pages/index.tsx
import React from 'react';
import Layout from '@theme/Layout';

export default function Home(): JSX.Element {
  return (
    <Layout title="AlignCV Docs" description="Architecture, runbooks, prompts">
      <main style={{padding: '3rem 1rem', maxWidth: 880, margin: '0 auto'}}>
        <h1>AlignCV Documentation</h1>
        <p>使用左侧侧边栏浏览各模块。所有文档来自仓库根目录的 <code>/docs</code>。</p>
        <p><a href="/00-TOC">→ 直接进入目录（TOC）</a></p>
      </main>
    </Layout>
  );
}
