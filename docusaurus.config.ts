import {writeFileSync} from 'node:fs';
import {join} from 'node:path';
import type {BlogContent} from '@docusaurus/plugin-content-blog';
import type {LoadedContent as PagesContent} from '@docusaurus/plugin-content-pages';
import type {Config, PluginModule} from '@docusaurus/types';
import type {Options, ThemeConfig} from '@docusaurus/preset-classic';

const title = 'jpbourgeon';

// Keep deployment evidence outside the public build.
const publicationInventory: PluginModule = () => ({
  name: 'publication-inventory',
  postBuild({i18n, plugins, routesBuildMetadata}) {
    const directory = process.env.PUBLICATION_MANIFEST_DIR;
    if (!directory) return;
    const content = (name: string) => plugins.find(plugin => plugin.name === name && plugin.options.id === 'default')?.content;
    const blog = content('docusaurus-plugin-content-blog') as BlogContent;
    const pages = content('docusaurus-plugin-content-pages') as PagesContent;
    const routeSource = ({source, permalink}: {source: string; permalink: string}) =>
      ({path: source.replace(/^@site\//, ''), route: permalink});
    writeFileSync(join(directory, `${i18n.currentLocale}.json`), JSON.stringify({
      routes: routesBuildMetadata,
      pages: pages.map(routeSource),
      articles: blog.blogPosts.map(({metadata}) => ({...routeSource(metadata), unlisted: metadata.unlisted})),
    }));
  },
});

export default {
  title,
  url: 'https://jpbourgeon.github.io',
  baseUrl: '/blog/',
  trailingSlash: true,
  clientModules: ['./src/client/goatcounter.ts'],
  onBrokenLinks: 'throw',
  markdown: {hooks: {onBrokenMarkdownLinks: 'throw'}},
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
    localeConfigs: {
      fr: {label: 'Français'},
      en: {label: 'English'},
    },
  },
  plugins: [publicationInventory],
  presets: [
    [
      'classic',
      {
        docs: false,
        blog: {
          routeBasePath: '/',
          blogTitle: 'Articles',
          blogDescription: 'Le blog personnel et technique de jpbourgeon.',
          blogListComponent: '@site/src/components/BlogListPage',
          blogSidebarCount: 0,
          archiveBasePath: null,
          feedOptions: {type: ['rss', 'atom']},
        },
        sitemap: {},
      } satisfies Options,
    ],
  ],
  themeConfig: {
    navbar: {
      title,
      items: [
        {to: '/', label: 'Articles', exact: true, position: 'left'},
        {to: '/projects/', label: 'Projets', position: 'left'},
        {to: '/about/', label: 'À propos / Contact', position: 'left'},
        {type: 'localeDropdown', position: 'right'},
      ],
    },
  } satisfies ThemeConfig,
} satisfies Config;
