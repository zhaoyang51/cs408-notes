import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "408 计算机考研知识库",
  description: "2026 版 408 计算机考研全科目复习精炼笔记",
  base: "/cs408-notes/",
  
  markdown: {
    math: true
  },

  themeConfig: {
    logo: '/logo.png',
    siteTitle: '408 考研知识库',

    nav: [
      { text: '🏠 首页', link: '/' },
      { text: '📘 数据结构 (45分)', link: '/data-structure/' },
      { text: '💻 计算机组成原理 (45分)', link: '/computer-organization/' },
      { text: '⚙️ 操作系统 (35分)', link: '/operating-system/' },
      { text: '🌐 计算机网络 (25分)', link: '/computer-network/' }
    ],

    sidebar: {
      "/data-structure/": [
            {
                  "text": "📖 数据结构（45分）",
                  "items": [
                        {
                              "text": "📌 科目复习总览",
                              "link": "/data-structure/"
                        },
                        {
                              "text": "一、基本概念",
                              "link": "/data-structure/01-basic-concepts"
                        },
                        {
                              "text": "二、线性表",
                              "link": "/data-structure/02-linear-list"
                        },
                        {
                              "text": "三、栈、队列和数组",
                              "link": "/data-structure/03-stack-queue-array"
                        },
                        {
                              "text": "四、树和二叉树",
                              "link": "/data-structure/04-tree-binary-tree"
                        },
                        {
                              "text": "五、图",
                              "link": "/data-structure/05-graph"
                        },
                        {
                              "text": "六、查找",
                              "link": "/data-structure/06-search"
                        },
                        {
                              "text": "七、排序",
                              "link": "/data-structure/07-sort"
                        }
                  ]
            }
      ],
      "/computer-organization/": [
            {
                  "text": "📖 计算机组成原理（45分）",
                  "items": [
                        {
                              "text": "📌 科目复习总览",
                              "link": "/computer-organization/"
                        },
                        {
                              "text": "一、计算机系统概述",
                              "link": "/computer-organization/01-overview"
                        },
                        {
                              "text": "二、数据的表示和运算",
                              "link": "/computer-organization/02-data-representation"
                        },
                        {
                              "text": "三、存储器层次结构",
                              "link": "/computer-organization/03-memory-hierarchy"
                        },
                        {
                              "text": "四、指令系统",
                              "link": "/computer-organization/04-instruction-system"
                        },
                        {
                              "text": "五、中央处理器（CPU）",
                              "link": "/computer-organization/05-cpu"
                        },
                        {
                              "text": "六、总线和输入输出系统",
                              "link": "/computer-organization/06-bus-io"
                        }
                  ]
            }
      ],
      "/operating-system/": [
            {
                  "text": "📖 操作系统（35分）",
                  "items": [
                        {
                              "text": "📌 科目复习总览",
                              "link": "/operating-system/"
                        },
                        {
                              "text": "一、操作系统概述",
                              "link": "/operating-system/01-overview"
                        },
                        {
                              "text": "二、进程管理",
                              "link": "/operating-system/02-process-management"
                        },
                        {
                              "text": "三、内存管理",
                              "link": "/operating-system/03-memory-management"
                        },
                        {
                              "text": "四、文件管理",
                              "link": "/operating-system/04-file-system"
                        },
                        {
                              "text": "五、输入/输出（I/O）管理",
                              "link": "/operating-system/05-io-management"
                        }
                  ]
            }
      ],
      "/computer-network/": [
            {
                  "text": "📖 计算机网络（25分）",
                  "items": [
                        {
                              "text": "📌 科目复习总览",
                              "link": "/computer-network/"
                        },
                        {
                              "text": "一、计算机网络体系结构",
                              "link": "/computer-network/01-overview"
                        },
                        {
                              "text": "二、物理层",
                              "link": "/computer-network/02-physical-layer"
                        },
                        {
                              "text": "三、数据链路层",
                              "link": "/computer-network/03-data-link-layer"
                        },
                        {
                              "text": "四、网络层",
                              "link": "/computer-network/04-network-layer"
                        },
                        {
                              "text": "五、传输层",
                              "link": "/computer-network/05-transport-layer"
                        },
                        {
                              "text": "六、应用层",
                              "link": "/computer-network/06-application-layer"
                        }
                  ]
            }
      ]
},

    socialLinks: [
      { icon: 'github', link: 'https://github.com/zhaoyang51/cs408-notes' }
    ],

    footer: {
      message: '2026 计算机学科专业基础综合 (408) 全程备考复习指南',
      copyright: 'Copyright © 2026 zhaoyang51'
    },

    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索 408 考点',
                buttonAriaLabel: '搜索 408 考点'
              },
              modal: {
                noResultsText: '无法找到相关考点',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭'
                }
              }
            }
          }
        }
      }
    },

    outline: {
      level: [2, 3],
      label: '本章目录'
    },

    docFooter: {
      prev: '上一节',
      next: '下一节'
    },

    darkModeSwitchLabel: '深色模式',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    sidebarMenuLabel: '目录',
    returnToTopLabel: '返回顶部'
  }
})
