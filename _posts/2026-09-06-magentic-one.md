---
layout: post
title: "[Paper Review] Magentic-One: A Generalist Multi-Agent System for Solving Complex Tasks (arXiv, 2024)"
date: 2026-09-06 21:00:00 +0900
description: "Orchestrator의 두 ledger와 nested loop로 planning, progress tracking, error recovery를 구현한 generalist multi-agent system"
categories: [paper-review, Multi-agent System]
tags: [multi-agent, llm-agent, orchestration]
giscus_comments: false
thumbnail: assets/img/posts/magentic-one/fig1_overview.png
toc:
  beginning: true
---

## 1. Problem Formulation

이 논문은 **하나의 고정된 agent team으로, benchmark별 수정 없이 web·file·code에 걸친 complex task를 자율적으로 해결하는 generalist agentic system을 만드는 것**을 목표로 한다. 기존 single-agent 시스템은 특정 domain에서는 강하지만 모든 tool과 workflow가 하나의 prompt에 묶여 있어, 능력을 추가하거나 다른 종류의 task로 옮기기 어렵다. multi-agent 시스템은 능력을 agent 단위로 나누어 이 문제를 줄인다. 하지만 다음 speaker만 정하는 수준의 routing으로는 긴 task에서 계획을 유지하지 못하고 같은 실패를 반복한다. Magentic-One은 Orchestrator가 두 개의 ledger와 nested loop로 planning, progress tracking, error recovery를 맡고, 실행은 네 개의 tool-centric agent에게 위임하는 구조를 제안한다.

논문은 수식 없이 서술과 그림으로 시스템을 정의한다. 아래 기호는 설명을 위해 이 글에서 붙인 것이다.

- **입력**: task $$\tau = (x, \mathcal{F}, y^\ast, E)$$. $$x$$는 텍스트 task description, $$\mathcal{F}$$는 선택적인 첨부 파일(image, dataset, audio 등), $$y^\ast$$는 desired output, $$E$$는 evaluation function이다. 환경은 부분적으로만 관측되는 computer이며, 저자들은 이 설정을 POMDP로 볼 수 있다고 적는다.
- **출력**: 텍스트 답 $$\hat{y}$$ 또는 도달해야 하는 환경의 최종 상태, 그리고 그 과정의 trace
- **최종 목표**: time budget(예: 25분) 안에서 $$E(\hat{y}, y^\ast)$$를 최대화하되, GAIA, AssistantBench, WebArena에 동일한 구성을 그대로 적용하는 것

## 2. Limitations of Existing Works

**[Monolithic Single-Agent]** single-agent 접근은 하나의 LLM에 code execution, web browsing 등 모든 tool을 붙이고 CoT나 ReAct 같은 prompting으로 multi-step 추론을 수행한다. 모든 능력이 하나의 prompt와 workflow에 결합되어 있어서, 능력 하나를 추가하거나 빼려면 시스템 전체를 다시 조정해야 한다. 특정 benchmark에 맞춘 시스템은 만들 수 있어도 여러 domain에서 재사용하기는 어렵다.

**[Flat Action Space]** single-agent는 매 step마다 click, scroll, 파일 열기, code 작성, code 실행 등 수십 개의 action 중 하나를 직접 고른다. 선택지가 늘수록 LLM이 고려해야 할 범위가 넓어지고, screenshot grounding과 code 작성처럼 성격이 다른 action이 같은 context에 섞인다. action 선택 오류가 늘고, 능력별로 model이나 prompt를 다르게 가져갈 수도 없다.

**[Routing without Planning and Recovery]** Sibyl, WebPilot, Trase 같은 기존 multi-agent 시스템은 역할이 다른 agent를 두지만, 저자들은 이들이 dynamic routing과 planning, recovery를 함께 갖추지 못했다고 본다. 가장 단순한 AutoGen GroupChat은 매 turn마다 다음 speaker만 정한다. plan과 working memory가 없어서 대화가 길어지면 목표에서 벗어나고, 진행 여부를 판정하지 않으므로 같은 검색과 같은 click을 반복해도 빠져나오지 못한다.

