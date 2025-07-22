import { themes as prismThemes } from 'prism-react-renderer'
import type { Config } from '@docusaurus/types'
import type * as Preset from '@docusaurus/preset-classic'

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'LLM Inference Handbook',
  tagline: 'BentoML LLM Inference Handbook',
  favicon: 'img/favicon-32x32.png',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://bentoml.com/',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/llm/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'bentoml', // Usually your GitHub org/user name.
  projectName: 'llm-inference-handbook', // Usually your repo name.
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en']
  },

  presets: [
    [
      'classic',
      {
        googleTagManager: {
          containerId: 'GTM-NLGDMK5'
        },
        docs: {
          routeBasePath: '/',
          sidebarItemsGenerator: async (args) => {
            const { defaultSidebarItemsGenerator } = args
            const items = await defaultSidebarItemsGenerator(args)

            return items.map((item) => {
              if (item.customProps?.collapsed !== undefined) {
                return {
                  ...item,
                  collapsed: Boolean(item.customProps?.collapsed)
                }
              }
              return item
            })
          }
        },
        theme: {
          customCss: './src/css/custom.css'
        }
      } satisfies Preset.Options
    ]
  ],

  themeConfig: {
    colorMode: {
      disableSwitch: true
    },
    image: 'img/handbook-cover-image.png',
    docs: {
      sidebar: {
        autoCollapseCategories: true
      }
    },
    navbar: {
      hideOnScroll: false,
      logo: {
        alt: 'bentoml logo',
        src: 'img/logo.svg',
        href: 'https://www.bentoml.com',
        height: 41
      },
      items: [
        {
          position: 'left',
          label: 'Product',
          items: [
            {
              label: 'Bento Inference Platform',
              description:
                'Full control without the complexity. Self-host anywhere. Serve any model. Optimize for performance.',
              text: 'Book a Demo',
              href: 'https://l.bentoml.com/signup-llm-inference-handbook',
              icon: '/img/inference-platform.svg'
            },
            {
              label: 'BentoML Open-Source',
              description:
                'The most flexible way to serve AI/ML models and custom inference pipelines in production',
              text: 'Github',
              href: 'https://github.com/bentoml',
              icon: '/img/open-source.svg'
            }
          ]
        },
        {
          position: 'left',
          href: 'https://www.bentoml.com/pricing',
          label: 'Pricing'
        },
        {
          position: 'left',
          href: 'https://docs.bentoml.com/?_gl=1*m5ucq6*_gcl_au*MjA4MzA3MTQ2NS4xNzQ3OTI4MDA5',
          label: 'Docs'
        },
        {
          position: 'left',
          label: 'Learn',
          items: [
            {
              href: 'https://www.bentoml.com/blog',
              label: 'Blog'
            },
            {
              href: 'https://www.bentoml.com/llm',
              label: 'LLM Inference Handbook'
            },
            {
              href: 'https://docs.bentoml.com/en/latest/examples/overview.html?_gl=1*m5mrt*_gcl_au*MjA4MzA3MTQ2NS4xNzQ3OTI4MDA5',
              label: 'Featured Examples'
            }
          ]
        },
        {
          position: 'left',
          href: 'https://www.bentoml.com/customers',
          label: 'Customers'
        },
        {
          position: 'right',
          href: 'https://github.com/bentoml/llm-inference-handbook',
          label: 'GitHub',
          icon: '/img/github.svg'
        },
        {
          position: 'right',
          href: 'https://l.bentoml.com/signup-llm-inference-handbook',
          label: 'Sign Up',
          button: 'light-purple'
        }
      ]
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula
    }
  } satisfies Preset.ThemeConfig
}

export default config
