import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { themes as prismThemes } from 'prism-react-renderer';

const tailwindConfig = require('./src/plugins/tailwind-config');

const config: Config = {
  title: 'LLM Inference Handbook',
  tagline:
    'A practical handbook for engineers building, optimizing, scaling, and operating LLM inference systems in production.',
  favicon: 'images/modular-logo-docs.svg',

  url: 'https://handbook.modular.com',
  baseUrl: '/',
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    format: 'mdx',
  },

  // Pre-paint script that forces the Handbook to light mode before hydration.
  // Theme plumbing remains in the codebase so dark mode can be restored later,
  // but the shipped site should not expose or honor user/system theme toggles.
  headTags: [
    {
      tagName: 'script',
      attributes: { 'data-mantine-script': 'true' },
      innerHTML: `try {
  window.localStorage.setItem("theme", "light");
  document.documentElement.setAttribute("data-theme", "light");
  document.documentElement.setAttribute("data-mantine-color-scheme", "light");
} catch (e) {}`,
    },
    {
      tagName: 'script',
      attributes: {
        src: '/gtm-init.js',
      },
    },
  ],

  scripts: [
    {
      src: '/customerio.js',
      defer: true,
    },
  ],

  plugins: [
    'docusaurus-plugin-sass',
    tailwindConfig,
    [
      'docusaurus-markdown-source-plugin',
      {
        docsPath: '/',
        containerSelector: '.doc-actions',
        copyButtonText: 'Copy as Markdown',
        copiedButtonText: 'Copied!',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        routeBasePath: '/',
        path: './docs',
        sidebarPath: './sidebars.ts',
        breadcrumbs: true,
        exclude: ['**/README.md', '**/LICENSE', 'adr/**'],
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
        sidebarItemsGenerator: async (args) => {
          const { defaultSidebarItemsGenerator } = args;
          const items = await defaultSidebarItemsGenerator(args);

          return items.map((item) => {
            if (item.customProps?.collapsed !== undefined) {
              return {
                ...item,
                collapsed: Boolean(item.customProps?.collapsed),
              };
            }
            return item;
          });
        },
        admonitions: {
          keywords: ['experiment'],
          extendDefaults: true,
        },
      },
    ],
    function gtmNoScriptPlugin() {
      return {
        name: 'llm-handbook-gtm-noscript',
        injectHtmlTags() {
          return {
            preBodyTags: [
              {
                tagName: 'noscript',
                innerHTML:
                  '<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NP3FRS6S" height="0" width="0" style="display:none;visibility:hidden"></iframe>',
              },
            ],
          };
        },
      };
    },
  ],

  presets: [
    [
      'classic',
      {
        docs: false,
        theme: {
          customCss: ['./src/css/custom.scss'],
        },
        blog: false,
      } satisfies Preset.Options,
    ],
  ],

  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
      crossorigin: 'anonymous',
    },
  ],

  themeConfig: {
    navbar: {
      logo: {
        alt: 'Modular',
        src: 'images/modular-logo-black.svg',
        srcDark: 'images/modular-logo-white.svg',
        href: 'https://www.modular.com',
        target: '_self',
        width: 104,
        height: 16,
      },
      items: [
        {
          href: 'https://www.modular.com/request-demo',
          label: 'Request a demo',
          position: 'right',
          className: 'navbar-signin-btn',
        },
      ],
    },
    footer: {
      logo: {
        alt: 'Modular',
        src: 'images/modular-logo-white.svg',
        href: 'https://www.modular.com',
      },
      links: [
        {
          items: [
            {
              label: 'Models',
              href: 'https://www.modular.com/models',
            },
            {
              label: 'Blog',
              href: 'https://www.modular.com/blog',
            },
            {
              label: 'Community',
              href: 'https://www.modular.com/community',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/modular/llm-inference-handbook',
            },
            {
              label: 'Contact',
              href: 'https://www.modular.com/request-demo',
            },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Modular Inc`,
    },
    prism: {
      additionalLanguages: ['bash'],
      theme: prismThemes.github,
      darkTheme: prismThemes.github,
    },
    colorMode: {
      defaultMode: 'light',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
  } satisfies Preset.ThemeConfig,

  future: {
    faster: {
      rspackBundler: true,
      rspackPersistentCache: true,
      swcJsLoader: true,
      swcJsMinimizer: true,
      swcHtmlMinimizer: true,
      lightningCssMinimizer: true,
      mdxCrossCompilerCache: true,
    },
  },
};

export default config;
