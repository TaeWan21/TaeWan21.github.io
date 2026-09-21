---
layout: post
title: "[Paper Review] AgentGrad: Intervention-guided Prompt Optimization for Multi Agent Systems (arXiv, 2026)"
date: 2026-09-21 20:15:00 +0900
description: "실패마다 agent를 하나씩 개입해 고칠 prompt를 찾고, 개입으로 얻은 출력을 agent 수준 pseudo-label로 써서 textual gradient를 뽑은 뒤, 비슷한 gradient끼리 묶어 추상화하는 multi-agent prompt optimizer"
categories: [paper-review, LLM Optimization]
tags: [prompt-optimization, textual-gradient, multi-agent, intervention, credit-assignment]
giscus_comments: false
thumbnail: assets/img/posts/agentgrad/fig1_concept.png
toc:
  beginning: true
---

## 1. Problem Formulation

이 논문은 **여러 LLM agent로 이루어진 multi-agent system(MAS)에서, 제한된 rollout 예산 안에 각 agent의 prompt를 textual gradient로 최적화하는 것**을 목표로 한다. MAS의 성능은 agent마다 주어진 prompt에 좌우되고, 이를 자동으로 고치는 방법 중에서는 자연어 feedback을 gradient처럼 쓰는 textual gradient 계열이 주류가 되었다. 이 계열은 실패에서 feedback을 뽑는 extraction과, 여러 feedback을 모아 prompt를 고치는 aggregation의 두 단계로 돈다. TextGrad는 system 출력의 loss를 모든 component로 역전파해 prompt 전부를 한꺼번에 고치므로 신호가 모든 agent에 닿지만 비용이 크다. GEPA는 고칠 module을 round-robin으로 하나씩 골라 비용을 줄이지만, 그 module을 고치면 해당 실패가 풀리는지는 확인하지 않는다. 두 방법 모두 supervision은 system의 최종 출력과 정답의 비교에서만 나오고, 모은 feedback은 무작위 minibatch로 묶인다. 저자들은 sequential intervention으로 고칠 agent를 검증해서 고르고, semantic textual gradient abstraction으로 같은 유형의 gradient만 묶는 **AgentGrad**를 제안한다.

- **입력**: $$N$$개의 agent $$(\pi^1, \dots, \pi^N)$$로 이루어진 MAS $$\Pi$$, 초기 prompt 집합 $$\mathcal{P} = (p^1, \dots, p^N)$$, reward 함수 $$r: \hat{\mathcal{Y}} \times \mathcal{Y} \to [0, 1]$$, $$\mathcal{D}_{\text{train}}$$과 $$\mathcal{D}_{\text{val}}$$, rollout 예산 $$B$$. $$i$$번째 입력에서 agent $$n$$의 입출력은 $$\hat{y}_i^n = \pi^n(x_i^n; p^n)$$이고, $$x_i^1 = x_i$$, $$\hat{y}_i^N = \hat{y}_i$$이며 $$n \ge 2$$의 $$x_i^n$$은 앞선 agent들의 출력으로 만들어진다.
- **출력**: 최적화된 prompt 집합 $$\mathcal{P}^\ast$$
- **최종 목표**: $$\mathcal{P}^\ast = \arg\max_{\mathcal{P}} \mathbb{E}_{(x,y) \sim \mathcal{D}_{\text{val}}}\, r(\Pi(x; \mathcal{P}), y)$$를 rollout 수 $$\le B$$ 조건에서 찾고, held-out $$\mathcal{D}_{\text{test}}$$에서 평가한다. rollout은 $$\Pi$$를 입력 하나에 실행하고 $$r$$로 채점하는 것까지를 말한다.

## 2. Limitations of Existing Works

**[Uninformed Targeting]** 기존 textual gradient 방법은 어느 prompt를 고칠지 정할 때, 그 prompt를 고쳐서 실패가 해결되는지를 확인하지 않는다. 모든 agent의 prompt를 동시에 고치거나 round-robin으로 순서대로 고른다. 전자는 실패와 무관한 prompt까지 건드리며 비용을 크게 쓰고, 후자는 이번 차례의 agent가 그 실패를 고칠 수 있는지 모른 채 gradient를 뽑는다. credit assignment 문제가 그대로 남고, 원인이 아닌 agent에 대해 만들어진 gradient는 minibatch 점수조차 올리지 못하는 후보 prompt로 이어진다.

