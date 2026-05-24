---
layout: page
title: Review-based Cosmetic Feature Search
description: Capstone (Team Leader) · KoBERT + Elasticsearch · Deployed
img:
importance: 1
category: research
related_publications: true
---

**Role.** Team Leader &nbsp;·&nbsp; **Duration.** Sep 2024 – Dec 2024 &nbsp;·&nbsp; **Course.** Capstone Design I

**Deployed at.** [revieweyes.ajb.kr](https://revieweyes.ajb.kr/)

### Problem
Standard cosmetic search returns products by category and brand, but Korean shoppers actually search by experience-level keywords like *"지성 선크림"* or *"촉촉한 토너"*. Those keywords live in user reviews, not in product metadata.

### What I did
- Built a pipeline that fine-tunes a pre-trained **KoBERT** model on Korean cosmetic reviews for aspect-level sentiment analysis, and uses it to extract product-level features (texture, scent, skin-type suitability) from raw user feedback.
- Designed and indexed the feature schema in **Elasticsearch** so the front end could query by *keyword + skin-type category*.
- Coordinated team activities, owned the modeling decisions, and managed delivery as team leader.

### Outcomes
- Production deployment of the search service.
- Published as a **KCI journal paper** (*Journal of Digital Contents Society*, 2025) and a **patent application** (KR 10-2025-00178132).

**Stack.** Python · PyTorch · KoBERT · Hugging Face `transformers` · Elasticsearch · FastAPI · React.
