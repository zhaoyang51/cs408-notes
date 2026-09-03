# 第3章 数据链路层与 MAC · 考研手写笔记

> [!TIP]
> **本章核心脉络**：本章提炼自手写笔记 P7~P10，覆盖链路层 4 大组帧方法、CRC 校验与海明码全流程纠错推导、以太网 MAC 帧与 VLAN 802.1Q 标签、滑动窗口 (GBN vs SR)、CDMA 码分复用内积算例、CSMA/CD 争用期与最小帧长、CSMA/CA 无线避碰、802.11 帧地址解析以及交换机自学习算法。

---

## 📦 组帧与差错控制机制

### ❓ 数据链路层组帧有哪几种方法？

1. **字节填充法 (Byte Stuffing / Character Stuffing)**：
   * 采用特定转义字节（如 `ESC`）对数据字段中出现的控制字符（如 `SOH`, `EOT`, `FLAG`）进行转义填充。
2. **零比特填充法 (Bit Stuffing，5“1”投“0”)**：
   * 标志序列为 `01111110`。发送端在数据中**只要连续出现 5 个“1”，就必须强行插入一个“0”**；接收端检测到 5 个“1”后若紧跟“0”则自动删除该“0”，实现比特透明传输。
3. **字符计数法 (Character Count)**：
   * 帧头部第一个字段指明本帧总字符数。**缺点**：若计数字段本身出错，后续整批帧同步将彻底崩溃。
4. **违规编码法 (Physical Layer Coding Violations)**：
   * 利用物理层编码的非法电平状态来界定帧首尾（如曼彻斯特编码中的“高-高”或“低-低”违规电平）。

---

### ❓ 奇偶校验、循环冗余校验 (CRC) 与海明码 (Hamming)

#### 1. 奇偶校验
* **原理**：附加 1 位校验位，使得整个码字中“1”的个数保持为奇数（奇校验）或偶数（偶校验）。仅能检测奇数位错误，无纠错能力。

#### 2. 循环冗余校验 (CRC)
1. **加 0 扩充**：若生成多项式阶数为 $r$（共 $r+1$ 位），则在原始数据后添加 $r$ 个 0；
2. **模 2 除法**：用扩充后的数据按位异或除以生成多项式二进制串；
3. **余数即 FCS**：计算出的 $r$ 位余数即为帧检验序列 FCS，替换刚才追加的 $r$ 个 0 发送；
4. **接收端验证**：接收端接收整帧后除以多项式，余数为 0 则无错。

#### 3. 海明码全流程推导与出错纠正（必考大题）

* **步骤 1：确定校验位数 $k$**
  设信息位有 $n$ 位，校验位有 $k$ 位，必须满足不等式：
  $$2^k \ge n + k + 1$$
* **步骤 2：确定校验位分布位置**
  校验位 $P_i$ 严格安插在 $2^{i-1}$ 的位置上（即第 $1, 2, 4, 8, \dots$ 位），其余位置按序填入信息位 $D$。
  例如 $4$ 位信息位 $D_4 D_3 D_2 D_1$，需 $3$ 位校验位 $P_3 P_2 P_1$（共 7 位码字 $H_7 \sim H_1$）：
  $$H_7(D_4), H_6(D_3), H_5(D_2), H_4(P_3), H_3(D_1), H_2(P_2), H_1(P_1)$$
* **步骤 3：确定校验位方程**
  每个位置的二进制展开式决定了参与的校验位：
  * $H_7 = 4 + 2 + 1 \implies P_3, P_2, P_1$
  * $H_6 = 4 + 2 \implies P_3, P_2$
  * $H_5 = 4 + 1 \implies P_3, P_1$
  * $H_3 = 2 + 1 \implies P_2, P_1$
  由此得异或关系：
  $$P_1 = H_3 \oplus H_5 \oplus H_7 = D_1 \oplus D_2 \oplus D_4$$
  $$P_2 = H_3 \oplus H_6 \oplus H_7 = D_1 \oplus D_3 \oplus D_4$$
  $$P_3 = H_5 \oplus H_6 \oplus H_7 = D_2 \oplus D_3 \oplus D_4$$