**[System-Level Supervision Only]** gradient는 system의 최종 출력 $$\hat{y}$$와 정답 $$y$$를 비교한 loss에서 나온다. 중간 agent가 "무엇을 출력했어야 하는가"에 대한 label은 대부분의 MAS dataset에 없다. 그래서 gradient extractor는 최종 오답에서 거꾸로 추측해 "이 agent의 prompt를 이렇게 고치면 정답이 나올 것"이라는 critique을 쓴다. 최종 출력과 중간 agent 사이에 다른 agent들이 끼어 있을수록 이 추측은 거칠어진다.

**[Random Minibatch Aggregation]** sample마다 뽑은 gradient는 무작위 minibatch로 묶여 그대로 이어 붙여진 채 prompt optimizer LLM에 들어간다. 한 minibatch 안에 계산 실수, 추론 누락, 사실 오류, 문법 오류처럼 서로 무관한 failure mode의 gradient가 섞인다. optimizer는 일관된 수정 방향을 찾지 못하거나 개별 사례에 맞춘 문구를 prompt에 덧붙이게 되고, 그렇게 만든 prompt는 validation set에서 개선으로 이어지지 않는다.

## 3. Methodology

{% include figure.liquid loading="eager" path="assets/img/posts/agentgrad/fig1_concept.png" class="img-fluid rounded z-depth-1" zoomable=true %}

[Figure 1] 기존 textual gradient 방법과 AgentGrad의 비교이다. 왼쪽이 gradient extraction이다. (a) 기존 방법은 최종 prediction과 ground truth만 보고 gradient를 만들며, 네 agent 중 누구를 고쳐야 하는지 모른다. (b) AgentGrad는 agent 하나에 intervention을 걸어 다시 실행하고, 그 결과 정답이 나온 agent(Agent 3)를 target으로 정한 뒤 "Agent 3의 prompt를 고쳐 intervention으로 얻은 출력을 내게 하라"는 gradient를 뽑는다. 오른쪽이 gradient aggregation이다. (c) 기존 방법은 math error, syntax error, wrong fact 같은 gradient를 무작위로 묶어 optimizer에 넘긴다. (d) AgentGrad는 aggregator LLM이 같은 유형끼리 cluster로 묶고 cluster마다 하나의 gradient로 추상화한다.

전체 pipeline은 한 round가 다음 다섯 단계로 구성되고, rollout 예산이 소진될 때까지 반복된다.

- ① **Failure set 구성**: 현재 $$\mathcal{P}$$로 $$\mathcal{D}_{\text{train}}$$을 실행해 실패 집합 $$\mathcal{F}$$를 얻는다.
- ② **Sequential intervention**: 실행 역순으로 agent 하나씩 hint를 주입해 재실행하고, 실패가 해결된 sample들을 그 agent의 몫 $$\mathcal{T}^n$$으로 돌린다.
- ③ **Gradient extraction**: $$\mathcal{T}^n$$의 sample마다 원래 출력과 intervention 후 출력을 대비시켜 sample-level gradient $$\delta_i^n$$을 뽑는다.
- ④ **Semantic abstraction**: agent별 gradient 집합 $$\Omega^n$$을 aggregator LLM이 cluster로 나누고 generalized gradient $$\bar{\delta}_j^n$$로 추상화한다.
- ⑤ **Update와 검증**: $$\bar{\delta}_j^n$$로 후보 prompt를 만들고, semantic minibatch와 $$\mathcal{D}_{\text{val}}$$ 두 단계를 모두 통과하면 채택한다.

### 3.1. Textual Gradient: Extraction과 Aggregation

textual gradient는 수치 gradient의 자연어 대응물이다. TextGrad의 정식화를 따르면 prompt $$p$$에 대한 textual gradient는 다음과 같다.

$$
\frac{\partial \mathcal{L}}{\partial p} = \mathrm{LLM}_{\nabla}\left(p, \hat{y}, \mathcal{L}\right)
$$

