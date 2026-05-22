---
title: "Review-based Cosmetic Feature Extraction & Search (Capstone, Team Leader)"
excerpt: "Led a team to ship revieweyes.ajb.kr — a Korean cosmetic search engine that pulls aspect-level features from reviews using fine-tuned KoBERT and serves them through Elasticsearch."
collection: portfolio
---

**Role.** Team Leader &nbsp; · &nbsp; **Duration.** Sep 2024 – Dec 2024 &nbsp; · &nbsp; **Course.** Capstone Design I

**Deployed at.** [revieweyes.ajb.kr](https://revieweyes.ajb.kr/)

**Problem.** Standard cosmetic search returns products by category and brand, but Korean shoppers actually search by experience-level keywords like *"지성 선크림"* or *"촉촉한 토너"*. Those keywords live in user reviews, not in product metadata.

**What I did.**
- Built a pipeline that fine-tuned a pre-trained **KoBERT** model on Korean cosmetic reviews for sentiment / aspect analysis, then extracted product-level features (texture, scent, skin-type suitability) from review text.
- Designed and indexed the feature schema in **Elasticsearch** so the front-end could query by *keyword + skin-type category*.
- Coordinated team activities, owned the modeling decisions, and managed delivery as team leader.

**Outcomes.**
- Successful production deployment of the search service.
- Resulting work was published as a **KCI journal paper** ([details](/publication/2025-06-cosmetic-feature-search)) and a **patent application** (KR 10-2025-00178132).

**Stack.** Python · PyTorch · KoBERT · Hugging Face `transformers` · Elasticsearch · FastAPI · React.
