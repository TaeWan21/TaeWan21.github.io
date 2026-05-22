---
title: "Financial News Summarizer via LLM Fine-Tuning (LoRA · Llama 3 8B)"
excerpt: "Fine-tuned Llama 3 8B with LoRA to extract structured fields from Korean financial news — stock-relatedness, impacted tickers, reasons, keywords, summary."
collection: portfolio
---

**Role.** Personal project &nbsp; · &nbsp; **Duration.** Mar 2025 – Apr 2025

**Goal.** Turn raw Korean financial news into structured signals that downstream apps (alerting, portfolio monitoring) can consume directly — not just free-form summaries.

**What I did.**
- Used the `deakeun-ml/naver-news-summarization-ko` dataset from Hugging Face as the base corpus.
- Prompt-engineered **GPT-4** to label each article with structured fields: `is_stock_related`, `positive_impact_stocks`, `reasons`, `keywords`, `summary`. This produced a high-quality teacher dataset.
- Fine-tuned **Llama 3 8B** with **LoRA** using **Llama Factory**, distilling the GPT-4 labeling behavior into an open model that can be self-hosted.
- Built an end-to-end pipeline covering data generation, training, and inference.

**Takeaways.** Practical experience with LoRA hyperparameters, prompt-as-data labeling, and the cost/quality tradeoffs of distilling from a closed model into an open one.

**Stack.** Python · Hugging Face `transformers` / `trl` · LoRA · Llama Factory · GPT-4 API · PyTorch.