- $$\mathcal{L}$$: objective. 미분 불가능한 함수일 수도, 실패를 설명한 자연어일 수도 있다.
- $$\hat{y}$$: prompt $$p$$ 아래에서 생성된 출력
- $$\mathrm{LLM}_{\nabla}$$: $$\mathcal{L}$$을 개선하려면 $$p$$를 어떻게 고쳐야 하는지를 자연어 critique으로 쓰는 gradient extractor

이렇게 sample마다 뽑은 gradient를 별도의 prompt optimizer LLM이 모아서 새 prompt를 만든다. GEPA는 이 신호를 natural-language feedback이라 부르지만 저자들은 같은 추상화로 보고 모두 textual gradient 방법으로 묶는다. AgentGrad는 이 extraction-aggregation 틀을 유지하면서 extraction의 입력과 aggregation의 묶는 방식을 바꾼다.

### 3.2. Sequential Intervention: 고칠 Prompt 찾기

저자들은 target prompt를 "그것 하나만 고쳐도 실패가 해결되는 prompt"로 정의한다. 이 정의를 그대로 실행에 옮긴 것이 sequential intervention이다. intervention은 agent의 prompt 끝에 hint $$\mathcal{H}$$를 덧붙여 그 agent가 올바른 중간 출력을 내도록 유도하는 것이고, 한 번에 agent 하나에만 건다.

{% include figure.liquid path="assets/img/posts/agentgrad/fig2_sequential_intervention.png" class="img-fluid rounded z-depth-1" zoomable=true %}

[Figure 2] agent가 셋인 경우의 target 식별 과정이다. 1) 현재 prompt $$p^1, p^2, p^3$$로 $$\mathcal{D}_{\text{train}}$$을 실행해 실패 집합 $$\mathcal{F}$$를 만든다. 2) Step 1에서 마지막 agent의 $$p^3$$에 intervention을 걸어 $$\mathcal{F}$$를 다시 실행하면, 정답이 된 sample은 $$\mathcal{T}^3$$으로, 여전히 틀린 sample은 $$\mathcal{F}^3$$으로 갈린다. Step 2는 $$\mathcal{F}^3$$에 대해 $$p^2$$에, Step 3은 $$\mathcal{F}^2$$에 대해 $$p^1$$에 개입한다. 3) 그 결과 각 $$\mathcal{T}^n$$은 $$p^n$$을 target으로 갖는다.

실패 집합은 $$\mathcal{F} = \{(x_i, y_i) \mid r(\Pi(x_i; \mathcal{P}), y_i) < r_{\max}\}$$이다. $$\mathcal{F}^{N+1} = \mathcal{F}$$에서 시작해 $$n = N, \dots, 1$$ 순서로, agent $$\pi^n$$에 hint를 주입한 system $$\Pi^{(n, \mathcal{H})}$$를 아직 풀리지 않은 실패에 실행한다.

$$
\mathcal{T}^n = \left\{ (x_i, y_i) \in \mathcal{F}^{n+1} \;\middle|\; r\left(\Pi^{(n, \mathcal{H})}(x_i; \mathcal{P}),\, y_i\right) = r_{\max} \right\}, \qquad \mathcal{F}^{n} = \mathcal{F}^{n+1} \setminus \mathcal{T}^n
$$

- $$\mathcal{T}^n$$: $$\pi^n$$에 개입했을 때 최대 reward에 도달한 실패들. 이 sample들에 대해 $$\pi^n$$이 target agent가 된다.
- $$\mathcal{F}^n$$: step $$n$$까지 거치고도 풀리지 않은 실패들. 다음 agent의 개입 대상이 된다.

**역순으로 도는 이유.** 저자들은 실패가 뒤쪽 agent에 몰리는 경향을 관찰했다고 하며, 마지막 agent부터 개입하면 실패 하나당 필요한 intervention 횟수의 기댓값이 줄어든다. 한 번 해결된 sample은 집합에서 빠지므로 뒤에서 해결된 실패는 앞쪽 agent에 대해 다시 실행되지 않는다.

**Hard case.** $$n = 1$$까지 가도 풀리지 않은 실패는 hint를 줘도 고칠 수 없는 경우로 보고 이번 round에서 제외한다. 영구히 버려지지는 않는다. $$\mathcal{F}$$는 round마다 $$\mathcal{D}_{\text{train}}$$에서 새로 만들어지므로, 이 sample들은 갱신된 prompt 아래에서 다시 시도된다.

