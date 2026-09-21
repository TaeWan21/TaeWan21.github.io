---
layout: post
title: "[Paper Review] Learning to Share: Selective Memory for Efficient Parallel Agentic Systems (ICML, 2026)"
date: 2026-09-10 14:00:00 +0900
description: "병렬로 도는 agent team들이 중간 결과를 global memory bank로 공유하되, 무엇을 공유할지는 RL로 학습된 lightweight controller가 정하는 LTS"
categories: [paper-review, Multi-agent System]
tags: [multi-agent, llm-agent, shared-memory, reinforcement-learning, parallelism]
giscus_comments: false
thumbnail: assets/img/posts/learning-to-share/fig2_architecture.png
toc:
  beginning: true
---

## 1. Problem Formulation

이 논문은 **여러 agent team을 병렬로 실행하는 agentic system에서, team 사이의 중복 계산을 줄여 wall-clock runtime을 낮추면서 task 성능은 유지하거나 높이는 것**을 목표로 한다. M1-Parallel처럼 같은 task를 여러 team이 독립적으로 풀고 마지막에 답을 합치는 구조는 다양한 reasoning trajectory를 탐색해 최종 답의 신뢰도를 높인다. 그러나 각 team이 같은 web page를 검색하고, 같은 table을 parsing하고, 비슷한 code를 다시 쓰는 일이 반복되고, 한 team의 실패는 그 team 안에서만 retry로 처리되어 전체 latency를 늘린다. 반대로 모든 중간 결과를 무조건 공유하면 실패한 tool call이나 미완성 code까지 다른 team의 context에 섞여 들어가 정확도가 떨어진다. 저자들은 team들이 읽고 쓰는 global memory bank를 두고, **어떤 중간 step을 memory에 넣을지를 stepwise RL로 학습한 lightweight controller가 결정하는** Learning to Share(LTS)를 제안한다.

- **입력**: task $$x$$. system은 $$K$$개의 team을 instantiate하고, team $$k$$의 orchestrator $$O_k$$는 step $$t$$마다 자기 trajectory history $$h^k_{1:t-1}$$를 보고 다음 action이나 delegation을 낸다. 각 step은 agent 입력 $$u_t$$, agent 출력 $$o_t$$, 그리고 그 step의 요약 $$s_t$$로 표현된다.
- **출력**: team별 후보 답 $$y^k$$와, 고정된 aggregation model $$A$$가 $$\{y^k\}_{k=1}^K$$와 $$x$$로부터 만드는 최종 답 $$\hat{y}$$. 부수적으로 task 시작부터 aggregation까지의 wall-clock runtime이 측정된다.
- **최종 목표**: memory가 없는 병렬 baseline과 같은 agent, tool, aggregation을 쓰면서, controller $$\mathcal{C}_\theta$$의 admission 정책만으로 runtime을 줄이고 benchmark 점수를 유지하거나 높인다.

## 2. Limitations of Existing Works

**[Independent Trajectories]** M1-Parallel은 여러 Magentic-One team을 동시에 실행하고 최종 답만 LLM aggregator로 합친다. 설계상 team의 trajectory는 서로 완전히 독립이라, 한 team이 web page에서 뽑아낸 사실이나 작성한 code는 그 team 안에서만 쓰이고 버려진다. Figure 1(a)처럼 세 team이 같은 site를 검색하고 같은 table을 parsing하는 일이 반복되고, 한 team의 parsing error나 code 실패는 그 team의 retry로 이어져 가장 느린 team이 전체 pipeline을 붙잡는다. 병렬화가 최종 답의 신뢰도는 높이지만 실행 중의 중복 reasoning은 전혀 막지 못한다.

**[Naive Sharing]** 모든 중간 step을 공유하면 중복은 사라지지만 다른 문제가 생긴다. agent의 action 중 상당수는 실패한 tool call, 부분적인 code 시도, 특정 reasoning 경로에만 의미 있는 관측이다. 이런 항목이 memory에 쌓이면 orchestrator의 context가 길어지고 잘못된 정보가 다른 team으로 전파된다. 실험(Table 2)에서 모든 step을 넣는 변형은 runtime은 줄이지만 GAIA 정확도가 47.9에서 44.2로 떨어진다. 무엇을 공유할지 고르는 기준이 필요한데, 각 step이 다른 team에 유용한지에 대한 ground truth label은 존재하지 않는다.

