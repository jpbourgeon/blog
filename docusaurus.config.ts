import type {Config} from '@docusaurus/types';
import type {Options, ThemeConfig} from '@docusaurus/preset-classic';

const title = 'jpbourgeon';

export default {
  title,
  url: 'https://jpbourgeon.github.io',
  baseUrl: '/blog/',
  trailingSlash: true,
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