**Hint 구성.** $$\mathcal{H}$$는 ground truth $$y_i$$ 또는 최종 출력이 만족해야 하는 제약에, dataset 설명, MAS 설명, 각 agent의 역할 설명 같은 보조 context를 더해 만든다. hint는 학습 때만 쓰이고, 최적화된 prompt는 추론 시 hint 없이 배포된다.

이 절차는 DoVer 같은 intervention 기반 debugging 연구와 같은 도구를 쓴다. 그쪽 연구가 개입을 실패 원인의 검증에 썼다면, AgentGrad는 개입으로 드러난 교정된 행동을 prompt 갱신의 supervision으로 가져간다. 즉 sequential intervention은 **"어느 agent를 고쳐야 하는가"를 LLM의 추측에 맡기지 않고, 고쳐서 다시 돌려 본 결과로 정한다.**

### 3.3. Agent-Level Pseudo-Label로 Gradient 추출

target 식별이 끝나면 $$\mathcal{T}^n$$의 각 sample에는 같은 입력 $$x_i^n$$에 대한 출력이 두 개 생긴다. 실패한 실행에서의 원래 출력과, hint를 받은 뒤의 교정된 출력이다.

$$
\hat{y}_i^n = \pi^n(x_i^n; p^n), \qquad \tilde{y}_i^n = \pi^n(x_i^n; p^n, \mathcal{H})
$$

두 출력은 같은 입력 context에서 나왔으므로, 그 차이는 intervention이 만든 행동 변화만을 담는다. 그리고 $$\tilde{y}_i^n$$은 실제로 system을 정답으로 이끈 것이 확인된 출력이다. 저자들은 $$\tilde{y}_i^n$$을 "$$\pi^n$$이 $$x_i^n$$에서 어떻게 행동했어야 하는가"를 알려 주는 agent-level pseudo-label로 해석하고 gradient extractor에 넣는다.

$$
\delta_i^n = \mathrm{LLM}_{\nabla}\left(p^n,\; x_i^n,\; \hat{y}_i^n,\; \tilde{y}_i^n\right)
$$

$$\delta_i^n$$은 $$\hat{y}_i^n$$ 대신 $$\tilde{y}_i^n$$이 나오려면 $$p^n$$을 어떻게 고쳐야 하는지를 서술한 sample-level textual gradient이다. 3.1의 식과 비교하면 $$\mathcal{L}$$ 자리가 사라졌다. 기존 방법은 system 출력과 정답을 비교한 explicit loss가 필요하지만, 여기서는 두 출력의 대비가 그 역할을 한다. 결과적으로 중간 agent의 label이 없는 dataset에서도 **system 수준의 정답 하나가 intervention을 거쳐 target agent의 입출력 쌍으로 바뀐다.**

### 3.4. Semantic Textual Gradient Abstraction

$$\delta_i^n$$은 실패 하나에서 나온 것이어서 그 사례에만 맞는 교정을 담는다. agent $$\pi^n$$에 귀속된 모든 gradient를 $$\Omega^n = \{\delta_i^n\}_{(x_i, y_i) \in \mathcal{T}^n}$$이라 하면, aggregator LLM이 이를 받아 generalized gradient들을 낸다.

$$
\{\bar{\delta}_j^n\}_{j=1}^{M_n} = \mathrm{LLM}_{\text{Aggregator}}\left(\Omega^n\right)
$$

- $$\bar{\delta}_j^n$$: agent $$\pi^n$$의 $$j$$번째 generalized gradient
- $$M_n$$: cluster 수. aggregator LLM이 정한다.
- $$\mathcal{D}_j^n$$: $$j$$번째 cluster에 속한 gradient들이 나온 training 실패들. semantic minibatch라 부른다.

aggregator는 한 번의 호출 안에서 두 가지를 한다.

**Clustering.** 의미가 비슷한 sample-level gradient를 한 group으로 묶는다. cluster 크기가 추상화 수준을 정한다. 큰 cluster는 많은 실패가 공유하는 일반적인 pattern을, 작은 cluster는 세밀한 교정을 낸다. 이 수준을 조절하기 위해 aggregator에 cluster 크기의 soft lower bound를 주고, 이 값을 iteration마다 $$5 \to 3 \to 1 \to 5 \to \cdots$$로 순환시킨다. lower bound는 권장값이어서, gradient들이 서로 너무 다르면 aggregator는 더 작은 cluster를 만들 수 있다.