* **步骤 4：接收端校验与故障定位**
  计算校正子：
  $$S_1 = H_1 \oplus H_3 \oplus H_5 \oplus H_7$$
  $$S_2 = H_2 \oplus H_3 \oplus H_6 \oplus H_7$$
  $$S_3 = H_4 \oplus H_5 \oplus H_6 \oplus H_7$$
  若 $S_3 S_2 S_1 = 000$，说明无差错；**若 $S_3 S_2 S_1 \neq 000$，其二进制数值直接指明出错位的下标**（例如 $S_3 S_2 S_1 = 110_2 = 6$，直接说明第 6 位 $H_6$ 出错，取反即可纠正）！

---

## 🖼️ 以太网 MAC 帧与 VLAN 802.1Q

### ❓ 以太网 MAC 帧格式详解

```
+---------------+---------------+---------------+--------------------+---------------+
| 目的 MAC 地址 |  源 MAC 地址  |   类型 (Type) |     数据载荷 (Data) |   FCS 检验码  |
|    (6 字节)   |   (6 字节)    |   (2 字节)    |   (46 ~ 1500 字节) |   (4 字节)    |
+---------------+---------------+---------------+--------------------+---------------+
|<----------------------------- 64 ~ 1518 字节 ------------------------------------>|
```

* **最小帧长 64 字节**：首部尾部共 $6+6+2+4 = 18\text{ B}$，故数据部分最少需 $64 - 18 = 46\text{ B}$（不足 46B 必须填充补齐）。
* **最大帧长 1518 字节**：有效载荷最大 MTU 为 $1500\text{ B}$。
* **VLAN 扩展标签 (802.1Q)**：在源 MAC 与类型字段之间插入 **4 字节的 VLAN Tag**，此时最大帧长由 $1518\text{ B} \to \mathbf{1522\text{ B}}$。
::: tip 💡 核心考点
* **VLAN 的本质功效**：**隔离广播域**，同时抑制广播风暴并提升安全性。
:::

---

## 🪟 滑动窗口协议 (GBN vs SR) 对比

### ❓ 后退 N 帧 (GBN) 与 选择重传 (SR) 核心对比

| 协议 | 发送窗口 $W_T$ 与 接收窗口 $W_R$ | 确认方式 | 接收方策略 | 出错重传代价 |
| :--- | :--- | :--- | :--- | :--- |
| **GBN** | $W_T > 1, W_R = 1$<br>约束：$W_T + W_R \le 2^n$ 即 $W_T \le 2^n - 1$ | **累积确认 (ACK)**，收到 ACK $k$ 表示 $k$ 及之前所有帧已成功接收 | 只按序接收帧。若某帧丢失或出错，后续到达的所有无序帧**一律丢弃** | 超时则将未确认的**后续所有帧全部重传** |
| **SR** | $W_T > 1, W_R > 1$<br>约束：$W_T + W_R \le 2^n$，通常取 $W_T = W_R = 2^{n-1}$ | **逐帧确认 (ACK)**，可发送否定应答 NAK | 接收方设置接收缓存，失序正确帧先**缓存**，等缺失帧到达后再滑动交付 | 发送方仅**重传超时的单个错误帧** |

#### 💡 信道利用率 $U$ 计算公式：
$$U = \frac{n \times T_{\text{发送}}}{T_{\text{发送}} + \text{RTT} + T_{\text{确认}}}$$

---

## 📡 介质访问控制与冲突避免

### ❓ CDMA 码分复用计算大题解法

* **内积判决准则**：设某站码片序列为 $\mathbf{S}$，网络混合信号向量为 $\mathbf{X}$：
  * 若 $\mathbf{S} \cdot \mathbf{X} = +1 \implies$ 发送了比特 **1**；
  * 若 $\mathbf{S} \cdot \mathbf{X} = -1 \implies$ 发送了比特 **0**；
  * 若 $\mathbf{S} \cdot \mathbf{X} = 0 \implies$ 该站**未发送数据**。

