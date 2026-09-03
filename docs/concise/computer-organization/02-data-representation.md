# 第2章 数据的表示和运算 · 考研手写笔记

> [!TIP]
> **本章核心脉络**：本章提炼自手写笔记 P3~P4，涵盖程序装入重定位（绝对/静态/动态）、加减乘除运算器结构与溢出硬件判决、四大标志位 (ZF/OF/SF/CF) 逻辑、IEEE 754 浮点数标准与经典真题算例、特殊浮点数以及浮点数加减运算全流程。

---

## 💾 程序装入与重定位机制

### ❓ 绝对装入、静态重定位与动态重定位的区别？

* **绝对装入 (Absolute Loading)**：
  * 编译/汇编时即直接产生绝对物理地址，装入时直接送入对应物理内存；
  * **缺点**：仅适用于单道程序环境，毫无灵活性。
* **静态重定位 (Static Relocation)**：
  * 编译时产生逻辑地址（通常从 0 开始），在**装入内存时一次性完成物理地址修改**；
  * **特点**：**“装进去不能动”**。作业在内存中不可移动，运行中无法再次申请新的内存空间。
* **动态重定位 (Dynamic Relocation)**：
  * 装入内存后依然保持相对逻辑地址；
  * **特点**：**“装进去还能动”**。在 CPU 真正访存执行指令时，硬件借助**重定位寄存器（基址寄存器）** 动态完成地址加法运算转换：
    $$\text{物理地址} = \text{逻辑地址} + \text{基址寄存器内容}$$
  * 支持作业在内存中换入换出、内存碎片紧凑与虚拟存储器。

---

## 🧮 定点数运算器结构与溢出判定

### ❓ 加、减、乘、除运算器结构与溢出硬件判定

<div class="handdrawn-diagram-card">
  <div class="diagram-header">
    <span class="diagram-icon">🎨</span>
    <span class="diagram-title">原稿手绘图解 · 定点数加减法运算器 ALU 硬件通路与四大标志位生成</span>
    <span class="diagram-badge">P23 手记草图</span>
  </div>
  <svg viewBox="0 0 720 230" width="100%" height="230">
    <g transform="translate(15, 15)">
      <!-- 操作数 A -->
      <g transform="translate(50, 20)">
        <rect x="0" y="0" width="80" height="28" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" stroke-width="1.8" rx="4"/>
        <text x="40" y="18" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="12" font-weight="700">操作数 A</text>
        <line x1="80" y1="14" x2="200" y2="45" stroke="#2563eb" stroke-width="2" marker-end="url(#arrow-blue)"/>
      </g>
      <!-- 操作数 B 与 MUX -->
      <g transform="translate(50, 75)">
        <rect x="0" y="0" width="80" height="28" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" stroke-width="1.8" rx="4"/>
        <text x="40" y="18" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="12" font-weight="700">操作数 B</text>
        <line x1="80" y1="14" x2="135" y2="14" stroke="var(--vp-c-text-2)" stroke-width="1.8"/>
      </g>
      <!-- 多路选择器 MUX 与取反门 -->
      <g transform="translate(135, 65)">
        <polygon points="0,0 35,5 35,45 0,50" fill="rgba(245,158,11,0.15)" stroke="#f59e0b" stroke-width="1.8"/>
        <text x="16" y="28" text-anchor="middle" fill="#f59e0b" font-size="10" font-weight="800">MUX</text>
        <text x="16" y="10" text-anchor="middle" fill="var(--vp-c-text-3)" font-size="8">0: B</text>
        <text x="16" y="44" text-anchor="middle" fill="var(--vp-c-text-3)" font-size="8">1: ~B</text>
        <!-- 控制信号 Sub -->
        <line x1="17" y1="-25" x2="17" y2="0" stroke="#ef4444" stroke-width="2" marker-end="url(#arrow-red)"/>
        <text x="17" y="-30" text-anchor="middle" fill="#ef4444" font-size="11" font-weight="700">Sub 控制信号</text>
      </g>
      <line x1="170" y1="90" x2="200" y2="90" stroke="#2563eb" stroke-width="2" marker-end="url(#arrow-blue)"/>
      <!-- Sub 同时连入 Cin -->
      <path d="M 152 40 C 152 140, 180 145, 200 135" fill="none" stroke="#ef4444" stroke-width="1.8" stroke-dasharray="3,3" marker-end="url(#arrow-red)"/>
      <text x="155" y="160" fill="#ef4444" font-size="10">Sub 为 1 时 Cin=1</text>
      <!-- 核心 ALU 加法器 -->
      <g transform="translate(200, 25)">
        <polygon points="0,0 120,25 120,105 0,130 0,80 30,65 0,50" fill="rgba(37,99,235,0.12)" stroke="#2563eb" stroke-width="2.2"/>
        <text x="65" y="72" text-anchor="middle" fill="#2563eb" font-size="16" font-weight="900">ALU</text>
        <text x="25" y="25" fill="var(--vp-c-text-2)" font-size="10">输入 A</text>
        <text x="25" y="115" fill="var(--vp-c-text-2)" font-size="10">输入 B'</text>
        <text x="5" y="145" fill="#ef4444" font-size="10">Cin (低位进位)</text>
      </g>
      <!-- ALU 结果主输出 -->
      <line x1="320" y1="90" x2="430" y2="90" stroke="#10b981" stroke-width="3" marker-end="url(#arrow-green)"/>
      <g transform="translate(435, 75)">
        <rect x="0" y="0" width="100" height="30" fill="rgba(16,185,129,0.18)" stroke="#10b981" stroke-width="2" rx="4"/>
        <text x="50" y="19" text-anchor="middle" fill="#10b981" font-size="12" font-weight="800">运算结果 Res</text>
      </g>
      <!-- 四大标志位生成逻辑卡片 -->
      <g transform="translate(550, 10)">
        <rect x="0" y="0" width="150" height="185" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" stroke-width="1.8" rx="8"/>
        <text x="75" y="20" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="11.5" font-weight="800">四大标志生成硬件</text>
        <line x1="10" y1="28" x2="140" y2="28" stroke="var(--vp-c-divider)"/>
        <!-- ZF -->
        <text x="12" y="48" fill="#2563eb" font-size="11" font-weight="700">ZF (零标志):</text>
        <text x="12" y="64" fill="var(--vp-c-text-2)" font-size="10">多输入或非门(全0为1)</text>
        <!-- SF -->
        <text x="12" y="88" fill="#2563eb" font-size="11" font-weight="700">SF (符号标志):</text>
        <text x="12" y="104" fill="var(--vp-c-text-2)" font-size="10">直接取最高位 Res[n-1]</text>
        <!-- OF -->
        <text x="12" y="128" fill="#ef4444" font-size="11" font-weight="700">OF (有符号溢出):</text>
        <text x="12" y="144" fill="var(--vp-c-text-2)" font-size="10">最高进位 ⊕ 次高进位</text>
        <!-- CF -->
        <text x="12" y="165" fill="#f59e0b" font-size="11" font-weight="700">CF (无符号借进位):</text>
        <text x="12" y="180" fill="var(--vp-c-text-2)" font-size="10">Sub ⊕ Cout (借位取反)</text>
      </g>
      <!-- 连线引导至标志位 -->
      <path d="M 485 75 C 485 50, 520 50, 545 50" fill="none" stroke="#2563eb" stroke-dasharray="2,2"/>
      <path d="M 320 60 C 360 40, 500 40, 545 135" fill="none" stroke="#ef4444" stroke-dasharray="2,2"/>
    </g>
    <defs>
      <marker id="arrow-blue" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#2563eb"/>
      </marker>
      <marker id="arrow-red" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444"/>
      </marker>
      <marker id="arrow-green" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981"/>
      </marker>
    </defs>
  </svg>
