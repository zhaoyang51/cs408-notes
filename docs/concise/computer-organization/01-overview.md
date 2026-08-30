# 第1章 计算机系统概述与性能指标 · 简洁速查

<span class="badge badge-freq">📊 考频 11 次（性能指标 7 / 体系结构 ISA 4）</span>

---

## 1. 核心字长概念辨析

| 字长概念 | 物理定义 | 决定因素与影响 |
|:---|:---|:---|
| **机器字长 (Word Size)** | CPU 内部 ALU 和通用寄存器一次能够直接处理的二进制整数位数 | 标志 CPU 的运算精度与性能代际（32位 / 64位） |
| **指令字长 (Instruction Length)** | 一条指令所包含的二进制代码总位数 | 必须是字节（8 bit）的整数倍；通常取机器字长整数倍 |
| **存储字长 (MDR 宽度)** | 主存中一个存储单元所能存储的二进制位数 | 决定主存一次读写操作的数据量（通常为 8/16/32/64 bit） |

---

## 2. 计算机性能指标核心计算公式（408 必背）

::: info 💡 性能指标与时间计算大一统公式
1. **时钟周期与主频**：
   $$T_{\text{clock}} = \frac{1}{f} \quad (\text{时钟周期与主频 } f \text{ 互为倒数})$$

2. **CPI (Cycles Per Instruction)**：
   $$\text{CPI} = \frac{\text{执行程序所需的总时钟周期数}}{\text{程序包含的总指令数 } I_C} = \sum (\text{CPI}_i \times \text{比例}_i)$$

3. **CPU 执行时间 (CPU Time)**：
   $$T_{\text{CPU}} = I_C \times \text{CPI} \times T_{\text{clock}} = \frac{I_C \times \text{CPI}}{f}$$

4. **MIPS (Million Instructions Per Second)**：
   $$\text{MIPS} = \frac{I_C}{T_{\text{CPU}} \times 10^6} = \frac{f}{\text{CPI} \times 10^6}$$

5. **MFLOPS / GFLOPS / TFLOPS**：
   $$\text{MFLOPS} = \frac{\text{程序中的浮点操作次数}}{T_{\text{CPU}} \times 10^6} \quad (\text{衡量科学计算浮点性能的核心标准})$$
:::
