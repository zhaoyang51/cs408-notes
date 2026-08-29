# 第2章 物理层与通信基础

<span class="badge badge-trap">🎯 纯选择题得分高地</span>
<span class="badge badge-freq">📊 考频 17 次（奈氏香农 7 / 编码调制 5 / 差错控制 5）</span>

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

## 3. 信道复用技术全景仿真（TDM vs FDM vs CDM） <AuthorTag author="Zhao" />

<KP author="Zhao" title="📡 信道复用技术交互式教学实验室（时分复用 vs 频分复用 vs 码分复用 CDMA）" tag="⭐️ 考研必背">

<MultiplexingSimulator />

</KP>

---

## 4. 差错检验与纠错技术全景仿真（奇偶校验 vs CRC vs 海明码） <AuthorTag author="Zhao" />

<KP author="Zhao" title="🛡️ 三大差错控制机制实验室（奇偶校验 / 模2除法CRC / 海明码精确定位与修复）" tag="⭐️ 考研必背">

<ErrorCheckSimulator />

</KP>
