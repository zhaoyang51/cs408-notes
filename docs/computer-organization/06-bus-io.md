# 第6章 总线与输入输出系统

## 1. I/O 控制方式对比表（408 核心重点）

| 方式 | CPU 参与程度 | 数据传送通路 | 适用场景 |
|:---|:---|:---|:---|
| **程序查询** | 全程忙等查询状态字 | 内存 $\leftrightarrow$ CPU $\leftrightarrow$ 设备 | 低速设备 |
| **程序中断** | 设备就绪后发中断响应 | 内存 $\leftrightarrow$ CPU $\leftrightarrow$ 设备 | 中低速、实时响应 |
| **DMA 方式** | 仅在预置和结束时介入 | **内存 $\leftrightarrow$ 设备** (直接传送) | 高速块设备 (磁盘/网卡) |
| **通道方式** | 硬件通道自主执行通道程序 | 内存 $\leftrightarrow$ 设备 | 大型机大型系统 |

---

## 2. 中断处理流程

1. 关中断 $\rightarrow$ 2. 保存断点 (PC/PSW) $\rightarrow$ 3. 引出中断服务程序 $\rightarrow$ 4. 开中断 $\rightarrow$ 5. 执行服务程序 $\rightarrow$ 6. 关中断 $\rightarrow$ 7. 恢复现场 $\rightarrow$ 8. 开中断返回。