**[Uncontrolled Evaluation]** Mind2Web처럼 기록된 trace 위에서 평가하면 agent가 경로를 벗어날 수 없어 error recovery를 측정하지 못한다. live 환경에서는 반대로 action이 side effect를 남긴다. 먼저 평가된 시스템이 설치한 library가 나중 시스템에 이득을 주거나, 한 agent가 지운 파일이 이후 task를 망칠 수 있어 시스템 간 수치 비교가 어려워진다.

## 3. Methodology

{% include figure.liquid loading="eager" path="assets/img/posts/magentic-one/fig1_overview.png" class="img-fluid rounded z-depth-1" zoomable=true %}

[Figure 1] GAIA task 하나를 푸는 과정이다. 첨부 image 속 Python script를 실행해 URL을 얻고, 그 page의 C++ code를 compile·실행해 세 번째와 다섯 번째 정수의 합을 구해야 한다. Orchestrator가 plan을 세운 뒤 FileSurfer가 image에서 code를 추출하고(①), Coder와 ComputerTerminal이 실행해 URL을 얻고(②③), WebSurfer가 C++ code를 가져오며(④), 다시 Coder와 ComputerTerminal이 실행해 답 47을 낸다(⑤⑥).

Magentic-One은 Orchestrator 하나와 네 개의 agent(WebSurfer, FileSurfer, Coder, ComputerTerminal)로 이루어진 team이다. Orchestrator는 task를 분해해 plan을 세우고, 매 step 어느 agent에게 무엇을 시킬지 정하며, 진행 상황을 추적하다가 막히면 plan을 고친다. 나머지 agent는 각자 도구 하나를 맡는다. 논문이 드는 예를 보면, "지난달 나온 AI safety 논문을 조사해 slide로 정리하라"는 요청에 대해 WebSurfer가 논문을 검색해 내려받고, FileSurfer가 PDF를 열어 내용을 뽑고, Coder가 slide를 만드는 code를 쓰고, ComputerTerminal이 그 code를 실행한다.

### 3.1. Orchestrator의 두 Loop

{% include figure.liquid path="assets/img/posts/magentic-one/fig2_orchestrator.png" class="img-fluid rounded z-depth-1" zoomable=true %}

[Figure 2] Orchestrator의 제어 흐름이다. 밝은 배경과 실선이 Task Ledger를 관리하는 outer loop, 어두운 배경과 점선이 Progress Ledger를 관리하는 inner loop이다. 아래쪽의 네 agent는 Orchestrator의 instruction을 받아 관측하고 행동한다.

Orchestrator의 동작은 두 겹의 loop로 정리된다. outer loop는 task에 대해 아는 것과 모르는 것, 그리고 plan을 Task Ledger에 적는다. inner loop는 plan을 실행하는 쪽이다. 매 step Progress Ledger를 새로 작성해 task가 끝났는지, team이 막혔는지, 다음에 누가 무엇을 할지를 정하고 agent 하나를 호출한다. 막힌 상태가 일정 횟수를 넘으면 inner loop를 빠져나와 outer loop에서 ledger와 plan을 다시 쓴다. 두 ledger는 모두 Orchestrator의 LLM이 자연어로 채우는 structured text이고, 별도의 학습은 없다.

### 3.2. Task Ledger: 무엇을 알고 무엇을 모르는가

outer loop는 task가 들어오면 시작된다. $$k$$번째 iteration의 Task Ledger를 다음과 같이 쓸 수 있다.

$$
L_k = \big(F^{\text{given}}_k,\; F^{\text{lookup}}_k,\; F^{\text{derive}}_k,\; G_k,\; P_k\big)
$$

- $$F^{\text{given}}_k$$: 주어졌거나 검증된 facts
- $$F^{\text{lookup}}_k$$: web search 등으로 찾아야 할 facts
- $$F^{\text{derive}}_k$$: 계산이나 논리로 유도해야 할 facts
- $$G_k$$: educated guesses
- $$P_k$$: plan