**Abstraction.** cluster마다 공유된 교정 pattern을 담은 gradient 하나를 쓴다. prompt optimizer는 서로 다른 sample-level 신호의 혼합 대신 일관된 방향 하나를 받는다.

{% include figure.liquid path="assets/img/posts/agentgrad/fig3_abstraction.png" class="img-fluid rounded z-depth-1" zoomable=true %}

[Figure 3] PUPA에서의 예시이다. target agent는 사용자의 private query를 외부 LLM에 보낼 요청으로 고쳐 쓰는 역할이고, prompt는 "감지된 민감 token을 placeholder로 바꿔라"이다. Sample 1~3의 원래 출력(빨강)은 PTV News, Warsaw, Poland, Mishaali Kapoor 같은 식별자를 그대로 노출하고, intervention 후 출력(초록)은 이를 `<ANON_ORG>`, `<ANON_LOCATION>`, `<ANON_NAME_1>`로 바꾼다. 세 sample-level gradient는 각각 기관명, 도시·국가명, 허구처럼 보이는 인명과 지명을 말하지만, "사람·조직·장소를 식별하는 이름은 민감하게 취급하라"는 신호를 공유하므로 Cluster 1로 묶여 하나의 redaction 정책으로 추상화되고 prompt에 반영된다. Sample N은 agent가 외부 요청 자체를 거부한 경우로 교정 신호가 다르기 때문에 Cluster 2로 간다.

### 3.5. Prompt Update와 두 단계 검증

generalized gradient는 semantic minibatch의 크기 $$\vert \mathcal{D}_j^n \vert$$가 큰 것부터 적용한다. 많은 실패에 걸친 update를 세밀한 update보다 먼저 시도하는 것이다. prompt optimizer LLM이 후보를 만든다.

$$
p_{\text{new}}^n = \mathrm{LLM}_{\text{PromptOptimizer}}\left(p^n,\; \bar{\delta}_j^n\right)
$$

후보는 먼저 자신이 나온 semantic minibatch $$\mathcal{D}_j^n$$에서 평가된다. 여기서 점수가 오른 경우에만 $$\mathcal{D}_{\text{val}}$$에서 평가되고, 거기서도 오르면 $$\mathcal{P}$$의 $$p^n$$을 교체한다. 어느 단계든 통과하지 못하면 후보를 버리고 다음 gradient로 넘어간다. 따라서 앞의 세 절이 만든 gradient의 질은 이 두 관문의 통과율로 측정할 수 있고, 4.3절이 그 통과율을 잰다.

## 4. Experiments

### 4.1. Main Results

| Backbone | Method | HotpotQA | HoVer | PUPA | IFBench | MATH | Improvement |
|---|---|---|---|---|---|---|---|
| GPT-5-mini | Baseline (No PO) | 46.33 | 58.11 | 84.74 | 73.07 | 76.48 | - |
| GPT-5-mini | MIPROv2 | 59.00 | 62.89 | 88.33 | 73.70 | 83.13 | +5.66 |
| GPT-5-mini | TextGrad | 67.89 | 63.22 | 89.72 | 73.07 | 76.48 | +6.33 |
| GPT-5-mini | GEPA | 68.33 | 63.11 | 91.87 | 75.23 | 86.37 | +9.24 |
| GPT-5-mini | AgentGrad | **73.89** | **64.78** | **95.17** | **76.08** | **87.62** | **+11.76** |
| Qwen3-8B | Baseline (No PO) | 41.33 | 36.67 | 80.87 | 40.82 | 83.24 | - |
| Qwen3-8B | MIPROv2 | 58.33 | 45.44 | 85.76 | 40.08 | 84.68 | +6.27 |
| Qwen3-8B | TextGrad | 50.86 | 51.44 | 84.50 | **42.52** | 83.90 | +6.06 |
| Qwen3-8B | GEPA | 57.33 | 50.11 | 91.03 | 37.53 | 85.05 | +7.62 |
| Qwen3-8B | AgentGrad | **60.45** | **52.11** | **91.51** | 41.42 | **85.81** | **+9.67** |

