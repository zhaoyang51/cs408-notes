# 第6章 总线与输入输出系统

<span class="badge badge-star">⭐️ 中断与总线大题</span>
<span class="badge badge-freq">📊 考频 54 次（中断方式 24 / 总线 12 / DMA 9 / I/O 接口 9）</span>

---

## 1. 4 大 I/O 控制方式全景对比

| I/O 方式 | CPU 参与程度 | 数据传输通路 | 核心适用场景 |
|:---|:---|:---|:---|
| **程序查询** | 全程忙碌轮询状态字 | 内存 $\leftrightarrow$ CPU $\leftrightarrow$ 设备 | 极低速设备 |
| **程序中断** | 设备就绪后发起中断请求 | 内存 $\leftrightarrow$ CPU $\leftrightarrow$ 设备 | 键盘、鼠标等字符设备 |
| **DMA 方式** | **仅在预置和结束时由 CPU 介入** | **内存 $\leftrightarrow$ 设备 (直接传输)** | 磁盘、网卡等高速块设备 |
| **通道方式** | 硬件通道自主执行通道程序 | 内存 $\leftrightarrow$ 设备 | 大型机大规模 I/O 系统 |

---

## 2. 中断处理流程 8 步曲

$$
1. 关中断 → 2. 保存断点(PC/PSW) \rightarrow 3. 引出中断服务程序 → 4. 开中断(允许嵌套) \rightarrow 5. 执行中断处理 → 6. 关中断 \rightarrow 7. 恢复现场 → 8. 开中断并返回
$$