Orchestrator는 곧바로 plan을 세우지 않고, request를 검토해 facts와 guesses부터 채운다. 아는 것, 찾아야 할 것, 계산해야 할 것을 먼저 구분해 두는 셈이다. 논문이 따로 강조하는 항목은 educated guess이다. LLM이 기억하고 있는 closed-book 지식을 검증된 사실과 섞지 않고 "추측"이라는 칸에 따로 적어 두면, agent는 그 지식의 도움을 받으면서도 그것을 사실로 단정하지 않게 된다. agent가 이 값에 의존하는 경우는 막혔을 때와, 시간이 다 되어 best guess라도 내야 할 때로 제한된다. guess는 새 정보가 들어오면 outer loop에서 갱신된다.

plan은 facts와 guesses가 채워진 다음에 만든다. Orchestrator는 각 team member의 description과 현재 ledger를 함께 보고, 어떤 step을 어느 agent가 맡을지를 자연어로 적는다. 이 plan은 실행을 강제하는 script로 쓰이지 않는다. 저자들은 plan을 chain-of-thought prompting과 비슷한 hint로 설명하며, Orchestrator도 다른 agent도 그대로 따를 의무가 없다. 한편 plan은 outer loop가 돌 때마다 바뀔 수 있으므로, **plan이 갱신되면 모든 agent의 context를 비우고 state를 reset한다.** 이전 plan에서 쌓인 실패의 흔적을 다음 시도로 가져가지 않기 위해서다.

### 3.3. Progress Ledger: 매 Step의 다섯 가지 질문

inner loop의 각 iteration에서 Orchestrator는 Task Ledger와 지금까지의 대화를 보고 다섯 가지 질문에 답한다.

- request가 완전히 충족되었는가? ($$c_t$$)
- team이 loop에 빠졌거나 같은 행동을 반복하고 있는가? ($$r_t$$)
- forward progress가 있는가? ($$p_t$$)
- 다음에 어느 agent가 말할 것인가? ($$i_t$$)
- 그 agent에게 어떤 instruction이나 question을 줄 것인가? ($$u_t$$)

이 다섯 답이 Progress Ledger $$\ell_t$$이고, 다음 동작은 이 값들과 stall counter $$n_t$$로 정해진다. Figure 2의 세 분기를 식으로 옮기면 다음과 같다.

$$
\begin{aligned}
\ell_t &= (c_t,\; r_t,\; p_t,\; i_t,\; u_t) = \mathrm{LLM}_{\text{orch}}\big(L_k,\; h_t\big), \qquad n_t = n_{t-1} + \mathbb{1}\big[\, r_t = 1 \ \lor\ p_t = 0 \,\big] \\[4pt]
\text{next} &=
\begin{cases}
\text{terminate and report } \hat{y} & c_t = 1 \\
\text{agent } m_{i_t} \text{ executes instruction } u_t & c_t = 0,\;\; n_t \le \theta \\
\text{break to outer loop: reflect, then } L_k \rightarrow L_{k+1} & c_t = 0,\;\; n_t > \theta
\end{cases}
\end{aligned}
$$

$$h_t$$는 step $$t$$까지의 agent 대화이고 $$\theta$$는 stall 임계값으로, 실험에서는 2이다. 논문은 counter가 증가하는 조건(loop가 탐지되거나 진전이 없을 때)만 명시하므로 식에도 그 부분만 적었다.

뒤의 두 질문은 routing이다. 다음 speaker $$i_t$$만 고르는 방식은 AutoGen의 GroupChat과 같고, 논문의 ablation에서 baseline으로 쓰인다. Magentic-One은 여기에 $$u_t$$를 더한다. 선택된 agent는 긴 대화 전체를 스스로 해석할 필요 없이 Orchestrator가 준 지시 하나를 수행하면 된다.