---

### ❓ CSMA / CD 协议（载波监听多点接入/碰撞检测）

* **工作四部曲**：**先听后发、边发边听、冲突停发、随机重发**。
* **争用期（碰撞窗口 $2\tau$）**：
  $$\text{争用期 } 2\tau = \frac{\text{两倍单程传播时延}}{\text{传播速度}} = \frac{\text{最小帧长}}{\text{信道带宽}}$$
  * 传统 $10\text{ Mbps}$ 以太网争用期为 $51.2\ \mu\text{s}$，对应最小帧长为 $\mathbf{64\text{ B}}$。
* **截断二进制指数退避算法**：
  1. 基本退避时间为 $2\tau = 51.2\ \mu\text{s}$；
  2. 参数 $k = \min[\text{重传次数}, 10]$；
  3. 从整数集合 $[0, 1, \dots, 2^k - 1]$ 中随机抽取整数 $r$；
  4. 重传等待时间为 $r \times 2\tau$；
  5. 若重传达 **16 次** 仍未成功，说明信道过载，直接报错放弃重传。

---

### ❓ CSMA / CA 协议（无线局域网 802.11 碰撞避免）

* **无线通信为何不用 CSMA/CD？**：无线网卡由于信号衰减巨大且存在强反射，**硬件上无法实现一边发射信号一边接收检测碰撞**，且存在“隐蔽站”与“暴露站”问题。
* **避碰四大机制**：
  1. **预约信道**：发送数据前先发送 **RTS (Request to Send)** 控制帧，接收端应答 **CTS (Clear to Send)** 广播；
  2. **确认应答 (ACK)**：数据链路层采用明确的 ACK 确认机制；
  3. **帧间间隔 (IFS)**：SIFS（最短，用于ACK/CTS）、PIFS、DIFS（最长，用于异步数据帧竞争）；
  4. **NAV (网络分配向量)**：指明信道将被占用的持续时间，其他站点依据接收到的 NAV 倒计时，推迟信道接入。

