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

## 4. 差错检验与纠错技术全景仿真（奇偶校验 vs CRC vs 海明码） <AuthorTag author="Zhao" />

<KP author="Zhao" title="🛡️ 三大差错控制机制实验室（奇偶校验 / 模2除法CRC / 海明码精确定位与修复）" tag="⭐️ 考研必背">

<ErrorCheckSimulator />

</KP>