**[Persistent Memory Focus]** 기존 agent memory 연구는 episode를 넘어 지속되는 long-term memory, personalization, 누적 학습을 다룬다. Reflexion류의 task-level memory도 같은 문제를 여러 번 시도하면서 쌓는 구조이다. 하나의 task를 푸는 도중에 병렬 team 사이에서만 쓰이고 task가 끝나면 사라지는 ephemeral shared memory는 다뤄지지 않았다. 병렬 실행의 중복을 줄이는 데 memory가 어떤 역할을 하는지 따로 떼어 본 연구가 없었다는 뜻이다.

## 3. Methodology

{% include figure.liquid loading="eager" path="assets/img/posts/learning-to-share/fig1_redundancy.png" class="img-fluid rounded z-depth-1" zoomable=true %}

[Figure 1] 같은 long-horizon task를 세 team이 푸는 과정이다. (a) shared memory가 없으면 web search, table parsing, code 작성이 team마다 반복되고, Team 2의 parsing error와 Team 3의 code 실패가 retry를 낳아 182초가 걸린다. (b) shared memory bank가 있으면 Team 1이 parsing한 table과 Team 2가 쓴 code를 다른 team이 가져다 쓰고, Team 3은 parsing error 직후 memory의 table로 바로 넘어가 124초에 끝난다.

{% include figure.liquid path="assets/img/posts/learning-to-share/fig2_architecture.png" class="img-fluid rounded z-depth-1" zoomable=true %}

[Figure 2] (a) 병렬 team들은 독립적으로 실행되면서 중앙의 shared memory bank를 읽는다. 각 agent step의 출력은 memory controller를 거쳐 YES이면 (step summary, agent output) key-value 쌍으로 저장되고 NO이면 버려진다. team은 key 목록을 보고 필요한 value를 가져온다. (b) controller는 task query, 기존 memory key들, 현재 step(agent 입력, 출력, 요약)을 frozen embedding model로 embedding하고 학습 가능한 projection으로 공통 token 공간에 사상한 뒤, lightweight LLM이 binary token 하나를 낸다.

LTS는 기존 병렬 agentic framework 위에 두 요소를 얹는다. 전체 pipeline은 다음과 같다.

- ① $$K$$개의 Magentic-One team이 병렬로 task를 푼다. orchestrator, worker agent, tool, aggregation은 M1-Parallel과 동일하다.
- ② 각 agent step이 끝날 때마다 stateless LLM이 15~20 단어의 요약 $$s_t$$를 만들고, memory controller $$\mathcal{C}_\theta$$가 $$(s_t, o_t)$$를 memory bank $$\mathcal{M}$$에 넣을지 결정한다.
- ③ 모든 orchestrator는 $$\mathcal{M}$$의 key(요약)만 본다. 유용해 보이는 key가 있으면 그 value(원본 출력)를 자기 context로 가져온다.
- ④ 모든 team이 끝나면 M1-Parallel의 LLM-based aggregation으로 최종 답을 만든다.

### 3.1. Global Shared Memory Bank

memory bank는 텍스트 key-value 쌍의 집합이다.

$$
\mathcal{M} = \{(s_i, o_i)\}_{i=1}^{\lvert \mathcal{M} \rvert}
$$

- $$s_i$$: 그 step이 무엇을 했고 결과가 무엇인지를 적은 짧은 자연어 요약. retrieval key 역할을 한다.
- $$o_i$$: 해당 step의 raw agent output. parsing된 table, 작성된 code, 검색 결과 본문 등이다.

핵심 설계는 orchestrator가 value를 직접 읽지 않는다는 점이다. orchestrator에 노출되는 것은 key 집합 $$\{s_i\}$$뿐이고, 어떤 key가 지금 필요하다고 판단하면 그때 value를 context에 주입한다. memory에 항목이 늘어도 orchestrator의 context는 요약 길이만큼만 커지고, 실제로 쓰이는 원본만 들어온다. team 간 동기화나 trajectory 병합도 없다. 각 team은 자기 속도로 진행하며 memory를 읽을 뿐이다. 이 memory는 task 하나에 대해 만들어졌다가 task가 끝나면 사라진다. 결과적으로 memory bank는 **병렬 team 사이의 비동기적인 정보 교환 창구**이며, context 증가는 key 노출과 선택적 value 주입으로 억제된다.

