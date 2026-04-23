import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const DOCUSAURUS_VERSION = '3.10.0';

const config: Config = {
  title: 'Hunter · Documentação',
  tagline: 'Módulo de Carreira',
  favicon: 'img/favicon.ico',

  /** Versão do gerador (alinhar com `package.json` → `@docusaurus/core`). */
  customFields: {
    docusaurusVersion: DOCUSAURUS_VERSION,
  },

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  // O atalho `v4: true` define `fasterByDefault: true` e ativa Rspack; no Windows
  // isso pode causar panic (ex.: cssExtractHmr). Expandimos v4 e mantemos
  // fasterByDefault: false para usar Webpack de forma estável.
  future: {
    v4: {
      removeLegacyPostBuildHeadAttribute: true,
      useCssCascadeLayers: true,
      siteStorageNamespacing: true,
      fasterByDefault: false,
      mdx1CompatDisabledByDefault: true,
    },
  },

  // Produção: alinhar `url` e `baseUrl` ao hosting real (ex.: domínio próprio com baseUrl `/`).
  // GitHub Pages (projeto): https://equipe3pontos.github.io + baseUrl `/Central_carreira/`.
  url: 'https://equipe3pontos.github.io',
  baseUrl: '/Central_carreira/',

  organizationName: 'equipe3pontos',
  projectName: 'Central_carreira',

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  /**
   * Com `future.v4.mdx1CompatDisabledByDefault: true`, várias compatibilidades MDX1 ficam off.
   * Reativamos o que afeta índice e sintaxe típica de docs:
   * - `admonitions`: `:::note`, `:::tip`, etc. → componente Infima `.alert` (cores em `custom.css`).
   * - `comments`: compatibilidade com comentários HTML em Markdown legado (`<!-- ... -->`).
   * `remark-gfm` já vem no `@docusaurus/mdx-loader` (tabelas GFM, listas de tarefas, ~~riscado~~).
   * Blocos ` ```mermaid ` em `.mdx`: tema `@docusaurus/theme-mermaid` (ver `themeConfig.mermaid`).
   */
  markdown: {
    mermaid: true,
    mdx1Compat: {
      admonitions: true,
      comments: true,
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/equipe3pontos/Central_carreira/edit/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themes: ['@docusaurus/theme-mermaid'],

  themeConfig: {
    image: 'img/brand-3pts.png',
    colorMode: {
      defaultMode: 'dark',
      /** Evita modo claro só pelo SO sem paleta consistente até o utilizador mudar explicitamente. */
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: '',
      logo: {
        alt: '3pts',
        src: 'img/brand-3pts.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentação',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Módulo de Carreira',
          items: [
            {
              label: 'Centro da documentação',
              to: '/docs/modulo-carreira/home',
            },
            {
              label: 'Visão geral',
              to: '/docs/modulo-carreira/overview',
            },
            {
              label: 'Colaborador',
              to: '/docs/modulo-carreira/colaborador',
            },
            {
              label: 'RH Tech People',
              to: '/docs/modulo-carreira/rh-tech-people',
            },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Hunter · Documentação do produto · Docusaurus ${DOCUSAURUS_VERSION}`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    /** Índice à direita (âncoras H2–H4), no espírito de docs tipo StackSpot */
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 4,
    },
    /** Diagramas Mermaid (` ```mermaid ` em `.mdx`): fluxogramas, jornadas, sequências, blueprints */
    mermaid: {
      theme: {light: 'neutral', dark: 'dark'},
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