<div class="handdrawn-diagram-card">
  <div class="diagram-header">
    <span class="diagram-icon">🎨</span>
    <span class="diagram-title">原稿手绘图解 · CSMA/CA 预约信道 RTS/CTS 与 NAV 网络分配向量时序图</span>
    <span class="diagram-badge">P52 手记草图</span>
  </div>
  <svg viewBox="0 0 720 220" width="100%" height="220">
    <g transform="translate(15, 12)">
      <!-- 发送站 A 时间轴 -->
      <g transform="translate(0, 15)">
        <text x="75" y="16" text-anchor="end" fill="var(--vp-c-text-1)" font-size="11.5" font-weight="800">发送站 A</text>
        <line x1="85" y1="12" x2="520" y2="12" stroke="var(--vp-c-divider)" stroke-width="1.8"/>
        <!-- DIFS 等待 -->
        <rect x="85" y="0" width="35" height="24" fill="var(--vp-c-bg-soft)" stroke="var(--vp-c-divider)" rx="2"/>
        <text x="102" y="16" text-anchor="middle" fill="var(--vp-c-text-3)" font-size="9">DIFS</text>
        <!-- RTS 发送 -->
        <rect x="125" y="0" width="45" height="24" fill="rgba(37,99,235,0.18)" stroke="#2563eb" rx="3"/>
        <text x="147" y="16" text-anchor="middle" fill="#2563eb" font-size="10" font-weight="800">RTS</text>
        <!-- DATA 数据帧发送 -->
        <rect x="250" y="-4" width="160" height="32" fill="rgba(16,185,129,0.2)" stroke="#10b981" stroke-width="2" rx="4"/>
        <text x="330" y="17" text-anchor="middle" fill="#10b981" font-size="12" font-weight="800">DATA 数据帧传输</text>
      </g>
      <!-- 接收站 B (AP) 时间轴 -->
      <g transform="translate(0, 65)">
        <text x="75" y="16" text-anchor="end" fill="var(--vp-c-text-1)" font-size="11.5" font-weight="800">接收站 B</text>
        <line x1="85" y1="12" x2="520" y2="12" stroke="var(--vp-c-divider)" stroke-width="1.8"/>
        <!-- SIFS 间隔 -->
        <rect x="175" y="0" width="22" height="24" fill="var(--vp-c-bg-soft)" stroke="var(--vp-c-divider)" rx="2"/>
        <text x="186" y="16" text-anchor="middle" fill="var(--vp-c-text-3)" font-size="8">SIFS</text>
        <!-- CTS 广播 -->
        <rect x="200" y="0" width="45" height="24" fill="rgba(245,158,11,0.2)" stroke="#f59e0b" rx="3"/>
        <text x="222" y="16" text-anchor="middle" fill="#f59e0b" font-size="10" font-weight="800">CTS</text>
        <!-- SIFS -->
        <rect x="415" y="0" width="22" height="24" fill="var(--vp-c-bg-soft)" stroke="var(--vp-c-divider)" rx="2"/>
        <text x="426" y="16" text-anchor="middle" fill="var(--vp-c-text-3)" font-size="8">SIFS</text>
        <!-- ACK 确认 -->
        <rect x="440" y="0" width="45" height="24" fill="rgba(37,99,235,0.18)" stroke="#2563eb" rx="3"/>
        <text x="462" y="16" text-anchor="middle" fill="#2563eb" font-size="10" font-weight="800">ACK</text>
      </g>
      <!-- 其他隐蔽站 C (NAV 虚拟载波监听静默) -->
      <g transform="translate(0, 120)">
        <text x="75" y="16" text-anchor="end" fill="#ef4444" font-size="11.5" font-weight="800">隐蔽站 C</text>
        <line x1="85" y1="12" x2="520" y2="12" stroke="var(--vp-c-divider)" stroke-width="1.8"/>
        <!-- NAV 静默条 (收到 CTS 后从 200 持续到 ACK 结束) -->
        <rect x="200" y="0" width="290" height="24" fill="rgba(239,68,68,0.15)" stroke="#ef4444" stroke-width="1.8" stroke-dasharray="3,3" rx="4"/>
        <text x="345" y="16" text-anchor="middle" fill="#ef4444" font-size="11" font-weight="700">NAV 网络分配向量 (信道预约静默，严禁发送！)</text>
      </g>
      <!-- 右侧：考点辨析卡 -->
      <g transform="translate(540, 10)">
        <rect x="0" y="0" width="150" height="175" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" stroke-width="1.8" rx="8"/>
        <text x="75" y="22" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="11.5" font-weight="800">CSMA/CA 核心机制</text>
        <line x1="8" y1="30" x2="142" y2="30" stroke="var(--vp-c-divider)"/>
        <text x="10" y="50" fill="#2563eb" font-size="10.5" font-weight="700">帧间隙 IFS 优先级：</text>
        <text x="10" y="67" fill="var(--vp-c-text-2)" font-size="10">SIFS &lt; PIFS &lt; DIFS</text>
        <text x="10" y="82" fill="var(--vp-c-text-3)" font-size="9.5">(间隙越短，优先级越高)</text>
        <line x1="8" y1="92" x2="142" y2="92" stroke="var(--vp-c-divider)"/>
        <text x="10" y="112" fill="#ef4444" font-size="10.5" font-weight="700">解决隐蔽站利器：</text>
        <text x="10" y="130" fill="var(--vp-c-text-2)" font-size="10">CTS 广播携带持续期，</text>
        <text x="10" y="145" fill="var(--vp-c-text-2)" font-size="10">使隐蔽站自动设置 NAV</text>
        <text x="10" y="160" fill="var(--vp-c-text-2)" font-size="10">实现无碰撞完美避让！</text>
      </g>
    </g>
  </svg>
