const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = 'd:/Hajimi/408Note';
const PDF_PATH = path.join(ROOT_DIR, '408真题分类做题本.pdf');
const OUT_DIR = path.join(ROOT_DIR, 'docs/public/data/practice');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

console.log('=== Step 1: Extracting full text from PDF ===');
let fullText = '';
const scratchTextPath = 'C:/Users/夜斗/.gemini/antigravity-ide/brain/098857dd-3ff7-42fe-9dcf-4b51d281e6f6/scratch/full_exam_text.txt';
if (fs.existsSync(scratchTextPath)) {
  fullText = fs.readFileSync(scratchTextPath, 'utf8');
} else {
  fullText = execSync(`node ./node_modules/pdf-parse/bin/cli.mjs text "${PDF_PATH}"`, {
    cwd: ROOT_DIR,
    maxBuffer: 200 * 1024 * 1024
  }).toString();
}
console.log(`Full text length: ${fullText.length}`);

// Map section code prefix to related documentation path
function getRelatedPath(sectionCode) {
  const parts = sectionCode.split('.');
  const major = parts[0];
  const minor = parseInt(parts[1]);
  if (major === '1') {
    // Data Structure
    if (minor === 1) return '/data-structure/01-basic-concepts';
    if (minor === 2) return '/data-structure/02-linear-list';
    if (minor === 3) return '/data-structure/03-stack-queue-array';
    if (minor === 4) return '/data-structure/03-stack-queue-array';
    if (minor === 5) return '/data-structure/02-linear-list'; // KMP
    if (minor === 6) return '/data-structure/04-tree-binary-tree';
    if (minor === 7) return '/data-structure/05-graph';
    if (minor === 8) return '/data-structure/06-search';
    if (minor === 9) return '/data-structure/07-sort';
    return '/data-structure/';
  } else if (major === '2') {
    // Computer Organization
    if (minor === 1) return '/computer-organization/01-overview';
    if (minor === 2) return '/computer-organization/02-data-representation';
    if (minor === 3) return '/computer-organization/03-memory-hierarchy';
    if (minor === 4) return '/computer-organization/04-instruction-system';
    if (minor === 5) return '/computer-organization/05-cpu';
    if (minor === 6 || minor === 7) return '/computer-organization/06-bus-io';
    return '/computer-organization/';
  } else if (major === '3') {
    // Operating System
    if (minor === 1) return '/operating-system/01-overview';
    if (minor === 2) return '/operating-system/02-process-management';
    if (minor === 3) return '/operating-system/03-memory-management';
    if (minor === 4) return '/operating-system/04-file-system';
    if (minor === 5) return '/operating-system/05-io-management';
    return '/operating-system/';
  } else if (major === '4') {
    // Computer Network
    if (minor === 1) return '/computer-network/01-overview';
    if (minor === 2) return '/computer-network/02-physical-layer';
    if (minor === 3) return '/computer-network/03-data-link-layer';
    if (minor === 4) return '/computer-network/04-network-layer';
    if (minor === 5) return '/computer-network/05-transport-layer';
    if (minor === 6) return '/computer-network/06-application-layer';
    return '/computer-network/';
  }
  return '/';
}

function getSubjectKey(sectionCode) {
  const m = sectionCode.split('.')[0];
  if (m === '1') return { key: 'data-structure', name: '数据结构' };
  if (m === '2') return { key: 'computer-organization', name: '计算机组成原理' };
  if (m === '3') return { key: 'operating-system', name: '操作系统' };
  if (m === '4') return { key: 'computer-network', name: '计算机网络' };
  return { key: 'other', name: '其他' };
}

