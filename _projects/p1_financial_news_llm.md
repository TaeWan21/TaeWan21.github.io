---
layout: page
title: Financial News Summarizer via LLM Fine-Tuning
description: Fine-tuned Llama 3 8B with LoRA to extract structured fields from Korean financial news.
img:
importance: 1
category: personal
project_type: personal
display_year: "2025"
funding: "Python · LoRA · Llama Factory · GPT-4"
logo_icon: fa-solid fa-chart-line
---

**Role.** Personal Project &nbsp;·&nbsp; **Duration.** Mar 2025 – Apr 2025

### Goal
Turn raw Korean financial news into structured signals that downstream apps (alerting, portfolio monitoring) can consume directly — not just free-form summaries.

### What I did
- Used the `deakeun-ml/naver-news-summarization-ko` dataset from Hugging Face as the base corpus.
- Prompt-engineered **GPT-4** to label each article with structured fields: `is_stock_related`, `positive_impact_stocks`, `reasons`, `keywords`, `summary` — producing a high-quality teacher dataset.
- Fine-tuned **Llama 3 8B** with **LoRA** using **Llama Factory**, distilling the GPT-4 labeling behavior into an open model that can be self-hosted.
- Built an end-to-end pipeline covering data generation, training, and inference.

### Takeaways
Practical experience with LoRA hyperparameters, prompt-as-data labeling, and the cost/quality tradeoffs of distilling from a closed model into an open one.
