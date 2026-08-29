# 第2章 物理层与通信基础

<span class="badge badge-trap">🎯 纯选择题得分高地</span>
<span class="badge badge-freq">📊 考频 17 次（奈氏香农 7 / 编码调制 5 / 差错控制与复用 5）</span>

---

## 1. 极限数据传输速率推导（必背公式）

::: info 💡 极限数据率双公式速查

$$
\text{奈氏准则 (无噪声极限)} = 2W \log_2(V) \quad (\text{b/s})
$$

$$
\text{香农公式 (有噪声极限)} = W \log_2(1 + S/N) \quad (\text{b/s})
$$

$$
\text{信噪比分贝数转换} : \text{dB} = 10 \log_{10}(S/N) \iff S/N = 10^{\text{dB}/10}
$$

:::

::: tip ⚠️ 408 综合题答题策略
若题目同时给出信道带宽 $W$、电平数 $V$ 以及信噪比 $\text{dB}$，**必须分别计算奈氏准则与香农公式，取两者的最小值作为最终的极限数据传输速率**。
:::

---

## 2. 编码与调制全景（基带编码 vs 载波调制 vs 混合调制） <AuthorTag author="Zhao" />

<KP author="Zhao" title="📡 编码与调制全景拓扑与波形实验室（408 核心考点）" tag="⭐️ 考研必背">

<EncodingModulation />

</KP>

---

## 3. 信道复用技术全景（TDM vs FDM vs 码分多址 CDMA） <AuthorTag author="Zhao" />

<KP author="Zhao" title="📡 信道复用技术交互式教学实验室（时分复用 vs 频分复用）" tag="⭐️ 考研必背">

<MultiplexingSimulator />

### 🔠 码分多址 (CDMA) 核心机制与计算速查

#### 1. 核心编码规则
- 每个站分配一个唯一的 **$m$ 位码片序列 (Chip Sequence)** $\mathbf{S}$（通常取 8 位或 64 位），将比特 $0$ 写为 $-1$，比特 $1$ 写为 $+1$；
- **发送比特 1**：发送自身的码片序列 $\mathbf{S}$；
- **发送比特 0**：发送自身码片序列的反码 $-\mathbf{S}$；
- **不发送数据（静默）**：发送全 $0$ 向量 $(0, 0, \dots, 0)$。

#### 2. 核心数学性质（408 计算两大定理）
1. **规格化自相关性（自身内积）**：
   $$\mathbf{S} \cdot \mathbf{S} = \frac{1}{m} \sum_{i=1}^m S_i \cdot S_i = 1, \qquad \mathbf{S} \cdot (-\mathbf{S}) = -1$$

2. **相互正交性（不同站之间的规格化内积必为 0）**：
   $$\mathbf{S} \cdot \mathbf{T} = \frac{1}{m} \sum_{i=1}^m S_i \cdot T_i = 0 \quad (\mathbf{S} \neq \mathbf{T})$$

#### 3. 信道叠加与接收端解码判决
全网所有站点发送的信号在共享物理信道中**线性叠加**为总信号向量 $\mathbf{P} = \sum \mathbf{X}_{\text{send}}$。  
接收端若想提取站点 $\mathbf{A}$ 的数据，只需计算总信号 $\mathbf{P}$ 与 $\mathbf{A}$ 的码片序列的**规格化内积**：

$$\mathbf{P} \cdot \mathbf{A} = (\mathbf{A}_{\text{send}} + \mathbf{B}_{\text{send}} + \mathbf{C}_{\text{send}}) \cdot \mathbf{A} = \mathbf{A}_{\text{send}} \cdot \mathbf{A} + 0 + 0 = \mathbf{A}_{\text{send}} \cdot \mathbf{A}$$

::: tip 🎯 408 接收端判决准则
- 若 $\mathbf{P} \cdot \mathbf{A} = +1 \implies$ 判定站点 $\mathbf{A}$ 发送了 **比特 1**；
- 若 $\mathbf{P} \cdot \mathbf{A} = -1 \implies$ 判定站点 $\mathbf{A}$ 发送了 **比特 0**；
- 若 $\mathbf{P} \cdot \mathbf{A} = 0 \implies$ 判定站点 $\mathbf{A}$ **未发送数据（静默）**。
:::

</KP>

---

## 4. 差错检验与纠错技术全景（奇偶校验 vs CRC vs 海明码） <AuthorTag author="Zhao" />

