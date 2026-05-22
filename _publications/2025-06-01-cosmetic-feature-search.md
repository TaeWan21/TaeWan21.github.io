---
title: "Feature-based Beauty Product Search System through Feature Extraction from Reviews"
collection: publications
category: manuscripts
permalink: /publication/2025-06-cosmetic-feature-search
excerpt: 'A review-driven cosmetic search system that fine-tunes KoBERT for aspect-level sentiment analysis on Korean beauty reviews and exposes the extracted features through an Elasticsearch-backed retrieval engine. Deployed at revieweyes.ajb.kr.'
date: 2025-06-01
venue: 'Journal of Digital Contents Society (KCI)'
citation: 'Taewan Kim et al. (2025). &quot;Feature-based Beauty Product Search System through Feature Extraction from Reviews.&quot; <i>Journal of Digital Contents Society</i>, vol. 26, no. 6, pp. 1721–1730.'
---

**Venue.** Journal of Digital Contents Society (KCI), vol. 26, no. 6, pp. 1721–1730, June 2025.

**Demo.** A live deployment of the system is available at [revieweyes.ajb.kr](https://revieweyes.ajb.kr/). Example queries: `지성 선크림`, `촉촉한 토너`, `건성 크림` (keyword + skin-type category).

**Summary.** Korean cosmetic reviews contain rich, free-form descriptions of how a product *actually* feels and performs — texture, scent, suitability for specific skin types — but standard product search ignores most of this signal. We construct a review-grounded search pipeline:

1. **Data.** Cosmetic review datasets from the Korean Academic Society of Business Administration and AI HUB.
2. **Feature extraction.** Fine-tuned a pre-trained **KoBERT** for sentiment analysis on Korean cosmetic reviews and used it to extract product-level features (e.g., *moisturizing*, *long-lasting*, *suitable for oily skin*) from raw user feedback.
3. **Retrieval.** Indexed products and their extracted features in **Elasticsearch**, exposing a keyword + skin-type categorical query interface.
4. **Outcome.** End-to-end deployment as a production service; the journal version reports the modeling and evaluation in detail.

**My role.** Team leader for the originating Capstone Design I project; first author of the resulting journal paper. Owned the modeling for feature extraction and coordinated the system integration.

**Related patent.** *Method for Providing Result of Retrieval Based on Reviews and Server Performing the Method* (KR application no. 10-2025-00178132).