[Table 1] 다섯 MAS benchmark의 test 성능이다(논문의 Table 1과 2를 합쳤고, seed 3개 평균이며 standard error는 생략했다). benchmark는 multi-hop QA(HotpotQA), claim verification(HoVer), privacy-conscious delegation(PUPA), instruction following(IFBench), math reasoning(MATH)이다. HotpotQA, HoVer, PUPA, IFBench의 MAS 구성, data split, reward 함수는 GEPA의 것을, MATH는 MACM의 것을 그대로 쓴다. 모든 방법에서 task LLM과 optimizer 쪽 LLM은 같은 backbone이다. GPT-5-mini에서 AgentGrad는 다섯 benchmark 모두 1위이고, baseline 대비 평균 향상은 **+11.76 vs GEPA +9.24 vs TextGrad +6.33 vs MIPROv2 +5.66**이다. 격차가 큰 곳은 HotpotQA(73.89 vs GEPA 68.33)와 PUPA(95.17 vs 91.87)이다. Qwen3-8B에서도 평균 향상은 +9.67로 GEPA의 +7.62보다 크다. 다만 IFBench에서는 TextGrad가 42.52로 AgentGrad의 41.42보다 높다. 저자들은 proprietary와 open-source model, 다섯 종류의 task에 걸친 일관된 향상을 두 구성요소가 task 유형과 agent 구성에 걸쳐 일반화된다는 근거로 해석한다.

| Method | HotpotQA | HoVer | PUPA | IFBench | MATH | Avg. |
|---|---|---|---|---|---|---|
| MIPROv2 | 501 | 1226 | 304 | 581 | 431 | 608 |
| TextGrad | 899 | 1553 | 325 | 332 | 126 | 647 |
| GEPA | 346 | 390 | 319 | 269 | 360 | 337 |
| AgentGrad | **109** | **244** | **151** | **90** | **88** | **136** |
| vs. next-best | 3.2× | 1.6× | 2.0× | 3.0× | 1.4× | 2.5× |

[Table 2] GPT-5-mini에서의 wall-clock 최적화 시간(분)이다. AgentGrad는 다섯 benchmark 모두에서 가장 빠르고, 평균 136분으로 두 번째로 빠른 GEPA의 337분보다 2.5배, TextGrad의 647분보다 4.7배 빠르다. intervention을 위한 재실행이 추가되는데도 빨라지는 이유는 4.3절의 통과율 분석에서 설명된다.

{% include figure.liquid path="assets/img/posts/agentgrad/fig4_trajectory.png" class="img-fluid rounded z-depth-1" zoomable=true %}

[Figure 4] HotpotQA(GPT-5-mini)에서 rollout 수에 따른 validation 성능이다. AgentGrad는 rollout 1,000회 부근에서 약 70%에 이르고 이후에도 계속 올라 75% 근처에서 끝난다. GEPA는 초반 수백 rollout 동안은 AgentGrad와 비슷하거나 약간 높지만 68% 부근에서 평평해지고, TextGrad는 67%, MIPROv2는 64% 근처에 머문다.

unseen benchmark로의 전이도 확인했다. 각 benchmark에서 최적화한 prompt를 추가 최적화 없이 같은 domain의 다른 benchmark에 적용하면 AgentGrad가 다섯 쌍 모두에서 가장 높다. HotpotQA → 2WikiMultiHopQA에서 51.22 vs GEPA 44.89 vs baseline 24.33이고, PUPA → PUPA-TNB에서 94.38 vs GEPA 91.51이다.

### 4.2. Ablation Study

| TI | AS | STGA | HotpotQA | PUPA |
|---|---|---|---|---|
| | | | 67.89 | 85.74 |
| ✓ | | | 69.33 | 89.58 |
| ✓ | ✓ | | 70.89 | 92.23 |
| ✓ | | ✓ | 71.89 | 93.13 |
| ✓ | ✓ | ✓ | **73.89** | **95.17** |