### 3.2. Memory Controller: 무엇을 넣을 것인가

memory admission은 step마다 내리는 binary 결정이다. controller $$\mathcal{C}_\theta$$는 Qwen3-0.6B에 LoRA(r=16)를 붙인 lightweight causal transformer이며, 병렬 team 옆에서 돌면서 step마다 YES 또는 NO token 하나를 낸다.

어떤 step이 공유할 가치가 있는지는 그 step만 보고는 알 수 없다. task가 무엇인지, 이미 memory에 비슷한 항목이 있는지, 현재 step의 입력과 출력과 요약이 서로 어떤 관계인지에 달려 있다. 그래서 controller의 입력 context $$c_t$$는 세 출처에서 온다. 모든 텍스트는 frozen embedding model $$\phi$$(LoRA 없는 Qwen3-0.6B)로 embedding된다.

- task query: $$e^{\text{qry}} = \phi(q)$$
- 기존 memory key 전체: $$E^{\text{mem}} = [\phi(s_1); \cdots; \phi(s_{\lvert \mathcal{M} \rvert})]$$
- 현재 step triplet: $$E^{\text{step}}_t = [\phi(u_t); \phi(s_t); \phi(o_t)]$$

세 embedding은 각각 학습 가능한 linear projection $$W_q, W_m, W_s$$를 거쳐 controller의 입력 token 공간으로 사상되고, 이어 붙여 context가 된다.

$$
c_t = \left[z^{\text{qry}};\; z^{\text{mem}};\; z^{\text{step}}_t\right], \qquad z^{\text{qry}} = W_q\!\left(e^{\text{qry}}\right)
$$

controller는 마지막 위치에서 YES/NO로 제한된 logit을 내고, 여기서 결정을 sampling한다.

$$
\ell_t = \mathcal{C}_\theta(c_t), \qquad z_t \sim \mathrm{Categorical}(\mathrm{softmax}(\ell_t)), \qquad z_t = \text{YES} \;\Rightarrow\; \mathcal{M} \leftarrow \mathcal{M} \cup \{(s_t, o_t)\}
$$

raw text 대신 고정 길이 embedding token을 입력으로 쓰기 때문에 memory key가 수십 개로 늘어도 controller 입력은 짧게 유지된다. 추론 때는 sampling을 끄고 argmax를 쓴다. admit된 요약의 embedding은 controller 내부 cache에 추가되어 다음 결정의 $$E^{\text{mem}}$$가 되고, memory bank 자체는 텍스트만 저장한다. 저자들이 측정한 controller 추론 시간은 전체 wall-clock의 약 0.2%이다. 즉 controller는 **step마다 token 하나를 내는 작은 model이지만, 결정에 필요한 전역 context(query, 기존 memory, 현재 step)를 모두 embedding으로 받는다.**

### 3.3. Controller 학습: Sparse Reward에서 Step 단위 Credit 만들기

admission 결정 하나의 가치는 그 결정이 다른 team의 실행에 미친 영향으로만 드러난다. 즉 supervision은 episode가 끝난 뒤의 task 점수뿐이고, 어느 admission이 그 점수에 기여했는지는 알 수 없다. 저자들은 이 temporal credit assignment 문제를 stepwise policy gradient에 세 가지 요소를 더해 푼다. policy $$\pi_\theta(z_t \mid c_t)$$는 3.2절의 controller이고, 학습 중 agent들은 모두 frozen이며 gradient는 projection layer와 LoRA에만 흐른다.

**Episode-level reward.** trajectory $$\tau$$는 한 입력에 대한 병렬 실행 전체(모든 agent step, admission 결정, 최종 aggregation)이다. reward는 aggregation된 답의 benchmark 점수 $$R_{\text{agg}}$$에, 가장 먼저 끝난 team의 답 점수 $$R_{\text{first}}$$를 더한 것이다.

$$
R(\tau) = R_{\text{agg}}(\tau) + \lambda_{\text{first}}\, R_{\text{first}}(\tau)
$$