// Section Code to Clean Titles
const SECTION_TITLES = {
  '1.1.1': '算法时空复杂度',
  '1.2.1': '线性表的顺序存储',
  '1.2.2': '线性表的链式存储',
  '1.3.1': '栈',
  '1.3.2': '队列',
  '1.4.1': '数组的存储与基本操作',
  '1.4.2': '特殊矩阵的压缩存储',
  '1.4.3': '稀疏矩阵的压缩存储',
  '1.5.1': 'KMP 匹配算法',
  '1.6.1': '二叉树的概念与存储',
  '1.6.2': '二叉树的遍历与线索化',
  '1.6.3': '树/森林与二叉树的转换',
  '1.6.4': '哈夫曼树及其编码',
  '1.7.1': '图的基本概念与存储',
  '1.7.2': '图的遍历',
  '1.7.3': '最短路径',
  '1.7.4': '最小生成树',
  '1.7.5': '拓扑排序与关键路径',
  '1.8.1': '顺序查找',
  '1.8.2': '折半查找',
  '1.8.3': '分块查找',
  '1.8.4': '二叉排序树',
  '1.8.5': '平衡二叉树',
  '1.8.6': '散列查找',
  '1.8.7': 'B 树与 B+ 树',
  '1.9.1': '直接插入排序',
  '1.9.2': '希尔排序',
  '1.9.3': '冒泡排序',
  '1.9.4': '快速排序',
  '1.9.5': '简单选择排序',
  '1.9.6': '堆排序',
  '1.9.7': '归并排序',
  '1.9.8': '基数排序',
  '2.1.1': '计算机层级结构',
  '2.1.2': '计算机性能指标',
  '2.2.1': '定点数的表示与运算',
  '2.2.2': '浮点数的表示与运算',
  '2.2.3': '数据类型转换',
  '2.2.4': '数据的大小端和对齐存储',
  '2.3.1': '主存储器与 CPU 的连接',
  '2.3.2': '外部存储器',
  '2.3.3': 'Cache 高速缓存',
  '2.3.4': '虚拟存储器',
  '2.4.1': '指令格式与操作码扩展',
  '2.4.2': '寻址方式',
  '2.4.3': '程序的机器级代码表示',
  '2.4.4': 'RISC 与 CISC',
  '2.5.1': '指令周期与执行过程',
  '2.5.2': '数据通路',
  '2.5.3': '微程序与硬布线控制器',
  '2.5.4': '异常与中断机制',
  '2.5.5': '指令流水线',
  '2.5.6': '多处理器',
  '2.6.1': '总线分类与性能指标',
  '2.6.2': '总线定时与事务',
  '2.6.3': '总线标准',
  '2.7.1': 'I/O 接口概念与功能',
  '2.7.2': '程序查询方式',
  '2.7.3': '程序中断方式',
  '2.7.4': 'DMA 方式',
  '3.1.1': '操作系统的概念与功能',
  '3.1.2': '操作系统的运行环境',
  '3.1.3': '操作系统的结构与引导',
  '3.2.1': '进程与线程',
  '3.2.2': '处理机调度',
  '3.2.3': '同步与互斥',
  '3.2.4': '死锁',
  '3.3.1': '连续与非连续分配',
  '3.3.2': '虚拟内存管理',
  '3.4.1': '文件的逻辑结构与物理结构',
  '3.4.2': '文件系统',
  '3.4.3': '文件的共享与保护',
  '3.5.1': 'I/O 设备与控制方式',
  '3.5.2': '设备独立性软件',
  '3.5.3': '设备分配与回收',
  '3.5.4': '磁盘与调度算法',
  '4.1.1': '计算机网络概述与性能指标',
  '4.1.2': '三种交换方式',
  '4.1.3': 'OSI 与 TCP/IP 参考模型',
  '4.2.1': '通信基础',
  '4.2.2': '传输介质与编码调制',
  '4.3.1': '组帧与差错控制',
  '4.3.2': '流量控制与滑动窗口机制',
  '4.3.3': '介质访问控制',
  '4.3.4': '局域网与交换机',
  '4.4.1': '网络层的功能',
  '4.4.2': 'IPv4 协议与地址',
  '4.4.3': 'IPv6',
  '4.4.4': '路由算法与协议',
  '4.4.5': '网络层设备',
  '4.5.1': 'UDP 协议特点与应用',
  '4.5.2': 'TCP 协议',
  '4.6.1': '网络应用模型',
  '4.6.2': 'DNS 系统与域名解析',
  '4.6.3': 'FTP 协议',
  '4.6.4': '电子邮件',
  '4.6.5': 'HTTP 协议与网页访问'
};