앞의 세 질문은 감시다. 완료 여부, 반복 여부, 진전 여부를 매 step 따로 묻기 때문에 "team이 막혔다"는 상태가 $$n_t$$라는 숫자로 드러난다. $$n_t$$가 $$\theta$$ 이하인 동안은 그대로 다음 agent를 호출한다. 저자들의 설명으로는 agent에게 작은 오류에서 회복하거나 잠깐의 불확실성을 버틸 예산을 주는 것이다. 논문에 $$\theta$$를 바꿔 본 실험은 없지만 양 끝을 생각해 보면 값의 의미가 분명해진다. $$\theta$$가 0에 가까우면 한 번만 막혀도 re-plan이 일어나고, re-plan은 agent의 context를 지우므로 사소한 오류에도 그동안의 작업을 버리게 된다. 반대로 $$\theta$$가 매우 크면 outer loop로 돌아갈 일이 없어 처음 plan에 묶인 채 같은 시도를 반복한다.

$$n_t$$가 $$\theta$$를 넘으면 Orchestrator는 inner loop를 멈추고 Reflexion 방식의 reflection을 수행한다. 무엇이 잘못되었는지, 그 과정에서 새로 알게 된 것이 무엇인지, 다음에는 무엇을 다르게 할지를 정리한 뒤 Task Ledger를 갱신하고 plan을 고쳐 새 inner loop를 시작한다. 이 과정은 task가 완료되거나 최대 시도 횟수, 최대 시간 같은 종료 조건에 닿을 때까지 이어진다. 끝나면 Orchestrator가 전체 transcript와 ledger를 검토해 final answer를 내고, 답을 확정하지 못했으면 educated guess를 낸다.

정리하면 Progress Ledger는 매 step 바뀌는 빠른 state이고 Task Ledger는 plan이 실패했을 때만 바뀌는 느린 state이다. 한 줄로 줄이면 **Magentic-One ≈ ReAct-style inner loop + Reflexion-style re-planning + explicit ledger memory**이다.

### 3.4. 네 개의 Agent

agent는 대부분 LLM에 전용 system prompt와 그 능력에 필요한 tool을 붙인 형태이고, LLM을 쓰지 않는 agent도 있다.

**WebSurfer.** 논문이 가장 자세히 설명하는 agent로, Chromium 기반 browser의 state를 관리한다. 자연어 request가 오면 그것을 자신의 action 하나로 mapping해 실행하고, 바뀐 page의 state를 screenshot과 텍스트 설명으로 보고한다. 저자들은 이를 전화 기술 지원에 비유한다. Orchestrator는 무엇을 해야 할지 알지만 page를 직접 만질 수 없어서, 지시를 전달하고 WebSurfer의 보고에 의존한다. action은 세 종류다. navigation(URL 방문, web search, scroll), page action(click, type), 그리고 reading action(요약, 질의응답)이다. reading action이 있으면 WebSurfer가 문서 전체를 대상으로 직접 Q&A를 수행할 수 있어서, "계속 scroll하라"는 지시를 주고받는 왕복이 크게 준다. click이나 type을 page의 특정 요소에 grounding할 때는 WebVoyager와 비슷하게 set-of-marks prompting을 쓴다. 요소에 표시를 단 screenshot을 입력으로 쓰므로 multimodal model이 필요하다. 저자들은 여기에 viewport 밖에 있는 content의 텍스트 설명을 prompt에 추가했다. 사람과 마찬가지로 WebSurfer도 화면 밖의 요소는 조작할 수 없기 때문에, scroll하거나 menu를 열면 무엇이 나올지 미리 알려 주는 것이다.

**FileSurfer.** WebSurfer와 거의 같은 구조이고, browser 대신 markdown 기반의 file preview application을 조작한다. read-only이며 PDF, Office 문서, image, video, audio 등을 열 수 있고 directory 탐색도 한다.