$$R_{\text{first}}$$ 항은 정확도만이 아니라 빠른 수렴도 보상한다. memory 공유로 어느 team이 일찍 정답에 도달하면 이 항이 커진다.

**Group-relative advantage.** 절대 reward는 task 난이도에 크게 좌우되므로, 같은 입력 $$x$$에 대해 현재 policy로 $$G$$개의 독립 실행 $$\{\tau^{(i)}\}$$을 sampling하고 group 안에서 정규화한다.

$$
A^{(i)}_{\text{base}} = \frac{R(\tau^{(i)}) - \mu_R}{\sigma_R + \epsilon}
$$

같은 task 안에서 상대적으로 더 나은 결과를 낸 admission 패턴이 강화되고, 쉬운 task와 어려운 task의 reward 크기 차이는 상쇄된다.

**Usage-aware shaping.** episode가 성공했다고 그 안의 모든 admission이 유용했던 것은 아니다. 그래서 trajectory마다 실제로 어느 orchestrator가 key를 선택해 value를 가져간 항목의 집합 $$U^{(i)}$$를 기록하고, 그 항목을 admit한 step에만 bonus를 준다.

$$
\hat{A}^{(i)}_t = A^{(i)}_{\text{base}} + \beta \cdot \mathbb{1}\!\left[t \in U^{(i)} \;\wedge\; R(\tau^{(i)}) > 0\right]
$$

조건이 둘이다. 그 memory가 실제로 사용되었고, 그 episode가 0이 아닌 reward를 받았을 때만 추가 credit이 간다. 사용되지 않은 admission이나 실패한 episode 안의 admission은 base advantage만 받는다. 이 항이 없으면 controller는 episode 성공에 묻어가는 step까지 admit하게 된다.

**Policy loss와 sparsity.** step별 loss는 shaped advantage로 가중된 log-likelihood이고, 여기에 YES 확률 자체를 벌하는 sparsity 항을 더한다.

$$
\mathcal{L}^{\text{policy}}_t(\theta) = -\log \pi_\theta(z_t \mid c_t)\cdot \hat{A}^{(i)}_t, \qquad
\mathcal{L}^{\text{sparse}}_t(\theta) = \pi_\theta(z_t = \text{YES} \mid c_t)
$$

$$
\mathcal{L}(\theta) = \mathbb{E}_{\tau \sim \pi_\theta}\left[\sum_{t=1}^{T} \mathcal{L}^{\text{policy}}_t(\theta) + \lambda_{\text{sparse}}\, \mathcal{L}^{\text{sparse}}_t(\theta)\right]
$$

sparsity 항이 없으면 "일단 다 넣는" 정책이 policy loss만으로는 벌을 받지 않는다. admit이 많을수록 어딘가는 쓰일 확률이 올라가고 usage bonus도 늘기 때문이다. $$\lambda_{\text{sparse}}$$는 유용성과 선택성 사이의 교환 비율이다. 따라서 학습 목표는 **"성공한 episode에서 실제로 쓰인 memory를 만든 admission은 강화하고, 나머지 admission은 비용으로 취급한다"**로 요약된다.

### 3.4. 추론 흐름과 요약 생성

추론 시 system은 표준 병렬 실행에 memory만 얹는다. 각 agent step이 끝나면 같은 backbone의 stateless LLM이 그 step의 목적과 결과를 15~20 단어로 요약한다. 2000자 정도의 agent 출력 하나당 약 750 token이 든다. controller가 admit하면 요약이 key로 모든 orchestrator에 노출되고, orchestrator가 선택할 때만 value가 context에 들어간다. 요약 생성 비용은 있지만 4장의 runtime은 이 비용을 포함한 값이고, 중복 실행이 줄어드는 폭이 그보다 크다. 최종 답은 M1-Parallel의 aggregation prompt를 그대로 써서 만든다. 즉 baseline과의 차이는 **memory bank의 존재와 controller의 admission 정책뿐**이며, 그 밖의 모든 구성은 고정된다.

## 4. Experiments

### 4.1. Setup