[Table 3] GPT-5-mini에서 vanilla baseline에 intervention 기반 target identification(TI, 3.2절), agent-level supervision(AS, 3.3절), semantic textual gradient abstraction(STGA, 3.4절)을 차례로 더한 결과이다. TI만 넣어도 HotpotQA 67.89 → 69.33, PUPA 85.74 → 89.58로 오른다. 그 위에 AS를 더하면 70.89와 92.23, STGA를 더하면 71.89와 93.13이 되고, 셋을 모두 쓰면 73.89와 95.17이다. 세 요소가 서로 다른 부분을 고친다는 2장의 구분과 일치한다.

### 4.3. 왜 더 빠르고 더 잘 일반화되는가

{% include figure.liquid path="assets/img/posts/agentgrad/fig5_ratios.png" class="img-fluid rounded z-depth-1" zoomable=true %}

[Figure 5] 3.5절의 두 관문 통과율이다(HotpotQA와 PUPA 평균, GPT-5-mini). minibatch improvement ratio는 후보 중 자기 minibatch 점수를 올려 validation으로 넘어간 비율이고, validation improvement ratio는 validation 평가 중 실제로 개선된 비율이다. (a)(b)는 baseline과의 비교, (c)(d)는 구성요소별 비교이다.

minibatch 통과율은 **AgentGrad 0.72 vs TextGrad 0.44 vs GEPA 0.28**이다. validation은 minibatch를 통과한 후보에 대해서만 실행되므로, 통과율이 높으면 단위 시간에 소비하는 rollout이 늘어 같은 예산이 더 빨리 소진된다. 저자들은 이것으로 Table 2의 속도 차이를 설명한다. GEPA에서는 후보 넷 중 셋가량이 minibatch 단계에서 버려진다. validation 통과율도 0.27 vs 0.21 vs 0.14로 AgentGrad가 가장 높아서, 빠르게 만든 update가 덜 일반화되는 것도 아니다.

구성요소별로 보면 역할이 갈린다. TI와 AS는 minibatch 통과율을 0.51에서 0.83, 0.87로 올린다. sample 단위 gradient의 질을 높이는 요소들이다. STGA를 넣으면 minibatch 통과율은 0.68~0.72로 조금 내려가는 대신 validation 통과율이 오른다(TI만 0.16, TI+AS 0.21, TI+STGA 0.23, 전체 0.27). 추상화된 gradient는 개별 실패에는 덜 딱 맞지만 다른 sample로 더 잘 옮겨 간다. 즉 **extraction 쪽의 두 요소는 "겨냥한 실패를 고치는가"를, aggregation 쪽의 요소는 "그 수정이 일반화되는가"를 담당한다.**

## 5. Conclusion

**Contribution**

- **[Sequential Intervention]** 실패마다 실행 역순으로 agent 하나씩 hint를 주입해, 고치면 실패가 풀리는 target agent를 실행으로 식별한다. 그때 얻은 교정된 출력 $$\tilde{y}_i^n$$을 agent-level pseudo-label로 써서 explicit loss 없이 gradient를 뽑는다. 두 요소로 HotpotQA 67.89 → 70.89, minibatch 통과율 0.51 → 0.87이다.
- **[Efficiency]** 다섯 benchmark 평균 wall-clock 136분으로 GEPA 337분 대비 2.5배 빠르고, 동시에 두 backbone 모두에서 평균 성능이 가장 높다(GPT-5-mini +11.76 vs GEPA +9.24). 버려지는 후보가 적다는 것이 두 결과의 공통 원인이다.
- **[Semantic Textual Gradient Abstraction]** sample-level gradient를 교정 pattern이 같은 것끼리 묶고 cluster마다 하나의 gradient로 추상화한다. validation 통과율을 0.21에서 0.27로 올리고, 최적화에 쓰지 않은 benchmark로의 전이에서도 다섯 쌍 모두 1위이다(2WikiMultiHopQA 51.22 vs GEPA 44.89).

**Limitations**

arXiv v1에는 limitations 절과 appendix가 실려 있지 않다. 아래는 본문에 서술된 설계 자체에서 따라 나오는 제약이다.

