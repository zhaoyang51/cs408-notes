import fs from 'node:fs'
import path from 'node:path'

export interface UserStats {
  total: number
  bySubject: {
    ds: number // 数据结构
    co: number // 计组
    os: number // 操作系统
    cn: number // 计网
  }
}

export interface StatsData {
  totalKP: number
  totalArticles: number
  zhao: UserStats
  chen: UserStats
  all: {
    total: number
    bySubject: {
      ds: number
      co: number
      os: number
      cn: number
    }
  }
}

const SUBJECT_NAMES = {
  ds: '数据结构',
  co: '计算机组成原理',
  os: '操作系统',
  cn: '计算机网络'
}

function getSubjectKey(filePath: string): 'ds' | 'co' | 'os' | 'cn' | 'other' {
  if (filePath.includes('data-structure')) return 'ds'
  if (filePath.includes('computer-organization')) return 'co'
  if (filePath.includes('operating-system')) return 'os'
  if (filePath.includes('computer-network')) return 'cn'
  return 'other'
}

export default {
  watch: ['../../**/*.md'],
  load(): StatsData {
    const docsDir = path.resolve(__dirname, '../../')
    
    const stats: StatsData = {
      totalKP: 0,
      totalArticles: 0,
      zhao: { total: 0, bySubject: { ds: 0, co: 0, os: 0, cn: 0 } },
      chen: { total: 0, bySubject: { ds: 0, co: 0, os: 0, cn: 0 } },
      all: { total: 0, bySubject: { ds: 0, co: 0, os: 0, cn: 0 } }
    }

    function scanDir(dir: string) {
      if (!fs.existsSync(dir)) return
      const files = fs.readdirSync(dir, { withFileTypes: true })
      
      for (const file of files) {
        const fullPath = path.join(dir, file.name)
        if (file.isDirectory()) {
          if (file.name !== 'node_modules' && file.name !== '.vitepress' && file.name !== 'dist' && file.name !== '.git') {
            scanDir(fullPath)
          }
        } else if (file.isFile() && file.name.endsWith('.md')) {
          stats.totalArticles++
          const subject = getSubjectKey(fullPath)
          const content = fs.readFileSync(fullPath, 'utf-8')
          
          // 仅统计用户自身创建/贡献的专属知识点（排除未署名的公共知识）
          // 1. 匹配 <KP author="Zhao"...>、<KnowledgePoint author="Zhao"...>、<AuthorTag author="Zhao"...>
          const zhaoKPMatches = content.match(/<(KP|KnowledgePoint|AuthorTag)\b[^>]*(?:author|user)=["']zhao["'][^>]*>/gi) || []
          const chenKPMatches = content.match(/<(KP|KnowledgePoint|AuthorTag)\b[^>]*(?:author|user)=["']chen["'][^>]*>/gi) || []
          
          // 2. 匹配独立的 data-author="zhao" / data-author="chen"（若同一文件已通过组件匹配则去重）
          const zhaoDataMatches = zhaoKPMatches.length > 0 ? [] : (content.match(/data-author=["']zhao["']/gi) || [])
          const chenDataMatches = chenKPMatches.length > 0 ? [] : (content.match(/data-author=["']chen["']/gi) || [])

          // 3. 匹配 Frontmatter author: Zhao / Chen（整篇为个人专栏时计 1）
          const frontmatterZhao = /---\s*[\s\S]*?author:\s*Zhao[\s\S]*?---/i.test(content)
          const frontmatterChen = /---\s*[\s\S]*?author:\s*Chen[\s\S]*?---/i.test(content)

          const zhaoCount = zhaoKPMatches.length + zhaoDataMatches.length + (frontmatterZhao ? 1 : 0)
          const chenCount = chenKPMatches.length + chenDataMatches.length + (frontmatterChen ? 1 : 0)

          // 纯粹统计各自用户的贡献数量，绝不统计公共知识
          stats.zhao.total += zhaoCount
          stats.chen.total += chenCount

          if (subject !== 'other') {
            stats.zhao.bySubject[subject] += zhaoCount
            stats.chen.bySubject[subject] += chenCount
            // 用户贡献总计为各用户贡献之和，不计入公共章节
            stats.all.bySubject[subject] += (zhaoCount + chenCount)
          }
        }
      }
    }

    scanDir(docsDir)

    stats.all.total = stats.zhao.total + stats.chen.total
    stats.totalKP = stats.all.total

    return stats
  }
}