</div>

#### 1. 加减法溢出判断三大方法
* **方法 ①：符号判别法**
  * 只有同号相加才可能溢出：正 + 正 = 负，或 负 + 负 = 正 时发生溢出。
* **方法 ②：最高进位与次高进位异或法**
  $$OF = C_{\text{最高位}} \oplus C_{\text{次高位}}$$
  * 若 $OF = 1$ 表示有符号数发生溢出。
* **方法 ③：无符号数溢出（借位/进位）**
  $$CF = \text{sub} \oplus C_{\text{最高位}}$$
  * 减法产生借位或加法产生进位时 $CF = 1$。

#### 2. 乘法运算器溢出判断
* 乘法结果采用**双字长寄存器**（高位存乘积高半部，低位存乘积低半部）；
* **溢出判别准则**：看乘积是否超出了单字长寄存器的表示范围：
  * **有符号数乘法**：看高 $n+1$ 位是否为符号位的完全重复（全符号扩展）。若不全一样，说明溢出！
  * **无符号数乘法**：看高 $n$ 位是否全为 0。若非全 0，说明溢出！
::: tip 💡 核心考点
* 当乘法运算发生单字长截断溢出时，**硬件中 OF 和 CF 都会置为 1**。
:::

#### 3. 除法运算器溢出判断
* **最大负数异常**：在有符号补码除法中，$\frac{\text{最小负数（绝对值最大的负数）}}{-1}$ 结果超出正数能表示的最大值（如 8 位补码 $-128 \div (-1) = +128$，超出 $[-128, +127]$）；
* **位数超限**：$2n\text{ bit} / n\text{ bit}$ 商超出了 $n$ 位商寄存器的容纳空间。

---

### ❓ 四大标志位 (ZF / OF / SF / CF) 硬件生成逻辑