console.log('=== Step 2: Parsing page by page for section code & question metadata ===');
const pages = fullText.split(/--\s*\d+\s*of\s*801\s*--/);

let currentSubjectKey = 'data-structure';
let currentSectionCode = '1.1.1';
let currentType = 'choice';

const questionMetaMap = new Map(); // id -> { subject, sectionCode, type, page }

for (let p = 7; p < pages.length; p++) {
  const pText = pages[p];
  if (pText.includes('第一部分') && pText.includes('数据结构')) currentSubjectKey = 'data-structure';
  if (pText.includes('第二部分') && pText.includes('计算机组成原理')) currentSubjectKey = 'computer-organization';
  if (pText.includes('第三部分') && pText.includes('操作系统')) currentSubjectKey = 'operating-system';
  if (pText.includes('第四部分') && pText.includes('计算机网络')) currentSubjectKey = 'computer-network';

  if (pText.includes('单项选择题')) currentType = 'choice';
  if (pText.includes('综合应用题')) currentType = 'comprehensive';

  const secMatch = pText.match(/(?:^|\n)\s*(\d+\.\d+\.\d+)(?:\s+([^\d\n]+))?(?:\s+(\d+))?/);
  if (secMatch) {
    currentSectionCode = secMatch[1];
  }

  const qMatches = [...pText.matchAll(/(?:^|\n)\s*(\d+)\s+\((\d{4}-\d+)\)/g)];
  for (const qm of qMatches) {
    const qId = parseInt(qm[1]);
    const source = qm[2];
    questionMetaMap.set(qId, {
      id: qId,
      source: source,
      year: parseInt(source.split('-')[0]),
      qIndex: parseInt(source.split('-')[1]),
      subjectKey: currentSubjectKey,
      sectionCode: currentSectionCode,
      sectionTitle: SECTION_TITLES[currentSectionCode] || currentSectionCode,
      type: currentType,
      page: p
    });
  }
}

console.log(`Matched ${questionMetaMap.size} question metadata entries.`);

console.log('=== Step 3: Extracting question stems & options ===');
const qPositions = [];
const qRegex = /(?:^|\n)\s*(\d+)\s+\((\d{4}-\d+)\)/g;
let m;
while ((m = qRegex.exec(fullText)) !== null) {
  qPositions.push({
    num: parseInt(m[1]),
    source: m[2],
    index: m.index,
    matchLen: m[0].length
  });
}

function cleanQuestionBody(raw) {
  let s = raw;
  s = s.replace(/第\s*\d+\s*页\s*\/\s*共\s*\d+\s*页/g, '');
  s = s.replace(/--\s*\d+\s*of\s*\d+\s*--/g, '');
  s = s.replace(/^[ \t]*(\. ?){5,}[ \t]*$/gm, '');
  s = s.replace(/^[ \t]*\d+[ \t]*$/gm, '');
  s = s.replace(/(?:第一|第二|第三|第四)部分[^\n]*/g, '');
  s = s.replace(/（本大题共\s*\d+\s*题[^\n]*）/g, '');
  s = s.replace(/单项选择题/g, '');
  s = s.replace(/综合应用题/g, '');
  s = s.replace(/^\s*\d+\.\d+(?:\.\d+)?(?:\s+[^\n]*)?$/gm, '');
  s = s.replace(/\n{3,}/g, '\n\n').trim();
  return s;
}

function parseStemAndOptions(rawCleanText, type) {
  if (type === 'comprehensive') {
    return {
      stem: rawCleanText.trim(),
      options: []
    };
  }

  // Parse (A) ... (B) ... (C) ... (D) ...
  const optRegex = /(?:\(|（)?([A-D])(?:\)|）|[.、])\s*([\s\S]*?)(?=(?:\(|（)?[B-D](?:\)|）|[.、])\s*|$)/g;
  const options = [];
  let match;
  let firstIdx = -1;
  while ((match = optRegex.exec(rawCleanText)) !== null) {
    if (firstIdx === -1) firstIdx = match.index;
    options.push({
      label: match[1],
      text: match[2].trim().replace(/\n+/g, ' ')
    });
  }

  if (options.length === 4 && options[0].label === 'A' && options[1].label === 'B' && options[2].label === 'C' && options[3].label === 'D') {
    return {
      stem: rawCleanText.slice(0, firstIdx).trim(),
      options: options
    };
  }

  return {
    stem: rawCleanText.trim(),
    options: options
  };
}