</div>

---

### ❓ 802.11 MAC 帧地址字段含义（必考记忆技巧）

<div class="handdrawn-diagram-card">
  <div class="diagram-header">
    <span class="diagram-icon">🎨</span>
    <span class="diagram-title">原稿手绘图解 · 802.11 无线局域网 MAC 帧四地址全场景数据流向模型</span>
    <span class="diagram-badge">P53 手记草图</span>
  </div>
  <svg viewBox="0 0 720 200" width="100%" height="200">
    <g transform="translate(15, 12)">
      <!-- 拓扑节点：源主机 A -> AP -> 目的主机 B -->
      <!-- 主机 A -->
      <g transform="translate(30, 45)">
        <rect x="0" y="0" width="85" height="42" fill="rgba(37,99,235,0.15)" stroke="#2563eb" stroke-width="2" rx="6"/>
        <text x="42" y="21" text-anchor="middle" fill="#2563eb" font-size="12" font-weight="800">源主机 A</text>
        <text x="42" y="34" text-anchor="middle" fill="var(--vp-c-text-3)" font-size="9.5">(STA A)</text>
      </g>
      <!-- 无线链路段 1: A -> AP -->
      <g transform="translate(115, 45)">
        <line x1="10" y1="21" x2="95" y2="21" stroke="#2563eb" stroke-width="2.5" marker-end="url(#arrow-blue)"/>
        <text x="52" y="14" text-anchor="middle" fill="#2563eb" font-size="10" font-weight="700">阶段 ① 入网 (To DS=1)</text>
      </g>
      <!-- 无线接入点 AP -->
      <g transform="translate(225, 35)">
        <rect x="0" y="0" width="110" height="62" fill="rgba(16,185,129,0.15)" stroke="#10b981" stroke-width="2" rx="6"/>
        <text x="55" y="26" text-anchor="middle" fill="#10b981" font-size="12" font-weight="800">无线接入点 AP</text>
        <text x="55" y="44" text-anchor="middle" fill="var(--vp-c-text-2)" font-size="10">(基站 / 路由器)</text>
      </g>
      <!-- 无线链路段 2: AP -> B -->
      <g transform="translate(335, 45)">
        <line x1="10" y1="21" x2="95" y2="21" stroke="#10b981" stroke-width="2.5" marker-end="url(#arrow-green)"/>
        <text x="52" y="14" text-anchor="middle" fill="#10b981" font-size="10" font-weight="700">阶段 ② 出网 (From DS=1)</text>
      </g>
      <!-- 目的主机 B -->
      <g transform="translate(445, 45)">
        <rect x="0" y="0" width="85" height="42" fill="rgba(37,99,235,0.15)" stroke="#2563eb" stroke-width="2" rx="6"/>
        <text x="42" y="21" text-anchor="middle" fill="#2563eb" font-size="12" font-weight="800">目的主机 B</text>
        <text x="42" y="34" text-anchor="middle" fill="var(--vp-c-text-3)" font-size="9.5">(STA B)</text>
      </g>
      <!-- 下方地址解析映射条 -->
      <g transform="translate(30, 115)">
        <!-- 阶段 1 地址拆解 -->
        <rect x="0" y="0" width="240" height="55" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" rx="4"/>
        <text x="12" y="18" fill="#2563eb" font-size="10.5" font-weight="700">① A ➔ AP 帧地址分配：</text>
        <text x="12" y="34" fill="var(--vp-c-text-2)" font-size="10">地址 1 (RA 接收端): </text>
        <text x="125" y="34" fill="#10b981" font-size="10" font-weight="700">AP MAC</text>
        <text x="12" y="48" fill="var(--vp-c-text-2)" font-size="10">地址 2 (TA 发送端): </text>
        <text x="125" y="48" fill="#2563eb" font-size="10" font-weight="700">A MAC</text>
        <text x="160" y="48" fill="#ef4444" font-size="10" font-weight="700">| 地址3: B</text>
        <!-- 阶段 2 地址拆解 -->
        <rect x="260" y="0" width="240" height="55" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" rx="4"/>
        <text x="272" y="18" fill="#10b981" font-size="10.5" font-weight="700">② AP ➔ B 帧地址分配：</text>
        <text x="272" y="34" fill="var(--vp-c-text-2)" font-size="10">地址 1 (RA 接收端): </text>
        <text x="385" y="34" fill="#2563eb" font-size="10" font-weight="700">B MAC</text>
        <text x="272" y="48" fill="var(--vp-c-text-2)" font-size="10">地址 2 (TA 发送端): </text>
        <text x="385" y="48" fill="#10b981" font-size="10" font-weight="700">AP MAC</text>
        <text x="420" y="48" fill="#ef4444" font-size="10" font-weight="700">| 地址3: A</text>
      </g>
      <!-- 右侧：考点秒杀卡 -->
      <g transform="translate(545, 10)">
        <rect x="0" y="0" width="145" height="165" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" stroke-width="1.8" rx="8"/>
        <text x="72" y="22" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="11.5" font-weight="800">408 黄金法则</text>
        <line x1="8" y1="30" x2="137" y2="30" stroke="var(--vp-c-divider)"/>
        <text x="8" y="52" fill="#10b981" font-size="10.5" font-weight="700">地址 1：永远接收！</text>
        <text x="8" y="70" fill="var(--vp-c-text-2)" font-size="10">直接接收本跳的 MAC</text>
        <text x="8" y="94" fill="#2563eb" font-size="10.5" font-weight="700">地址 2：永远发送！</text>
        <text x="8" y="112" fill="var(--vp-c-text-2)" font-size="10">直接发送本跳的 MAC</text>
        <text x="8" y="136" fill="#ef4444" font-size="10.5" font-weight="700">地址 3：过滤后留存</text>
        <text x="8" y="152" fill="var(--vp-c-text-2)" font-size="10">远端源或目的节点！</text>
      </g>
    </g>
  </svg>
