# 第3章 存储器层次结构 (Cache / 主存)

<span class="badge badge-star">⭐️ 软硬结合大题核心 (15分)</span>
<span class="badge badge-freq">📊 考频 58 次（虚存 19 / Cache 映射 16 / Cache 原理 10）</span>

---

## 1. 主存与 Cache 3 大映射方式对比

| 映射方式 | 主存地址划分结构 | 命中冲突率 | 硬件复杂度 |
|:---|:---|:---:|:---:|
| **直接映射** | `[ 主存标记 Tag | Cache 行号 | 块内地址 Offset ]` | 高 | 最低 |
| **全相联映射**| `[ 主存标记 Tag | 块内地址 Offset ]` | 最低 | 最高（需并发比较器） |
| **组相联映射**| `[ 主存标记 Tag | 组号 Set | 块内地址 Offset ]` | 折中 | 中等（408 核心重点） |

::: info 💡 Cache 总容量与位数计算公式

$$
\text{Cache 总位数} = \text{Cache 行数} \times (\text{数据块位数} + \text{Tag 位数} + \text{有效位 1} + \text{脏位 1(写回法)} + \text{替换位 } \log_2 k)
$$

:::

---

## 2. 虚拟存储器与两级页表地址转换

- **虚地址到物理地址转换流程**：
  

$$
\text{虚拟地址 (VA)} = [\text{虚页号 VPN} \mid \text{页内偏移量 PO}]
$$

  

$$
\text{物理地址 (PA)} = [\text{物理页框号 PPN} \mid \text{页内偏移量 PO}]
$$

- **多级存储访存流水判定**：
  

$$
\text{TLB (快表) 命中} \rightarrow \text{页表 (慢表) 命中} \rightarrow \text{缺页异常 (访外存硬盘调页)}
$$