**Coder.** system prompt로 특화된 LLM agent이다. code를 작성하고, 다른 agent가 모은 정보를 분석하고, console output을 받아 자기 program을 debug한다.

**ComputerTerminal.** Coder가 쓴 program을 실행하는 console shell이다. library 설치 같은 shell command도 실행하므로 team이 쓸 수 있는 도구를 필요에 따라 늘릴 수 있다. LLM 호출 없이 deterministic하게 동작한다.

### 3.5. 왜 Tool 기준으로 나누었는가

이 분해의 첫 번째 효과는 action 선택이 두 단계로 나뉜다는 점이다.

$$
\pi(a_t \mid h_t) \;=\; \underbrace{\pi_{\text{orch}}\big(i_t, u_t \mid L_k, h_t\big)}_{\text{which capability}} \;\cdot\; \underbrace{\pi_{i_t}\big(a_t \mid u_t, o_{t-1}\big)}_{\text{which action}}, \qquad a_t \in \mathcal{A}_{i_t}
$$

$$\mathcal{A}_i$$는 agent $$i$$의 action 집합, $$o_{t-1}$$은 직전 observation이다. single-agent라면 크기 $$\sum_i \lvert \mathcal{A}_i \rvert$$인 집합에서 한 번에 골라야 한다. Magentic-One에서는 Orchestrator가 "web을 볼 것인가, file을 열 것인가" 수준에서 하나를 고르고, 선택된 agent가 자신의 좁은 $$\mathcal{A}_i$$ 안에서 click과 scroll 중 하나를 고른다. 저자들은 이 hierarchy가 LLM이 추론하기 더 쉬운 구조일 수 있다고 말한다. 다만 이를 직접 검증한 실험은 없다.

두 번째는 나누는 기준이다. 최근의 multi-agent 시스템은 planner, researcher, data analyst처럼 사람 team의 role을 본뜨는 경우가 많다. 저자들은 role로 나누면 researcher와 analyst가 둘 다 browser와 code를 필요로 해 능력이 중복된다고 지적한다. tool로 나누면 관심사가 깔끔하게 분리되고, browser가 범용 도구인 만큼 WebSurfer도 다른 team에서 재사용할 수 있다. agent를 더하거나 빼도 다른 agent의 prompt나 전체 흐름을 고칠 필요가 없다는 점에서 저자들은 object-oriented programming에 비유한다.

세 번째는 agent마다 구현을 다르게 가져갈 수 있다는 점이다. 기본 구성은 모든 LLM agent에 GPT-4o를 쓰지만, 변형인 Magentic-One (GPT-4o, o1)은 Orchestrator의 outer loop와 Coder에만 o1-preview를 쓴다. o1-preview는 text 입력만 받으므로 screenshot을 봐야 하는 WebSurfer와 FileSurfer에는 쓸 수 없고, text만으로 충분하면서 reasoning의 이득이 큰 planning, reflection, code 작성에 배정한 것이다. 저자들은 같은 방식으로 grounding이나 요약 같은 subtask에 더 작은 model을 배정하면 cost도 줄일 수 있다고 본다.

저자들은 이 설계가 유일한 답이라고 주장하지 않는다. Orchestrator가 모든 것을 정하는 centralized control flow를 택했지만, agent가 다음 차례를 스스로 넘기는 peer-to-peer 구조나, 반대로 plan을 executable program으로 만들어 엄격히 따르는 구조도 가능하다고 적는다. 어떤 control flow가 어떤 task에 맞는지는 열린 문제로 남겨 둔다.

## 4. Experiments

### 4.1. Setup

agent의 action은 환경에 side effect를 남기므로 저자들은 평가 도구인 AutoGenBench를 함께 만들었다. task마다 새로 초기화된 Docker container에서 시작해 task 간 간섭을 없애고 위험한 action이 host에 닿지 않게 하며, 같은 task를 반복 실행해 LLM 호출의 variance도 볼 수 있다. benchmark는 live website와 상호작용하는 GAIA, AssistantBench, WebArena를 골랐다. 기록된 trace 위에서는 error recovery를 평가할 수 없기 때문이다. 구현은 AutoGen 0.4, 기본 model은 gpt-4o-2024-05-13이며, 세 benchmark에 같은 구성을 쓰고 답의 형식을 맞추는 final prompt와 WebArena login 같은 setup code만 다르다. baseline과의 차이는 z-test($$\alpha = 0.05$$)로 검정한다.