<KP author="Zhao" title="🛡️ 三大差错控制机制实验室（奇偶校验 / 模2除法CRC / 海明码精确定位与修复）" tag="⭐️ 考研必背">

<ErrorCheckSimulator />

### 📊 三大差错控制机制核心特点与计算全解

#### 1. 奇偶校验码 (Parity Check)
- **核心特点**：码距 $d = 2$。仅能检测出**奇数个比特错误**；当发生偶数个比特差错时发生漏检（漏检率 50%）。**无任何纠错与定位能力**。
- **计算步骤**：
  1. 统计数据中 $1$ 的个数 $n$；
  2. **偶校验**：使包括校验位在内的总 $1$ 的个数为偶数（若 $n$ 为奇数填 $1$，若 $n$ 为偶数填 $0$）；
  3. **奇校验**：使包括校验位在内的总 $1$ 的个数为奇数（若 $n$ 为偶数填 $1$，若 $n$ 为奇数填 $0$）。

---

#### 2. 循环冗余校验码 (CRC - Cyclic Redundancy Check)
- **核心特点**：检错能力极强（100% 检出单比特错、双比特错、奇数个错以及所有长度 $\le r$ 的突发错）。由硬件生成，速度极快。**仅用于检错丢弃，本身无纠错能力**（需上层配合 ARQ 协议实现可靠传输）。
- **计算 5 步法**：
  1. **求阶数 $r$**：由生成多项式 $G(X)$ 得到其二进制序列，阶数 $r = \text{多项式比特长度} - 1$；
  2. **数据补零**：待发数据 $D$ 后追加 $r$ 个 $0$，得到被除数 $D \cdot 2^r$；
  3. **模 2 除法 (XOR)**：用 $D \cdot 2^r$ 对生成多项式 $G$ 做模 2 除法（异或运算，同为 0 异为 1，不借位）；
  4. **生成发送帧**：将所得余数 FCS（严格保留 $r$ 位，高位不足补 0）拼接在数据后面，发送帧 $= D + \text{FCS}$；
  5. **接收端校验**：接收端用相同多项式 $G$ 对收到的帧做模 2 除法：**余数为 0 接收，余数非 0 丢弃**。

---

#### 3. 海明校验码 (Hamming Code)
- **核心特点**：具备**检 2 错、纠 1 错**能力（码距 $d=3$）。能通过伴随式直接指出出错比特的具体物理位置。
- **计算 4 步法**：
  1. **确定校验位位数 $r$**：根据海明不等式：
     $$2^r \ge k + r + 1 \quad (k \text{ 为数据位数})$$
     > 例：$k=4$ 位数据时，$2^3 = 8 \ge 4 + 3 + 1 = 8 \implies r = 3$，总码字长度 $n = 7$。
  2. **确定校验位安放位置**：
     - 校验位 $P_i$ 严格安放在二进制权值 $2^{i-1}$ 的位置（即第 $1, 2, 4, 8, 16 \dots$ 位）；
     - 其余空位按序填入数据位 $D_1, D_2, D_3 \dots$。
  3. **确定校验组覆盖并计算校验位**（偶校验）：
     将所有数据位的位置编号写为二进制和：
     - 位置 $3 = 1 + 2 \implies D_1$ 由 $P_1, P_2$ 负责；
     - 位置 $5 = 1 + 4 \implies D_2$ 由 $P_1, P_4$ 负责；
     - 位置 $6 = 2 + 4 \implies D_3$ 由 $P_2, P_4$ 负责；
     - 位置 $7 = 1 + 2 + 4 \implies D_4$ 由 $P_1, P_2, P_4$ 负责。
     
     $$P_1 = D_1 \oplus D_2 \oplus D_4, \quad P_2 = D_1 \oplus D_3 \oplus D_4, \quad P_4 = D_2 \oplus D_3 \oplus D_4$$

  4. **接收端伴随式纠错定位**：
     接收端计算伴随式方程组 $S_3 S_2 S_1$：
     $$S_1 = P_1 \oplus D_1 \oplus D_2 \oplus D_4, \quad S_2 = P_2 \oplus D_1 \oplus D_3 \oplus D_4, \quad S_3 = P_4 \oplus D_2 \oplus D_3 \oplus D_4$$
     - 若 $S_3 S_2 S_1 = 000_2 \implies$ **无差错**；
     - 若 $S_3 S_2 S_1 \neq 000_2 \implies$ **其十进制值直接对应出错位的编号**（如 $S=101_2=5 \implies$ 第 5 位出错，直接取反即修复成功！）。

</KP>
