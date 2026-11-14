import type {Config} from '@docusaurus/types';
import type {Options, ThemeConfig} from '@docusaurus/preset-classic';

export default {
  title: 'jpbourgeon',
  url: 'https://jpbourgeon.github.io',
  baseUrl: '/blog/',
  trailingSlash: true,
  clientModules: ['./src/client/goatcounter.ts'],
  onBrokenLinks: 'throw',
  markdown: {hooks: {onBrokenMarkdownLinks: 'throw'}},
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
    localeConfigs: {fr: {label: 'Français'}, en: {label: 'English'}},
  },
  presets: [
    ['classic', {
      docs: false,
      blog: {
        routeBasePath: '/',
        blogTitle: 'Articles',
        blogDescription: 'Réflexions, pratiques et productions de jpbourgeon.',
        blogListComponent: '@site/src/components/BlogListPage',
        blogSidebarCount: 0,
        archiveBasePath: null,
        feedOptions: {type: ['rss', 'atom']},
      },
      sitemap: {},
    } satisfies Options],
  ],
  themeConfig: {
    navbar: {
      title: 'jpbourgeon',
      items: [
        {to: '/', label: 'Articles', exact: true, position: 'left'},
        {to: '/search/', label: 'Rechercher', position: 'left'},
        {type: 'localeDropdown', position: 'right'},
      ],
    },
  } satisfies ThemeConfig,
} satisfies Config;