### 4.2. Main Results

{% include figure.liquid path="assets/img/posts/magentic-one/table1_main.png" class="img-fluid rounded z-depth-1" zoomable=true %}

[Table 1] GAIA test 300문제, AssistantBench test 181문제, WebArena 812 task의 task completion rate(%)이다. baseline은 2024년 10월 21일 기준 leaderboard 수치이고, 밑줄은 Magentic-One (GPT-4o, o1)과 통계적으로 comparable한 결과, 굵은 글씨는 더 높은 결과이다. GAIA에서 Magentic-One (GPT-4o, o1)은 **38.00 vs omne v0.1 40.53 vs Trase Agent 39.53**으로 comparable하고, GPT-4o만 쓰면 32.33이다(GPT-4 + plugins 14.60, human 92.00). AssistantBench accuracy는 27.7 vs SPA→CB (Claude) 26.4 vs Infogent 14.5이다. WebArena는 GPT-4o 구성만 평가되었고 32.8 vs WebPilot 37.2 vs Jace.AI 57.1로 이 둘에게는 뒤지며, AWM 35.5, SteP 33.5와는 comparable하다. o1이 Gitlab task의 26%를 거부해 hybrid 구성의 WebArena 결과는 빠졌다. 저자들은 baseline 중 세 benchmark 모두에서 평가된 시스템이 base model 외에는 없다는 점을 generality의 근거로 든다.

{% include figure.liquid path="assets/img/posts/magentic-one/table2_breakdown.png" class="img-fluid rounded z-depth-1" zoomable=true %}

[Table 2] 난이도와 domain별 비교이다. AssistantBench에서 Magentic-One (GPT-4o, o1)은 Easy 73.4 vs best baseline 81로 뒤지고 Medium 47.1 vs 44.6으로 앞서며, Hard에서는 GPT-4o 구성이 **16.9 vs 13.3**으로 앞선다. WebArena는 가장 쉬운 Reddit에서 53.77 vs WebPilot 65.1로 차이가 크다. 저자들은 Magentic-One의 고정 overhead가 긴 task에는 도움이 되지만 짧은 task에서는 오류 기회를 늘린다고 해석한다. 다만 GAIA에서는 Level 1 54.84 vs 53.76으로 앞서고 Level 3 22.92 vs 26.53으로 뒤져서 이 경향이 일관되지는 않는다.

### 4.3. Ablation Study

{% include figure.liquid path="assets/img/posts/magentic-one/fig3a_ablation_level.png" class="img-fluid rounded z-depth-1" zoomable=true %}

[Figure 3] GAIA validation set(165문제)에서 Magentic-One (GPT-4o)의 정답 수이며, 개수는 그래프에서 읽은 값이다. 네 agent를 그대로 두고 Orchestrator만 GroupChat 방식으로 바꾸면 **61개 → 42개(−31%)**로 줄고, 가장 어려운 Level 3은 3개에서 0개가 된다. agent 구성이 같아도 두 ledger가 없으면 긴 task부터 무너진다는 결과이다. agent를 빼는 쪽은 WebSurfer 제거 42개, FileSurfer 제거 38개(−39%), Coder와 ComputerTerminal 제거 48개(−21%)이다. WebSurfer를 빼면 Level 1이 29개 → 15개로, FileSurfer를 빼면 파일 첨부가 많은 Level 2가 29개 → 14개로 가장 크게 준다. 한편 log를 자동 분류한 error analysis에서 가장 흔한 실패는 실패 후에도 같은 행동을 반복하는 persistent-inefficient-actions였다. 3.3절의 stall counter가 겨냥한 문제가 아직 다 풀리지 않았다는 의미이다.

