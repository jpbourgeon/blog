import type {Config} from '@docusaurus/types';
import type * as Classic from '@docusaurus/preset-classic';

const config: Config = {
  title: 'jpbourgeon',
  url: 'https://jpbourgeon.github.io',
  baseUrl: '/blog/',
  trailingSlash: true,
  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
  },
  presets: [
    [
      'classic',
      {
        docs: false,
        blog: {
          routeBasePath: '/',
          blogTitle: 'Articles',
          blogDescription: 'Articles du blog personnel et technique de jpbourgeon.',
          blogListComponent: '@site/src/components/BlogListPage',
          feedOptions: {type: ['rss', 'atom'], title: 'jpbourgeon'},
        },
        sitemap: {},
      } satisfies Classic.Options,
    ],
  ],
  themeConfig: {
    navbar: {
      title: 'jpbourgeon',
      items: [
        {to: '/', label: 'Articles', position: 'left', exact: true},
        {to: '/projects', label: 'Projets', position: 'left'},
        {to: '/about', label: 'À propos / Contact', position: 'left'},
        {type: 'localeDropdown', position: 'right'},
      ],
    },
  } satisfies Classic.ThemeConfig,
};

export default config;