</div>

::: tip 💡 408 核心口诀
**地址 1 永远是接收地址，地址 2 永远是发送地址，地址 3 存远端源或目的地！**
:::

| 场景 | 去往 AP (To AP) | 来自 AP (From AP) | 地址 1 (接收端) | 地址 2 (发送端) | 地址 3 (远端节点) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **A 发给 AP (入网)** | **1** | **0** | **AP MAC** | **A MAC** | **B MAC**（最终目的） |
| **AP 发给 B (出网)** | **0** | **1** | **B MAC** | **AP MAC** | **A MAC**（初始源地址） |

---

## 🔄 局域网互联设备与交换机自学习

### ❓ 网桥 (Bridge) 与 交换机 (Switch)

* **本质**：交换机实质上就是**多端口网桥**。
* **冲突域 vs 广播域**：
  * ✅ **隔离冲突域**：每个交换机端口独立拥有专用独享带宽，支持全双工通信；
  * ❌ **不隔离广播域**：广播帧仍会被扩散泛洪到所有非接收端口。
* **自学习算法 (CAM 转发表建立)**：
  1. 收到数据帧时，**根据帧的“源 MAC 地址”和“接收端口号”** 更新转发表条目并刷新存活时间；
  2. 查询目的 MAC 地址：若表中已存在且对应端口不是入端口，则**精准单播转发**；若表中查无此目的 MAC，则向除入端口外的所有端口**广播泛洪 (Flooding)**。

---

### ❓ 点对点 PPP 协议特征总结

1. **面向连接、不可靠**：仅提供点到点全双工通信，没有确认与滑动窗口重传机制；
2. **只检错、不纠错**：帧尾使用 CRC 校验，出错直接丢弃；
3. **支持多协议环境**：链路两端可封装不同的网络层协议（如 IP、IPX）。