## 5. Conclusion

**Contribution**

- **[Ledger-based Orchestration]** Task Ledger, Progress Ledger, stall counter로 planning, progress tracking, error recovery를 하나의 Orchestrator에 구현하고, 네 개의 tool-centric agent와 묶어 open-source로 공개한다.
- **[AutoGenBench]** task마다 새 Docker container에서 시작해 isolation과 repetition을 보장하는 agentic benchmark 도구를 제안한다.
- **[Generality and Modularity]** 동일한 구성으로 GAIA 38.00, AssistantBench 27.7, WebArena 32.8을 기록해 benchmark 특화 시스템과 comparable한 성능을 보이고, agent별로 model을 달리 두는 hybrid 구성이 가능함을 보인다.

**Limitations**

- **[High Cost and Latency]** 대부분의 문제에 수십 번의 LLM 호출이 필요해 task당 수 달러와 수십 분이 들 수 있다. 저자들은 3.5절처럼 subtask별로 더 작은 model을 배정해 줄이는 방향을 제시한다.
- **[Limited Modalities and Actions]** WebSurfer는 video를 보거나 hover, drag를 할 수 없고, FileSurfer는 문서를 Markdown으로 바꾸므로 figure나 layout에 대한 질문에 답하지 못한다. Coder는 매번 독립된 Python program 전체를 새로 작성해 기존 code base를 다루지 못한다.
- **[Fixed Team, No Long-term Memory]** team이 다섯 agent로 고정되어 있고 task 간에 학습이 전달되지 않는다. WebArena처럼 같은 sub-task가 반복되는 경우에도 해법을 매번 다시 찾는데, Task Ledger를 task 하나의 short-term memory로 설계한 결과이다.
- **[Risks]** 개발 중 agent가 login 실패 후 password reset을 시도하거나 사람에게 도움을 구하는 글을 게시하려 한 사례가 관찰되었다. 저자들은 container 격리, least privilege, 되돌릴 수 없는 action 앞에서의 human input을 제안한다.

## 6. Magentic-One vs. 기존 Agent 구조

**Single-Agent (ReAct)**

$$
a_t \sim \pi_\theta(\cdot \mid x, h_t), \qquad a_t \in \mathcal{A}
$$

- **"지금까지의 관측으로 다음 action을 무엇으로 할 것인가?"**를 잘 결정한다.
- 하지만 plan과 memory가 $$h_t$$에 섞여 있고, 능력이 늘수록 $$\mathcal{A}$$와 prompt가 함께 커져 확장하지는 못한다.

**GroupChat (Simple Orchestrator)**

$$
i_t = \mathrm{LLM}_{\text{select}}(h_t), \qquad a_t \sim \pi_{i_t}(\cdot \mid h_t)
$$

- **"다음에 누가 말할 것인가?"**를 잘 결정한다.
- 하지만 진행 여부를 판정하지 않으므로 막힌 plan을 버리지는 못한다(GAIA validation 61 → 42).

**Magentic-One**

$$
(c_t, r_t, p_t, i_t, u_t) = \mathrm{LLM}_{\text{orch}}(L_k, h_t), \qquad n_t > \theta \;\Rightarrow\; L_k \rightarrow L_{k+1}
$$

- **"누가 무엇을 할 것인가, 그리고 지금 plan을 계속 믿을 것인가?"**를 매 step 함께 결정한다.
- 하지만 task가 끝나면 $$L_k$$를 버리므로 task 간에는 배우지 못한다.

따라서 이 논문의 핵심은 단순히 "agent를 여러 개 두었다"가 아니다. **explicit working memory(Task Ledger) + step 단위의 progress 감시와 routing(Progress Ledger) + stall counter로 제어되는 re-planning을 하나의 Orchestrator 안에서 학습 없이 prompt만으로 동작하도록 묶은 구조**이다.
