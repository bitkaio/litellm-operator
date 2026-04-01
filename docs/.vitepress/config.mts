import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'LiteLLM Operator',
  description: 'Kubernetes operator for deploying and managing production-ready LiteLLM AI Gateway instances',
  ignoreDeadLinks: [
    /\/LICENSE$/,
  ],

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
  ],

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Reference', link: '/reference/crds' },
      {
        text: 'v0.5.0',
        items: [
          { text: 'Changelog', link: '/changelog' },
          { text: 'Contributing', link: '/contributing' },
        ],
      },
    ],

    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'What is LiteLLM Operator?', link: '/guide/what-is-litellm-operator' },
          { text: 'Getting Started', link: '/guide/getting-started' },
          { text: 'Installation', link: '/guide/installation' },
        ],
      },
      {
        text: 'Core Concepts',
        items: [
          { text: 'Architecture', link: '/guide/architecture' },
          { text: 'Config Sync', link: '/guide/config-sync' },
          { text: 'Team Member Management', link: '/guide/team-members' },
          { text: 'Virtual Key Secrets', link: '/guide/virtual-keys' },
        ],
      },
      {
        text: 'Configuration',
        items: [
          { text: 'SSO Setup', link: '/guide/sso' },
          { text: 'SCIM Provisioning', link: '/guide/scim' },
          { text: 'Database', link: '/guide/database' },
          { text: 'Observability', link: '/guide/observability' },
        ],
      },
      {
        text: 'CRD Reference',
        items: [
          { text: 'Overview', link: '/reference/crds' },
          { text: 'LiteLLMInstance', link: '/reference/litellminstance' },
          { text: 'LiteLLMModel', link: '/reference/litellmmodel' },
          { text: 'LiteLLMTeam', link: '/reference/litellmteam' },
          { text: 'LiteLLMUser', link: '/reference/litellmuser' },
          { text: 'LiteLLMVirtualKey', link: '/reference/litellmvirtualkey' },
        ],
      },
      {
        text: 'API Client',
        items: [
          { text: 'LiteLLM API Client', link: '/reference/api-client' },
        ],
      },
      {
        text: 'Development',
        items: [
          { text: 'Contributing', link: '/contributing' },
          { text: 'Testing', link: '/reference/testing' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/bitkaio/litellm-operator' },
    ],

    search: {
      provider: 'local',
    },

    editLink: {
      pattern: 'https://github.com/bitkaio/litellm-operator/edit/main/docs/:path',
    },

    footer: {
      message: 'Released under the Apache 2.0 License.',
      copyright: 'Copyright 2026 bitkaio LLC',
    },
  },
})
