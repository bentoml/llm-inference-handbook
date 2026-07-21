export type MarketingHeaderLink = {
  label: string;
  href: string;
  description?: string;
};

export type MarketingHeaderMenuGroup = {
  title: string;
  items: MarketingHeaderLink[];
};

export type MarketingHeaderMenu = {
  label: string;
  href?: string;
  groups: MarketingHeaderMenuGroup[];
  cta?: MarketingHeaderLink;
};

export type MarketingHeaderItem =
  | { type: 'link'; label: string; href: string }
  | { type: 'menu'; menu: MarketingHeaderMenu };

export const marketingHeaderItems: MarketingHeaderItem[] = [
  {
    type: 'menu',
    menu: {
      label: 'Product',
      groups: [
        {
          title: 'Inference Products',
          items: [
            {
              label: 'Shared Endpoints',
              href: 'https://www.modular.com/inference/shared-endpoints',
              description: 'Access frontier models via an API',
            },
            {
              label: 'Dedicated Endpoints',
              href: 'https://www.modular.com/inference/dedicated-endpoints',
              description: 'Mission critical reliability',
            },
            {
              label: 'Custom models',
              href: 'https://www.modular.com/inference/custom-models',
              description: 'Your model, peak performance',
            },
          ],
        },
        {
          title: 'Deployment Options',
          items: [
            {
              label: 'Our Cloud',
              href: 'https://www.modular.com/deploy/our-cloud',
              description: 'Fully managed, pay by usage',
            },
            {
              label: 'Your Cloud',
              href: 'https://www.modular.com/deploy/your-cloud',
              description: 'Modular stack in your VPC',
            },
            {
              label: 'Pricing',
              href: 'https://www.modular.com/pricing',
              description: 'Flexible plans for every team',
            },
          ],
        },
      ],
    },
  },
  {
    type: 'menu',
    menu: {
      label: 'Solutions',
      groups: [
        {
          title: 'Solutions',
          items: [
            {
              label: 'Text to audio',
              href: 'https://www.modular.com/solutions/audio',
              description: 'Turn text into natural speech',
            },
            {
              label: 'Image generation',
              href: 'https://www.modular.com/solutions/image-generation',
              description: 'Generate images from text prompts',
            },
            {
              label: 'Code generation',
              href: 'https://www.modular.com/solutions/code-generation',
              description: 'Generate production-ready code',
            },
            {
              label: 'Video generation',
              href: 'https://www.modular.com/solutions/video-generation',
              description: 'Generate video from text + image',
            },
            {
              label: 'Agentic',
              href: 'https://www.modular.com/solutions/agentic',
              description: 'Deploy AI agents anywhere',
            },
            {
              label: 'Custom Models',
              href: 'https://www.modular.com/inference/custom-models',
              description: 'Kernel-level model control',
            },
            {
              label: 'Case Studies',
              href: 'https://www.modular.com/customers',
              description: 'Proven results from real customers',
            },
          ],
        },
      ],
    },
  },
  {
    type: 'menu',
    menu: {
      label: 'Resources',
      groups: [
        {
          title: 'Resources',
          items: [
            {
              label: 'Docs',
              href: 'https://docs.modular.com/',
              description: 'Deploy GenAI models, our cloud or yours',
            },
            {
              label: 'Model Library',
              href: 'https://www.modular.com/models',
              description: 'Latest supported open models',
            },
            {
              label: 'Mojo Docs',
              href: 'https://mojolang.org/docs/',
              description: 'Write high-performance kernels for CPUs and GPUs',
            },
            {
              label: 'LLM Inference Handbook',
              href: 'https://handbook.modular.com/',
              description: 'From basics to production scale',
            },
          ],
        },
      ],
    },
  },
  {
    type: 'menu',
    menu: {
      label: 'Open Source',
      groups: [
        {
          title: 'Open Source',
          items: [
            {
              label: 'MAX Framework',
              href: 'https://www.modular.com/open-source/max',
              description: 'GenAI native modeling & serving',
            },
            {
              label: 'Mojo Language',
              href: 'https://mojolang.org/',
              description: 'The best GPU & CPU performance',
            },
            {
              label: 'Self-Hosted',
              href: 'https://www.modular.com/open-source/self-hosted',
              description: 'MAX+Mojo self-hosted by you',
            },
            {
              label: 'Community',
              href: 'https://www.modular.com/open-source/community',
              description: 'Build the future of AI together',
            },
            {
              label: 'Mojo Agent Skills',
              href: 'https://github.com/modular/skills',
              description: 'Official AI agent skills from Modular',
            },
          ],
        },
      ],
    },
  },
  { type: 'link', label: 'Docs', href: 'https://docs.modular.com/max/' },
  { type: 'link', label: 'Blog', href: 'https://www.modular.com/blog' },
  {
    type: 'menu',
    menu: {
      label: 'Company',
      groups: [
        {
          title: 'Company',
          items: [
            {
              label: 'About',
              href: 'https://www.modular.com/company/about',
              description: 'Build AI for anyone, anywhere.',
            },
            {
              label: 'Careers',
              href: 'https://www.modular.com/company/careers',
              description: "We're currently hiring!",
            },
            {
              label: 'Culture',
              href: 'https://www.modular.com/company/culture',
              description: 'What we believe',
            },
            {
              label: 'Contact Us',
              href: 'https://www.modular.com/request-demo?utm_source=llm_handbook',
              description: 'Request a demo',
            },
          ],
        },
      ],
    },
  },
];

export const marketingHeaderCtas = {
  secondary: {
    label: 'Request a Demo',
    href: 'https://www.modular.com/request-demo?utm_source=llm_handbook',
  },
  primary: {
    label: 'Sign up',
    href: 'https://console.modular.com/signup?utm_source=llm_handbook',
  },
};