- **[Ground-Truth Hint]** hint는 ground truth 또는 최종 출력의 제약으로 만든다. label이 있는 training set이 전제이고, 정답을 본 agent가 낸 $$\tilde{y}_i^n$$이 정당한 중간 출력인지에 대한 검증은 "최종 reward가 최대가 되었다"는 것 하나이다.
- **[Single-Agent Sufficiency]** target의 정의가 "하나만 고쳐도 풀리는 prompt"이므로, 두 agent를 함께 고쳐야 풀리는 실패는 어느 step에서도 해결되지 않고 hard case로 그 round에서 빠진다. 본문은 이런 sample의 비율을 보고하지 않는다.
- **[Reverse-Order Attribution]** 해결된 실패를 곧바로 집합에서 빼므로, 여러 agent 중 누구를 고쳐도 풀리는 실패는 항상 가장 뒤쪽 agent에 귀속된다. 근거인 "실패가 뒤쪽 agent에 몰린다"는 관찰은 본문에 수치 없이 언급된다.
- **[Fixed Pipeline]** 실험의 MAS는 GEPA와 MACM에서 가져온, 실행 순서가 고정된 pipeline이다. "실행 역순"이라는 절차 자체가 고정된 순서를 전제하므로, orchestrator가 매 step 다음 agent를 고르는 system에는 그대로 적용되지 않는다.

## 6. Textual Gradient의 재료: 무엇을 보고 Prompt를 고치는가

**TextGrad**

$$
\frac{\partial \mathcal{L}}{\partial p^n} = \mathrm{LLM}_{\nabla}\left(p^n,\; \hat{y}^n,\; \frac{\partial \mathcal{L}}{\partial \hat{y}^n}\right) \quad \text{for all } n
$$

- **"최종 loss에 대한 critique을 각 component까지 어떻게 전달할 것인가?"**를 역전파 구조로 푼다.
- 하지만 모든 prompt가 매번 갱신 대상이고, 중간 agent가 받는 신호는 뒤쪽 critique에 대한 critique이어서 그 agent가 실제로 원인인지는 확인되지 않는다.

**GEPA**

$$
n \leftarrow \text{round-robin}, \qquad p_{\text{new}}^n = \mathrm{LLM}_{\text{reflect}}\left(p^n,\; \{(\text{trace}_i, \text{feedback}_i)\}_{i \in \text{random minibatch}}\right)
$$

- **"rollout의 trace 전체에서 무엇을 배우고, 어느 후보를 계속 진화시킬 것인가?"**를 reflection과 Pareto 선택으로 푼다.
- 하지만 이번에 고를 module은 순번으로 정해지고 minibatch는 무작위여서, 후보의 72%가 minibatch 평가에서 버려진다(HotpotQA와 PUPA 평균).

**DoVer**

$$
\tilde{\tau}_{I} = \mathrm{Replay}\left(\tau_{<\hat{t}},\; I\right), \qquad \mathrm{verdict} = V(\tau, \tilde{\tau}_I)
$$

- **"이 step을 고치면 실패가 풀리는가?"**를 개입과 재실행으로 검증한다.
- 하지만 결과는 그 실행 하나에 대한 판정에서 끝나고, agent의 prompt를 고쳐 같은 유형의 실패를 막는 데까지 가지 않는다.

**AgentGrad**

$$
\mathcal{T}^n = \left\{ i : r\left(\Pi^{(n, \mathcal{H})}(x_i)\right) = r_{\max} \right\}, \qquad \delta_i^n = \mathrm{LLM}_{\nabla}\left(p^n, x_i^n, \hat{y}_i^n, \tilde{y}_i^n\right), \qquad \{\bar{\delta}_j^n\} = \mathrm{LLM}_{\text{Aggregator}}\left(\{\delta_i^n\}\right)
$$

- **"어느 agent를, 어떤 출력을 목표로, 어떤 실패들을 한데 묶어 고칠 것인가?"**를 개입 결과로 정한다.
- 하지만 개입에는 정답이 필요하고, 한 agent의 교정만으로 풀리는 실패만 학습 신호가 된다.

따라서 이 논문의 핵심은 단순히 "TextGrad에 clustering을 더한 것"이 아니다. **개입으로 검증한 target 선택, 같은 입력에서 얻은 교정 출력과의 대비, 교정 pattern별 gradient 추상화를 하나의 extraction-aggregation loop 안에 넣어, system 수준의 정답 하나를 agent 수준의 supervision으로 바꾸는 구조**이다.