// Load answer database if available
let answerDb = {};
const ansDbPath = 'C:/Users/夜斗/.gemini/antigravity-ide/brain/098857dd-3ff7-42fe-9dcf-4b51d281e6f6/scratch/master_answers.json';
if (fs.existsSync(ansDbPath)) {
  try {
    answerDb = JSON.parse(fs.readFileSync(ansDbPath, 'utf8'));
    console.log(`Loaded ${Object.keys(answerDb).length} verified answers and explanations.`);
  } catch (e) {}
}

const allQuestions = [];

for (let i = 0; i < qPositions.length; i++) {
  const cur = qPositions[i];
  const next = qPositions[i + 1];
  const endIdx = next ? next.index : fullText.length;
  const rawBody = fullText.slice(cur.index + cur.matchLen, endIdx);
  const cleanBody = cleanQuestionBody(rawBody);
  const meta = questionMetaMap.get(cur.num) || {};
  
  const { stem, options } = parseStemAndOptions(cleanBody, meta.type || 'choice');
  const ansInfo = answerDb[cur.source] || {};

  allQuestions.push({
    id: cur.num,
    source: cur.source,
    year: meta.year || parseInt(cur.source.split('-')[0]),
    qIndex: meta.qIndex || parseInt(cur.source.split('-')[1]),
    subjectKey: meta.subjectKey || 'data-structure',
    subjectName: getSubjectKey(meta.sectionCode || '1.1.1').name,
    sectionCode: meta.sectionCode || '1.1.1',
    sectionTitle: meta.sectionTitle || SECTION_TITLES[meta.sectionCode] || '核心考点',
    type: meta.type || (cur.qIndex > 40 ? 'comprehensive' : 'choice'),
    stem: stem,
    options: options,
    answer: ansInfo.answer || '',
    explanation: ansInfo.explanation || '',
    relatedPath: getRelatedPath(meta.sectionCode || '1.1.1')
  });
}

console.log(`Successfully built ${allQuestions.length} full question records!`);

console.log('=== Step 4: Grouping questions by subject and exporting JSON ===');
const subjects = [
  { key: 'data-structure', name: '数据结构' },
  { key: 'computer-organization', name: '计算机组成原理' },
  { key: 'operating-system', name: '操作系统' },
  { key: 'computer-network', name: '计算机网络' }
];

const subjectQuestions = {
  'data-structure': [],
  'computer-organization': [],
  'operating-system': [],
  'computer-network': []
};

for (const q of allQuestions) {
  if (subjectQuestions[q.subjectKey]) {
    subjectQuestions[q.subjectKey].push(q);
  } else {
    subjectQuestions['data-structure'].push(q);
  }
}

for (const s of subjects) {
  const filePath = path.join(OUT_DIR, `${s.key}.json`);
  fs.writeFileSync(filePath, JSON.stringify(subjectQuestions[s.key], null, 2), 'utf8');
  console.log(`Exported ${s.name} (${subjectQuestions[s.key].length} 题) -> ${filePath}`);
}

// Build sections tree with question counts
const sectionTree = [];
const sectionCountMap = new Map();
for (const q of allQuestions) {
  sectionCountMap.set(q.sectionCode, (sectionCountMap.get(q.sectionCode) || 0) + 1);
}

for (const [code, title] of Object.entries(SECTION_TITLES)) {
  const subKey = getSubjectKey(code);
  sectionTree.push({
    code: code,
    title: title,
    subjectKey: subKey.key,
    subjectName: subKey.name,
    count: sectionCountMap.get(code) || 0,
    relatedPath: getRelatedPath(code)
  });
}

fs.writeFileSync(path.join(OUT_DIR, 'sections.json'), JSON.stringify(sectionTree, null, 2), 'utf8');
console.log(`Exported ${sectionTree.length} sections -> ${path.join(OUT_DIR, 'sections.json')}`);

console.log('=== All Data Processing Complete! ===');