| 标志位 | 全称 | 硬件判别生成逻辑 | 核心考查应用 |
| :--- | :--- | :--- | :--- |
| **ZF** | 零标志 (Zero Flag) | 将运算结果的所有位输入一个**多输入“或非门”**，当且仅当**结果全为 0** 时，$ZF = 1$ | 用于 `je` / `jne` 等条件跳转 |
| **OF** | 溢出标志 (Overflow Flag) | $$OF = C_{\text{最高位进位}} \oplus C_{\text{次高位进位}}$$ | **仅对有符号数运算有意义**，指示是否超界 |
| **SF** | 符号标志 (Sign Flag) | 直接取结果的最高位符号位：$$SF = \text{Res}_{\text{sign}}$$ | 指示结果的正负（$SF=1$ 为负，$SF=0$ 为正） |
| **CF** | 进位/借位标志 (Carry Flag) | $$CF = \text{sub} \oplus C_{\text{最高进位}}$$（加法最高位进位取反，减法最高位借位取反） | **仅对无符号数运算有意义**，指示最高位进位/借位 |

---

## 🎯 IEEE 754 浮点数标准与大题计算

### ❓ 32 位与 64 位浮点数格式构成

```
32 位单精度 (float):
 0   1         8 9                               31
+---+-----------+---------------------------------+
| S |  E (8位)  |            M (23位)             |
+---+-----------+---------------------------------+
  数符   阶码(移码)            尾数小数部分

64 位双精度 (double):
 0   1         11 12                             63
+---+-----------+---------------------------------+
| S |  E (11位) |            M (52位)             |
+---+-----------+---------------------------------+
```

* **阶码偏置值 (Bias)**：
  * 32 位单精度：**偏置值 $= 127$**（$2^{8-1} - 1$）；
  * 64 位双精度：**偏置值 $= 1023$**（$2^{11-1} - 1$）。
* **真值计算公式**：
  $$X = (-1)^S \times (1.M) \times 2^{E - \text{Bias}}$$
::: tip 💡 核心切记
规格化数尾数前**隐含了一个不可见的“1”**（即真值尾数为 $1.M$），计算时千万别遗漏！
:::

---

### ❓ 408 经典真题大题：IEEE 754 十六进制转十进制

> **题目**：某 32 位浮点数的十六进制机器码为 `BE90 0000H`，求其所对应的十进制真值。
> 
> **解题标准推导步骤**：
> 1. **展开为 32 位二进制串**：
>    $$B = 1011_2, \quad E = 1110_2, \quad 9 = 1001_2, \quad 00000H = 0000 \dots 0_2$$
>    $$\mathbf{1} \quad \mathbf{0111\ 1101} \quad \mathbf{001\ 0000\ 0000\ 0000\ 0000\ 0000}$$
> 2. **提取三大分量**：
>    * 数符 $S = 1 \implies$ 为**负数**；
>    * 阶码 $E = 0111\ 1101_2 = 125$；
>      $$\text{真值阶数 } e = E - 127 = 125 - 127 = \mathbf{-2}$$
>    * 尾数小数部分 $M = 001_2$，补上隐藏的“1”得规格化尾数：
>      $$1.M = 1.001_2 = 1 + 2^{-3} = 1 + 0.125 = \mathbf{1.125}$$
> 3. **计算最终十进制真值**：
>    $$X = (-1)^1 \times 1.125 \times 2^{-2} = -(2^{-2} + 2^{-5}) = -(0.25 + 0.03125) = \mathbf{-0.28125}$$

---

### ❓ IEEE 754 特殊格式与非规格化数

| 特殊值 | 符号位 $S$ | 阶码 $E$ | 尾数小数部分 $M$ | 真值解读 |
| :--- | :---: | :---: | :---: | :--- |
| **$+0$** | 0 | 全 0 (`0x00`) | 全 0 | 正零 |
| **$-0$** | 1 | 全 0 (`0x00`) | 全 0 | 负零 |
| **$+\infty$** | 0 | 全 1 (`0xFF`) | 全 0 | 正无穷大 |
| **$-\infty$** | 1 | 全 1 (`0xFF`) | 全 0 | 负无穷大 |
| **NaN (Not a Number)** | 0 或 1 | 全 1 (`0xFF`) | **非全 0** | 非法未定义操作（如 $0/0, \sqrt{-1}$） |
| **非规格化数** | 0 或 1 | 全 0 (`0x00`) | **非全 0** | 隐藏位为 **0**，真值 $= (-1)^S \times (0.M) \times 2^{-126}$，用于平滑下溢 |

---

### ❓ 浮点数加减运算全流程五步法

1. **对阶（小阶向大阶看齐）**：
   * 求阶差 $\Delta E = E_1 - E_2$；
   * 将小阶数的阶码增大至大阶数，同时其**尾数算术右移 $\Delta E$ 位**；
2. **尾数加减**：
   * 将对齐后的尾数按定点补码完成加/减运算；
3. **规格化**：
   * **左规**：尾数高位出现连续 0（如 $00.00\dots$），尾数左移，阶码逐次减 1；
   * **右规**：尾数运算溢出（如 $01.\dots$ 或 $10.\dots$ 双符号位不同），尾数右移 1 位，**阶码加 1**；
4. **舍入处理**：
   * 对右规或对阶移出的末尾低位进行舍入（如“0舍1入”法、“恒置1”法）；
5. **溢出判断**：
   * **正下溢 / 负下溢**：阶码下溢（小于最小值），通常作机器零处理；
   * **正上溢 / 负上溢**：阶码上溢（超出最大值），报告中断异常。


