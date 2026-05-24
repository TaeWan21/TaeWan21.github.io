---
layout: page
title: ReviewEyes — Feature-based Beauty Product Search
description: Capstone project (Team Leader) that fine-tunes KoBERT for aspect-level sentiment on Korean cosmetic reviews and serves the extracted features through Elasticsearch. Led to a KCI journal paper and a patent application.
img:
importance: 1
category: personal
project_type: personal
display_year: "2024"
funding: "Python · PyTorch · KoBERT · Elasticsearch"
logo_icon: fa-solid fa-eye
---

**Repo.** [github.com/ReviewEye](https://github.com/ReviewEye) (organization) &nbsp;·&nbsp; [Classifier_KeywordExtractor](https://github.com/ReviewEye/Classifier_KeywordExtractor) (modeling code)

**Live demo.** [revieweyes.ajb.kr](https://revieweyes.ajb.kr/) &nbsp;·&nbsp; try queries like *지성 선크림*, *촉촉한 토너*, *건성 크림* (keyword + skin-type category)

**Role.** Team Leader &nbsp;·&nbsp; **Duration.** Sep 2024 – Dec 2024 &nbsp;·&nbsp; **Course.** Capstone Design I

---

### 🎯 Problem

Standard cosmetic e-commerce search returns products by category and brand, but Korean shoppers actually search by *experience-level* descriptors — texture, scent, suitability for their skin type. Phrases like *지성 선크림* ("oily-skin sunscreen") or *촉촉한 토너* ("moisturizing toner") live in user reviews, not in product metadata. We wanted to surface that signal directly through search.

### 🧪 What we built

1. **Aspect-level sentiment & feature extraction** — fine-tuned a pre-trained **KoBERT** for binary sentiment classification on Korean cosmetic reviews, then used a keyword-extraction step to pull product-level features (texture, scent, skin-type fit) from raw review text. Code lives in [`KoBERT_binary_classification.ipynb`](https://github.com/ReviewEye/Classifier_KeywordExtractor/blob/main/KoBERT_binary_classification.ipynb) and [`KeywordExtractor.ipynb`](https://github.com/ReviewEye/Classifier_KeywordExtractor/blob/main/KeywordExtractor.ipynb).
2. **Feature schema + retrieval** — indexed each product with its extracted features in **Elasticsearch**, exposing a *keyword + skin-type category* query interface.
3. **Deployment** — shipped the whole thing as a live service at [revieweyes.ajb.kr](https://revieweyes.ajb.kr/).

### 🎬 Walk-through

A five-step tour of how a user actually uses the deployed service.

**1. Landing & search.** A minimal entry point — type a tag (skin type, feel, function) or a product name.
<p align="center">
  <img src="{{ '/assets/img/projects/revieweye_1.png' | relative_url }}" alt="ReviewEyes landing page" width="100%" style="border: 1px solid var(--global-divider-color); border-radius: 8px;"/>
</p>

**2. Tag-based + product-name results.** A query like *촉촉한 선크림* ("moisturizing sunscreen") returns two ranked lists: products whose **extracted review features** match the tag, and products whose **names** match. Each card surfaces the auto-extracted tags that triggered the hit.
<p align="center">
  <img src="{{ '/assets/img/projects/revieweye_2.png' | relative_url }}" alt="Tag-based and name-based search results" width="100%" style="border: 1px solid var(--global-divider-color); border-radius: 8px;"/>
</p>

**3. Product detail.** Clicking a product opens its detail page with the extracted feature tags surfaced as badges (*#촉촉함*, *#보습효과*, *#밀착력* …) — exactly the language shoppers were already using in reviews.
<p align="center">
  <img src="{{ '/assets/img/projects/revieweye_3.png' | relative_url }}" alt="Product detail page with extracted feature badges" width="100%" style="border: 1px solid var(--global-divider-color); border-radius: 8px;"/>
</p>

**4. Aspect-level analytics.** Per-product dashboards summarize what the review corpus actually says: distribution across skin type / feel / irritation axes, and the top **positive vs. negative review keywords** extracted by our pipeline.
<p align="center">
  <img src="{{ '/assets/img/projects/revieweye_4.png' | relative_url }}" alt="Aspect-level sentiment dashboard with positive/negative keyword bars" width="100%" style="border: 1px solid var(--global-divider-color); border-radius: 8px;"/>
</p>

**5. Review keyword highlighting.** Inside the customer-review tab, the keywords our model extracted (e.g. *촉촉*) are highlighted in-line so the user can see *why* the search matched. The classifier and keyword extractor are wired directly into the review-rendering layer.
<p align="center">
  <img src="{{ '/assets/img/projects/revieweye_5.png' | relative_url }}" alt="Customer reviews with extracted keywords highlighted" width="100%" style="border: 1px solid var(--global-divider-color); border-radius: 8px;"/>
</p>

---

### 🧠 My role as Team Leader

- Coordinated team activities and managed delivery across one semester.
- Owned the modeling decisions — dataset curation (Korean cosmetic reviews from the Korean Academic Society of Business Administration and AI HUB), model selection (KoBERT), and the integration plan with the retrieval layer.
- First author on the resulting paper.

---

### 🏆 Outcomes

The project produced two formal outputs beyond the course deliverable.

**📄 KCI Journal Paper**
> *Feature-Based Beauty Product Search System through Feature Extraction from Product Reviews*
> Tae-Wan Kim, Soo-Hyeon Park, Hyunah Lee
> Journal of Digital Contents Society, **26**(6), 1721–1730 (Jun 2025).
> [KCI link](https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART003217170)

**📜 Patent Application (KR)**
> *Method for Providing Result of Retrieval Based on Reviews and Server Performing the Method*
> Application No. **10-2025-00178132**

---

### 🛠️ Stack

- **Language.** Python
- **NLP.** PyTorch · Hugging Face `transformers` · **KoBERT** (fine-tuned)
- **Retrieval.** Elasticsearch
- **Data.** Korean cosmetic review datasets (Korean Academic Society of Business Administration · AI HUB)
- **Deployment.** Live service at `revieweyes.ajb.kr`