benchmark는 GAIA validation 165개(level 1/2/3 = 53/86/26)와 AssistantBench test 181개(easy/medium/hard, 부분 점수 지원)이다. controller는 **AssistantBench development split 33개 task로만 학습**하고 GAIA 데이터는 전혀 쓰지 않는다. task당 epoch마다 5개의 trajectory를 sampling하고 temperature 1.2로 탐색하며, AdamW로 식 (10)을 최소화한다. 평가는 team 수 $$K=3$$, team당 최대 30 step, H100 한 장이며, agent backbone은 GPT-5.1(gpt-5.1-2025-11-13) 또는 Qwen3-32B이다. baseline은 단일 team Magentic-One($$K=1$$)과 memory 없는 M1-Parallel($$K=3$$)이고, aggregation은 세 방법 모두 동일하다.

### 4.2. Main Results

| Model | Method | Shared Memory | AB Easy | AB Med. | AB Hard | AB All | AB Runtime | GAIA L1 | GAIA L2 | GAIA L3 | GAIA All | GAIA Runtime |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Qwen3-32B | Magentic-One | ✗ | 53.1 | 17.4 | 8.5 | 13.4 | 1084s | 41.5 | 16.3 | 3.8 | 22.5 | 758s |
| Qwen3-32B | M1-Parallel | ✗ | 52.6 | 21.4 | 8.5 | 14.7 | 2239s | 43.4 | 18.6 | 7.7 | 24.8 | 1569s |
| Qwen3-32B | **LTS** | ✓ | **65.8** | **25.2** | **14.4** | **20.3** | **1479s** (↓40.8%) | **47.2** | **25.6** | **11.8** | **30.4** | **892s** (↓55.0%) |
| GPT-5.1 | Magentic-One | ✗ | 43.6 | 31.5 | 15.3 | 21.7 | 724s | 48.1 | 37.3 | 16.7 | 37.5 | 815s |
| GPT-5.1 | M1-Parallel | ✗ | 57.3 | **35.2** | 16.0 | 24.0 | 1389s | 60.4 | 46.5 | **26.9** | 47.9 | 1005s |
| GPT-5.1 | **LTS** | ✓ | **61.0** | 35.1 | **20.0** | **26.7** | **882s** (↓44.6%) | **62.3** | **47.7** | **26.9** | **49.1** | **781s** (↓25.1%) |

[Table 1] AssistantBench(AB) test set과 GAIA validation set 결과이다. runtime은 task당 평균 wall-clock이고, 감소율은 M1-Parallel 대비이다. Qwen3-32B에서 LTS는 M1-Parallel 대비 GAIA 정확도를 24.8에서 30.4로 올리면서 runtime을 1569초에서 892초로 줄인다. GPT-5.1에서는 GAIA 47.9 vs 49.1, runtime 1005초 vs 781초이다. AssistantBench에서도 Qwen3-32B 기준 14.7에서 20.3으로, GPT-5.1 기준 24.0에서 26.7로 오르며 runtime은 각각 40.8%, 44.6% 줄어든다. 저자들은 gain이 가장 어려운 subset(AB Hard, GAIA level 2와 3)에서 가장 크다는 점을 들어, 필요한 step이 많고 해법 경로가 여러 개인 long-horizon task일수록 공유의 효과가 크다고 해석한다. 단일 team Magentic-One과 비교하면 LTS는 정확도가 크게 높으면서도 runtime이 Qwen3-32B GAIA에서 892초 vs 758초로 병렬 실행치고는 근접한다.

{% include figure.liquid path="assets/img/posts/learning-to-share/fig3_cdf.png" class="img-fluid rounded z-depth-1" zoomable=true %}

[Figure 3] AssistantBench에서 task 완료 시간의 누적 분포이다. LTS의 곡선이 M1-Parallel보다 전 구간에서 왼쪽에 있어, 특정 task군만 빨라진 것이 아니라 분포 전체가 이동했음을 보인다. 평균 완료 시간은 8.4분 줄었다.

### 4.3. Ablation Study

