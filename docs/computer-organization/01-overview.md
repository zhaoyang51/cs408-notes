# 第1章 计算机系统概述与性能指标

<span class="badge badge-freq">📊 考频 ★★★☆☆</span>
<span class="badge badge-formula">💡 性能公式速查</span>


---

## 1. 冯·诺依曼计算机核心特征


1. 硬件由 **运算器、控制器、存储器、输入设备、输出设备** 五大部件组成。
2. **指令和数据以同等地位** 存放在存储器中，形式上无差别，按地址寻访。
3. 指令和数据均采用 **二进制** 表示。
4. 指令由 **操作码** 和 **地址码** 组成。
5. 传统冯·诺依曼架构以 **运算器为中心**（现代计算机以 **存储器/Cache 为中心**）。


---

## 2. 核心性能指标必背公式


$$
\text{CPU 执行时间} = \frac{\text{程序指令数} \times \text{CPI}}{\text{主频 } f} = \text{总时钟周期数} \times \text{时钟周期 } T_c
$$


$$
\text{MIPS (每秒百万条指令)} = \frac{\text{指令条数}}{\text{执行时间} \times 10^6} = \frac{\text{主频 } f}{\text{CPI} \times 10^6}
$$


$$
\text{CPI (Cycles Per Instruction)} = \frac{\text{总时钟周期数}}{\text{总指令条数}} = \sum (\text{CPI}_i \times \text{占比}_i)
$$


::: tip ⚠️ 408 陷阱
- **吞吐率 vs 响应时间**：主频提高一定加快响应时间，但不一定会线性提升系统吞吐率（受限于 I/O 与访存瓶颈）。
- **$K, M, G$ 单位换算**：
  - 描述存储容量、地址空间（二进制）：$1\text{K} = 2^{10} = 1024, 1\text{M} = 2^{20}, 1\text{G} = 2^{30}$；
  - 描述时钟频率、传输速率（十进制）：$1\text{kHz} = 10^3\text{Hz}, 1\text{MHz} = 10^6\text{Hz}, 1\text{Gbps} = 10^9\text{bps}$。
:::

