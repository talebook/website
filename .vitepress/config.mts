import { defineConfig } from 'vitepress'

export default defineConfig({
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      title: 'Talebook',
      description: '简洁但功能丰富的个人图书管理系统',
      themeConfig: {
        logo: '/favicon.ico',
        nav: [
          { text: 'Demo', link: 'https://demo.talebook.org' },
        ],

        sidebar: {
          '/guide/': [
            {
              text: '简介',
              items: [
                { text: '关于 Talebook', link: '/guide/about' },
                { text: '社区', link: '/guide/community' },
                { text: '常见问题', link: '/guide/faq' },
              ],
            },
            {
              text: '部署',
              items: [
                { text: 'Docker 部署', link: '/guide/getting-started' },
                { text: 'Kubernetes 部署', link: '/guide/kubernetes' },
                { text: '支持我们', link: '/guide/support' },
              ],
            },
          ],
        },

        docFooter: {
          prev: '上一页',
          next: '下一页',
        },

        outline: {
          label: '目录',
        },

        darkModeSwitchTitle: '切换至深色主题',
        lightModeSwitchTitle: '切换至浅色主题',
        darkModeSwitchLabel: '主题',

        footer: {
          message: '基于 Calibre + Vue 构建',
          copyright: 'Copyright © 2016-2026 Talebook',
        },

        search: {
          options: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档',
              },
              modal: {
                displayDetails: '显示详情',
                resetButtonTitle: '重置',
                backButtonTitle: '关闭',
                noResultsText: '无结果',
                footer: {
                  selectText: '选择',
                  selectKeyAriaLabel: '回车',
                  navigateText: '切换',
                  navigateUpKeyAriaLabel: '上箭头',
                  navigateDownKeyAriaLabel: '下箭头',
                  closeText: '关闭',
                  closeKeyAriaLabel: 'Esc',
                },
              },
            },
          },
        },
      },
    },
    en: {
      label: 'English',
      lang: 'en-US',
      title: 'Talebook',
      description: 'A simple but powerful personal book management system',
      themeConfig: {
        logo: '/favicon.ico',
        nav: [
          { text: 'Demo', link: 'https://demo.talebook.org' },
        ],

        sidebar: {
          '/en/guide/': [
            {
              text: 'Introduction',
              items: [
                { text: 'About Talebook', link: '/en/guide/about' },
                { text: 'Community', link: '/en/guide/community' },
                { text: 'FAQ', link: '/en/guide/faq' },
              ],
            },
            {
              text: 'Deployment',
              items: [
                { text: 'Docker', link: '/en/guide/getting-started' },
                { text: 'Kubernetes', link: '/en/guide/kubernetes' },
                { text: 'Support Us', link: '/en/guide/support' },
              ],
            },
          ],
        },

        footer: {
          message: 'Built with Calibre + Vue',
          copyright: 'Copyright © 2016-2026 Talebook',
        },
      },
    },
  },

  head: [['link', { rel: 'icon', href: '/favicon.ico' }]],

  themeConfig: {
    socialLinks: [
      { icon: 'github', link: 'https://github.com/talebook/talebook' },
    ],

    search: {
      provider: 'local',
    },
  },
})