**Admission 전략.** GPT-5.1에서 memory를 어떻게 채우느냐를 바꾼 결과이다. 모든 step을 넣는 LTS-AddAll은 AssistantBench runtime을 1389초에서 784초로 가장 많이 줄이지만 정확도는 24.0에서 23.0으로, GAIA에서는 47.9에서 44.2로 떨어진다. frozen LLM에 prompt로 admit 여부를 묻는 LTS-LLM은 AB 25.7 / GAIA 45.8로 AddAll보다 낫지만 결정마다 full LLM 호출이 든다. 학습된 controller를 쓴 LTS는 AB 26.7 / GAIA 49.1로 유일하게 memory 없는 baseline을 두 benchmark 모두에서 넘으면서 runtime도 882초 / 792초로 낮다. 2장의 [Naive Sharing]이 실제로 일어나며, 무엇을 넣을지 고르는 것이 runtime 감소를 정확도 이득으로 바꾸는 조건임을 보인다.

**Memory 사용 통계.** AssistantBench(GPT-5.1)에서 AddAll은 step의 100%를 저장하지만 recall(저장된 항목 중 실제로 읽힌 비율)이 25.8%에 그친다. LTS-LLM은 44.4%만 저장하고 recall 18.0%, LTS는 84.9%를 저장하고 recall 22.2%이다. 저장된 항목이 다른 team에 의해 읽힌 비율(cross-team recall)은 AddAll 66.0, LLM 66.6, LTS 69.0으로 LTS가 가장 높다. controller가 자기 team보다 다른 team에 쓸모 있는 항목을 골라 넣는 방향으로 학습되었다는 근거이다.

**RL 목표 구성.** GAIA에서 usage-aware shaping을 빼면 정확도 49.1에서 47.7로, runtime 792초에서 925초로 나빠지고 저장 비율은 84.9%에서 89.5%로 오른다. sparsity loss를 빼면($$\lambda_{\text{sparse}}=0$$) 저장 비율이 98.9%로 사실상 AddAll이 되고 runtime은 983초, 정확도는 47.4이다. 3.3절에서 두 항이 각각 막으려 한 실패 양상(쓰이지 않는 admission, 무조건 admit)이 그대로 나타난다.

**Team 수.** controller를 재학습하지 않고 $$K$$를 바꾼 GAIA 결과이다. $$K=2$$에서 M1-Parallel 23.0 / 1161초 vs LTS 28.5 / 828초, $$K=5$$에서 25.4 / 2034초 vs 31.6 / 1234초, $$K=10$$에서 22.4 / 3411초 vs 29.1 / 2521초이다. 어느 $$K$$에서도 LTS가 정확도와 runtime 모두 앞서며, $$K=10$$에서 두 방법 모두 정확도가 떨어지는 현상은 M1-Parallel 논문의 관찰과 같다.

**요약 길이와 controller 위치.** 요약을 15~20 단어에서 45~50 단어로 늘려도(재학습 없음) GAIA 정확도 30.4 → 29.7, runtime 892초 → 916초로 큰 차이가 없다. admission 결정을 controller 대신 orchestrator 자신에게 맡기면(Qwen3-32B, GAIA) stateless LLM filter의 26.8 / 928초보다 정확도는 27.9로 오르지만 runtime이 1108초로 늘고, LTS의 30.4 / 892초에는 둘 다 못 미친다. orchestrator는 자기 trajectory를 푸는 데 최적화되어 있고 context가 길어 결정마다 비용이 큰 반면, controller는 cross-team utility를 예측하도록 따로 학습되었기 때문이라고 저자들은 본다.

## 5. Conclusion

**Contribution**

- **[Selective Shared Memory]** 병렬 agentic system의 중복 계산 문제를 짚고, task 단위로 생성되는 key-value global memory bank와 학습된 admission controller로 team 사이의 중간 결과 재사용을 가능하게 했다. GAIA에서 M1-Parallel 대비 Qwen3-32B 24.8 → 30.4, GPT-5.1 47.9 → 49.1의 정확도 향상과 함께 runtime을 25~55% 줄였다.
- **[Usage-aware Stepwise RL]** admission에 대한 label이 없는 조건에서, episode reward에 first-team 항을 더하고 group-relative advantage, 실제 사용 여부에 따른 shaping, sparsity 항을 결합해 0.6B controller를 학습하는 방법을 제시했다. ablation에서 shaping과 sparsity가 각각 빠지면 admission이 늘고 runtime과 정확도가 함께 나빠진다.
- **[Generalization and Overhead]** AssistantBench dev 33개 task로만 학습한 controller가 GAIA, 다른 backbone(GPT-5.1, Qwen3-32B), 다른 team 수($$K$$=2~10), 다른 요약 길이에서 재학습 없이 작동하며, controller 추론은 wall-clock의 약 0.2%에 그친다.

