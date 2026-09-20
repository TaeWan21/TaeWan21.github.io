# TaeWan21.github.io

al-folio 기반 개인 사이트(이력서 + 블로그). 로컬 렌더링은 Docker로 한다: `docker compose run --rm --name alfolio-serve --service-ports jekyll /bin/bash -c "bundle install --quiet && bundle exec jekyll serve --host 0.0.0.0 --port 8080 --livereload"` → http://localhost:8080. 파일 저장 시 자동 재생성되며, `_config.yml`을 바꾼 경우에만 `docker restart alfolio-serve`가 필요하다. 종료는 `docker stop alfolio-serve`.

## 블로그 글 규칙

- 파일: `_posts/YYYY-MM-DD-slug.md`, `layout: post`, `date`는 빌드 시각(KST)보다 과거여야 한다.
- 목차: front matter에 `toc: { beginning: true }`를 넣고 `##`/`###` 헤딩을 쓰면 글 상단에 클릭 가능한 목차가 생성된다(jekyll-toc). 헤딩이 곧 목차이므로 헤딩 텍스트를 목차 항목처럼 쓴다.
- 태그(#) 표시와 하단 "Enjoy Reading This Article?" 추천 글은 제거된 상태다(`_layouts/post.liquid`, `related_blog_posts.enabled: false`).
- 수식은 `$$ ... $$`, 코드는 fenced block, 그림은 `assets/img/posts/<slug>/`에 둔다.
- front matter에 `thumbnail: assets/img/posts/<slug>/<file>.png`를 넣으면 Home의 글 박스 오른쪽에 썸네일이 표시된다(없으면 생략). Home 글 박스 스타일은 `_sass/_custom.scss`에 있다.

## 논문 리뷰 글 작성 흐름 (참고: meaningful96.github.io/nr/GDN)

스타일이 아니라 **서술 흐름**을 따른다. 아래 7단계 순서와 각 단계의 역할을 지킨다.

### 0. 머리말

- 제목: `[Paper Review] 논문 제목 (Venue, Year)`.
- 첫 줄에 목차, 그 다음 줄에 서지 정보 한 줄(저자. 연도. **논문 제목**. 학회/저널.). 요약이나 감상은 여기에 쓰지 않는다.

### 1. Problem Formulation (문제 정의)

- 첫 문장에서 "이 논문은 **~을 목표로 한다**"로 목표를 굵게 한 문장으로 못 박는다.
- 이어서 배경의 trade-off를 한 문단으로: 기존 A는 X에 강하지만 Y가 문제, 대안 B는 Y를 해결하지만 Z가 문제.
- 마지막 문장에서 제안 방법을 한 줄로 요약한다.
- 문단 아래에 **입력 / 출력 / 최종 목표** 세 항목을 bullet으로 형식화한다. 기호(q_t, k_t, S_t 등)는 여기서 처음 도입한다.

### 2. Limitations of Existing Works (기존 연구의 한계)

- 한계마다 `**[키워드]**` 라벨을 앞에 붙인 독립 문단으로 쓴다(예: [Quadratic Attention], [Memory Collision]).
- 각 문단은 "기존 방식이 무엇을 하는가 → 왜 그것이 한계를 만드는가 → 그 결과 어떤 성능 문제가 생기는가"의 인과 순서로 쓴다.
- 여기서 지적한 한계가 3장의 각 하위 절과 1:1로 대응되도록 설계한다.

### 3. Methodology (방법론) — 글의 절반 이상

> **고정되는 것은 1~5 대제목뿐이다.** 3장의 하위 절(3.x)은 아래 틀에 억지로 맞추지 않고, 해당 논문의 실제 전개에 맞춰 유동적으로 구성한다. 필요하면 절을 추가하거나 뺀다. 아래 항목은 GDN 리뷰에서 쓰인 구성의 예시이며, 그 논문에 자연스럽게 맞을 때만 가져다 쓴다(예: 선행 방법 사슬이 없는 시스템 논문에 "선행 방법 → 한계" 절을 만들어 넣지 않는다).

- 3장 도입: 전체 구조 그림(Figure 1) 한 장 + "전체 pipeline은 ① ② ③ ④ 으로 구성된다" bullet. 세부 수식은 아직 쓰지 않는다.
- 하위 절은 **선행 방법 → 그 한계 → 그것을 고치는 다음 방법** 사슬로 점진적으로 쌓는다.
  예: Linear Attention(기초 개념) → Mamba2(global forgetting) → DeltaNet(selective update) → 제안 방법(둘의 결합).
  각 선행 방법 절의 마지막 문장은 반드시 "그러나 ~ 문제가 있다"로 끝내 다음 절로 넘긴다.
- 핵심 수식 절의 형식:
  1. "핵심 수식은 하나이다" 식으로 display 수식 하나를 제시
  2. 수식 기호를 bullet으로 정의(S_t, k_t, v_t, α_t, β_t …)
  3. 수식의 각 항을 굵은 소제목으로 나누어 역할을 해석(예: **α_t – global memory control**, **(I − βkkᵀ) – targeted memory control**), 극단값(→0, →1)에서 어떻게 동작하는지 설명
  4. "결과적으로 ~" 문장으로 개념적 의미 정리
- 필요하면 별도 해석 절을 둔다(예: online learning / fast weight 관점). 마지막에 한 줄 슬로건으로 압축한다(예: **GDN ≈ test-time online regression + adaptive weight decay**).
- "왜 두 요소가 모두 필요한가?" 같은 질문형 절을 두어, 논문의 분석 실험(예: S-NIAH)을 방법론 안에서 인용하며 설계 근거를 수치로 보인다.
- 효율성(하드웨어/학습 병렬화) 절은 "왜 그대로 구현하면 느린가 → 어떤 변환으로 matmul화하는가 → 그래서 실제 대규모 적용이 가능하다" 순서.
- 마지막 하위 절에서 전체 block 구조와 변형(hybrid 등)을 정리하고, 저자가 인정한 한계에서 hybrid가 나온 이유를 밝힌다.

### 4. Experiments (실험) — 짧게

- 4.1 Main Results: 표 이미지 → `[Table N]` 라벨 → 실험 조건(파라미터 수, 데이터, 토큰 수) 명시 → **제안 vs 각 baseline 숫자를 나란히** (예: 55.32 vs 54.89 vs 52.14) → 저자의 해석 한 문장. 표 하나당 한 문단.
- 4.2 Ablation Study: 구성요소를 하나 제거했을 때 지표가 얼마에서 얼마로 변하는지 수치로만 쓴다. 이 결과가 3장의 어느 주장을 뒷받침하는지 연결한다.

### 5. Conclusion (결론)

- **Contribution**: `**[라벨]**` bullet 3개(핵심 방법 / 효율성 / 확장·hybrid 순).
- **Limitations**: `**[라벨]**` bullet. 저자가 논문에서 명시한 한계를 우선 쓰고, 그 한계가 논문의 어떤 설계로 이어졌는지 연결한다.

### 6. 정확히 무엇이 다른가? (리뷰어의 정리)

- 비교 대상 방법들의 핵심 수식을 나란히 놓는다(각 1줄).
- 각 방법마다 "**~을 얼마나/어떻게 할 것인가?**"라는 질문 형태로 잘하는 것을 쓰고, 그 아래 "하지만 ~하지는 못한다"로 한계를 한 줄.
- 마지막 문단은 "따라서 이 논문의 핵심은 단순히 '~'가 아니다. **A + B + C를 하나의 ~ 안에서 학습하도록 만든 구조**이다"로 닫는다.

### 문체 규칙

- 한국어 서술체("~한다", "~이다"), 기술 용어·고유명사는 영어 그대로(state, decay, retrieval, gating).
- 절마다 마지막 문장은 "즉 / 핵심은 / 결과적으로 / 따라서"로 시작하는 한 줄 요약.
- 논문의 핵심 주장, 수식의 의미, 결정적 비교 수치는 **굵게**. 굵은 글씨는 문단당 1~2곳 이내.
- 그림·표는 반드시 `[Figure N]`/`[Table N]` 라벨을 붙인 뒤 설명하고, 설명 없는 그림은 넣지 않는다.
- 수치는 항상 baseline과 함께 쓴다. 단독 수치는 의미가 없다.
- 감상("인상 깊었다")은 쓰지 않는다. 판단은 6장에서 논리로만 보인다.
- 분량 감각: 전체 약 10~12k자, 3장이 절반 이상, 4장은 1/6 이하.
