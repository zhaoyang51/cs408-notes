import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "408 简纲速查",
  description: "408 计算机考研全科目核心知识点简纲 · 应试最小集与公式速查",
  base: "/cs408-notes/",
  cleanUrls: true,

  markdown: {
    math: true,
    headers: {
      level: [2, 3, 4]
    }
  },

  themeConfig: {
    siteTitle: '408 考研简纲',

    nav: [
      { text: '⚡ 首页', link: '/' },
      { text: '📘 数据结构', link: '/data-structure/' },
      { text: '💻 计组', link: '/computer-organization/' },
      { text: '⚙️ 操作系统', link: '/operating-system/' },
      { text: '🌐 计网', link: '/computer-network/' }
    ],


    sidebar: {
      // ════════ 完整模式侧边栏 ════════
      '/data-structure/': [
        {
          text: '📘 数据结构（45分）',
          items: [
            { text: '📌 考纲与题型导览', link: '/data-structure/' },
            { text: '第1章 基本概念与时空复杂度', link: '/data-structure/01-basic-concepts' },
            { text: '第2章 线性表', link: '/data-structure/02-linear-list' },
            { text: '第3章 栈、队列和数组', link: '/data-structure/03-stack-queue-array' },
            { text: '第4章 树和二叉树', link: '/data-structure/04-tree-binary-tree' },
            { text: '第5章 图', link: '/data-structure/05-graph' },
            { text: '第6章 查找与散列', link: '/data-structure/06-search' },
            { text: '第7章 内部与外部排序', link: '/data-structure/07-sort' }
          ]
        }
      ],
      '/computer-organization/': [
        {
          text: '💻 计算机组成原理（45分）',
          items: [
            { text: '📌 考纲与题型导览', link: '/computer-organization/' },
            { text: '第1章 计算机系统概述与性能指标', link: '/computer-organization/01-overview' },
            { text: '第2章 数据的表示和运算', link: '/computer-organization/02-data-representation' },
            { text: '第3章 存储器层次结构 (Cache/主存)', link: '/computer-organization/03-memory-hierarchy' },
            { text: '第4章 指令系统与寻址方式', link: '/computer-organization/04-instruction-system' },
            { text: '第5章 CPU、数据通路与控制器', link: '/computer-organization/05-cpu' },
            { text: '第6章 总线与输入输出系统', link: '/computer-organization/06-bus-io' }
          ]
        }
      ],
      '/operating-system/': [
        {
          text: '⚙️ 操作系统（35分）',
          items: [
            { text: '📌 考纲与题型导览', link: '/operating-system/' },
            { text: '第1章 操作系统概述与体系结构', link: '/operating-system/01-overview' },
            { text: '第2章 进程线程、调度与死锁', link: '/operating-system/02-process-management' },
            { text: '第3章 内存管理与虚拟内存', link: '/operating-system/03-memory-management' },
            { text: '第4章 文件系统与磁盘调度', link: '/operating-system/04-file-system' },
            { text: '第5章 I/O 核心子系统与 SPOOLing', link: '/operating-system/05-io-management' }
          ]
        }
      ],
      '/computer-network/': [
        {
          text: '🌐 计算机网络（25分）',
          items: [
            { text: '📌 考纲与题型导览', link: '/computer-network/' },
            { text: '第1章 计算机网络体系结构', link: '/computer-network/01-overview' },
            { text: '第2章 物理层与通信基础', link: '/computer-network/02-physical-layer' },
            { text: '第3章 数据链路层与 MAC', link: '/computer-network/03-data-link-layer' },
            { text: '第4章 网络层与 IP 协议', link: '/computer-network/04-network-layer' },
            { text: '第5章 传输层 (TCP / UDP)', link: '/computer-network/05-transport-layer' },
            { text: '第6章 应用层 (HTTP / DNS / 邮件)', link: '/computer-network/06-application-layer' }
          ]
        }
      ],

      // ════════ 📖 笔记模式专属侧边栏 ════════
      '/concise/data-structure/': [
        {
          text: '📘 数据结构（笔记模式）',
          items: [
            { text: '📌 考纲与题型导览', link: '/concise/data-structure/' },
            { text: '第1章 基本概念与时空复杂度', link: '/concise/data-structure/01-basic-concepts' },
            { text: '第2章 线性表', link: '/concise/data-structure/02-linear-list' },
            { text: '第3章 栈、队列和数组', link: '/concise/data-structure/03-stack-queue-array' },
            { text: '第4章 树和二叉树', link: '/concise/data-structure/04-tree-binary-tree' },
            { text: '第5章 图', link: '/concise/data-structure/05-graph' },
            { text: '第6章 查找与散列', link: '/concise/data-structure/06-search' },
            { text: '第7章 内部与外部排序', link: '/concise/data-structure/07-sort' }
          ]
        }
      ],
      '/concise/computer-organization/': [
        {
          text: '💻 计算机组成原理（笔记模式）',
          items: [
            { text: '📌 考纲与题型导览', link: '/concise/computer-organization/' },
            { text: '第1章 计算机系统概述与性能指标', link: '/concise/computer-organization/01-overview' },
            { text: '第2章 数据的表示和运算', link: '/concise/computer-organization/02-data-representation' },
            { text: '第3章 存储器层次结构 (Cache/主存)', link: '/concise/computer-organization/03-memory-hierarchy' },
            { text: '第4章 指令系统与寻址方式', link: '/concise/computer-organization/04-instruction-system' },
            { text: '第5章 CPU、数据通路与控制器', link: '/concise/computer-organization/05-cpu' },
            { text: '第6章 总线与输入输出系统', link: '/concise/computer-organization/06-bus-io' }
          ]
        }
      ],
      '/concise/operating-system/': [
        {
          text: '⚙️ 操作系统（笔记模式）',
          items: [
            { text: '📌 考纲与题型导览', link: '/concise/operating-system/' },
            { text: '第1章 操作系统概述与体系结构', link: '/concise/operating-system/01-overview' },
            { text: '第2章 进程线程、调度与死锁', link: '/concise/operating-system/02-process-management' },
            { text: '第3章 内存管理与虚拟内存', link: '/concise/operating-system/03-memory-management' },
            { text: '第4章 文件系统与磁盘调度', link: '/concise/operating-system/04-file-system' },
            { text: '第5章 I/O 核心子系统与 SPOOLing', link: '/concise/operating-system/05-io-management' }
          ]
        }
      ],
      '/concise/computer-network/': [
        {
          text: '🌐 计算机网络（笔记模式）',
          items: [
            { text: '📌 考纲与题型导览', link: '/concise/computer-network/' },
            { text: '第1章 计算机网络体系结构', link: '/concise/computer-network/01-overview' },
            { text: '第2章 物理层与通信基础', link: '/concise/computer-network/02-physical-layer' },
            { text: '第3章 数据链路层与 MAC', link: '/concise/computer-network/03-data-link-layer' },
            { text: '第4章 网络层与 IP 协议', link: '/concise/computer-network/04-network-layer' },
            { text: '第5章 传输层 (TCP / UDP)', link: '/concise/computer-network/05-transport-layer' },
            { text: '第6章 应用层 (HTTP / DNS / 邮件)', link: '/concise/computer-network/06-application-layer' }
          ]
        }
      ],
      '/concise/': [
        {
          text: '📖 408 核心手记（笔记模式）',
          items: [
            { text: '📖 笔记模式首页', link: '/concise/' },
            { text: '📘 数据结构笔记', link: '/concise/data-structure/' },
            { text: '💻 计组笔记', link: '/concise/computer-organization/' },
            { text: '⚙️ 操作系统笔记', link: '/concise/operating-system/' },
            { text: '🌐 计网笔记', link: '/concise/computer-network/' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/zhaoyang51/cs408-notes' }
    ],

    footer: {
      message: '408 考研简纲 · 极简应试与公式速查',
      copyright: 'Copyright © 2026 zhaoyang51'
    },

    search: {
      provider: 'local',
      options: {
        miniSearch: {
          options: {
            tokenize: (term) => {
              if (typeof Intl !== 'undefined' && Intl.Segmenter) {
                const segmenter = new Intl.Segmenter('zh-CN', { granularity: 'word' })
                return Array.from(segmenter.segment(term), x => x.segment.trim()).filter(Boolean)
              }
              return term.split(/\s+/)
            }
          },
          searchOptions: {
            fuzzy: 0.2,
            prefix: true,
            boost: { title: 4, text: 2, titles: 1 }
          }
        },
        locales: {
          root: {
            translations: {
              button: { buttonText: '搜索 408 考点 (Ctrl+K)', buttonAriaLabel: '搜索 408 考点' },
              modal: {
                displayDetails: '显示详情',
                resetButtonTitle: '清除条件',
                backButtonTitle: '返回',
                noResultsText: '未找到相关考点',
                footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' }
              }
            }
          }
        }
      }
    },

    outline: { level: [2, 3], label: '本页大纲' },
    docFooter: { prev: '上一章', next: '下一章' }
  }
})