**Limitations**

- **[Ephemeral Memory Only]** memory는 task 하나 안에서만 존재하고 task 간에는 이어지지 않는다. 저자들은 personalization이나 누적 지식 획득을 목표로 하지 않는다고 명시하며, 이 선택이 3.1절의 단순한 key-value 설계로 이어졌다.
- **[No Deletion or Revision]** controller는 넣을지 말지만 정하고, 이미 들어간 항목을 지우거나 고치지 않는다. 잘못된 항목이 admit되면 task가 끝날 때까지 남는다. 저자들은 더 풍부한 memory 관리를 future work로 남긴다.
- **[Aggregation Inherited]** 최종 답은 M1-Parallel의 LLM aggregation을 그대로 쓰므로, aggregator의 판별력이라는 상한도 그대로 물려받는다. memory는 team이 답에 도달하는 과정을 바꾸지만 답을 고르는 단계는 건드리지 않는다.
- **[Summary Cost and Training Data]** step마다 요약 생성에 약 750 token이 들고, controller 학습에는 병렬 실행 trajectory를 task당 5개씩 반복 수집해야 한다. 학습 데이터가 33개 task로 작다는 점은 일반화의 근거이면서 동시에 admission 정책이 얼마나 정교할 수 있는지의 한계이기도 하다.

## 6. 병렬 Team은 무엇을 주고받아야 하는가

**M1-Parallel (독립 실행)**

$$
y^k = O_k\!\left(x, h^k_{1:T}\right) \;\text{ for each } k, \qquad \hat{y} = A\!\left(x, \{y^k\}_{k=1}^K\right)
$$

- **"여러 trajectory 중 어느 답을 믿을 것인가?"**를 마지막에 결정한다.
- 하지만 실행 중에는 아무것도 주고받지 않으므로, 같은 검색과 같은 parsing이 team 수만큼 반복된다.

**LTS-AddAll (전부 공유)**

$$
\mathcal{M} \leftarrow \mathcal{M} \cup \{(s_t, o_t)\} \;\text{ for all } t
$$

- **"중복을 어떻게 없앨 것인가?"**에는 가장 직접적으로 답한다(AB runtime 1389초 → 784초).
- 하지만 실패한 시도까지 공유되어 정확도가 떨어지고(GAIA 47.9 → 44.2), 저장 항목의 4분의 3은 읽히지 않는다.

**LTS-LLM / Orchestrator (prompt 기반 filter)**

$$
z_t = \mathrm{LLM}\!\left(\text{"admit?"} \mid u_t, o_t, s_t\right)
$$

- **"이 step이 유용해 보이는가?"**를 그때그때 판단한다.
- 하지만 판단 기준이 cross-team utility로 학습된 것이 아니고, 결정마다 full LLM 호출이나 긴 orchestrator context가 들어 runtime 이득을 깎는다.

**LTS (학습된 admission)**

$$
z_t \sim \pi_\theta\!\left(\cdot \mid \left[z^{\text{qry}}; z^{\text{mem}}; z^{\text{step}}_t\right]\right), \qquad \hat{A}_t = A_{\text{base}} + \beta\,\mathbb{1}[t \in U \wedge R > 0]
$$

- **"이 step을 넣으면 다른 team이 실제로 가져다 쓰고 task가 성공할 것인가?"**를 예측하도록 학습된다.
- 하지만 넣은 뒤의 관리는 하지 않고, 답을 고르는 aggregation은 여전히 baseline과 같다.

따라서 이 논문의 핵심은 단순히 "병렬 team에 shared memory를 붙였다"가 아니다. **key만 노출하고 value는 요청 시 주입하는 memory bank로 context 증가를 막고, 무엇을 넣을지를 실제 사용 여부와 episode 성공에 연동된 stepwise RL로 학습해, 병렬 실행의 중복 제거가 정확도 손실 없이 runtime 이득으로 이어지도록 만든 구조**이다.
