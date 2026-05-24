---
layout: page
title: MoviePick — Plot-Based Movie Recommendation System
description: A keyword-driven Korean movie recommender built on crawled Naver Series On plot data, with actor / keyword / title search modes served via FastAPI.
img:
importance: 3
category: personal
project_type: personal
display_year: "2023"
funding: "Python · FastAPI · scikit-learn · gensim (Word2Vec)"
logo_icon: fa-solid fa-film
---

**Repo.** [github.com/TaeWan21/Movie_Recommendation_System_MoviePick](https://github.com/TaeWan21/Movie_Recommendation_System_MoviePick)

**Role.** Team Member &nbsp;·&nbsp; **Duration.** Jul 2023 – Aug 2023 &nbsp;·&nbsp; **Program.** First SIG project at KLE Lab

A movie recommendation web service called **MoviePick**, built as my first hands-on NLP project. It pulls plot summaries from Naver Series On, cleans them, and lets users find movies through three different search modes: by **actor name**, by **plot keyword**, or by **movie title**.

Under the hood it combines classical IR (TF-IDF + cosine similarity) with **Word2Vec** embeddings for semantic keyword expansion. The whole pipeline is exposed through a **FastAPI** backend.

---

### 🖥️ UI
A simple web interface to drive the three search modes and see results.
<p align="center">
  <img src="https://github.com/user-attachments/assets/a19bda99-b102-49a0-ad0a-91f5df9054d8" alt="MoviePick UI" width="100%" style="border: 1px solid var(--global-divider-color); border-radius: 8px;"/>
</p>

---

### 🔎 Input & Output
The system accepts an actor / keyword / title query and returns matching movies. Actor lookup resolves against the cleaned-from-DB cast list before scoring relevance.
<p align="center">
  <img src="https://github.com/user-attachments/assets/4bfee7fd-077b-4d5f-bcdf-86a79e2e195a" alt="Input and output example" width="100%" style="border: 1px solid var(--global-divider-color); border-radius: 8px;"/>
  <br><br>
  <img src="https://github.com/user-attachments/assets/dada4662-3095-4323-b762-1c8140fe4e00" alt="Actor lookup against DB" width="100%" style="border: 1px solid var(--global-divider-color); border-radius: 8px;"/>
</p>

---

### 🎬 Results & Demo
End-to-end demo of the recommendation flow.
<p align="center">
  <img src="https://github.com/user-attachments/assets/0e1d0605-cf1f-449f-976e-6899f2826259" alt="Demo results" width="100%" style="border: 1px solid var(--global-divider-color); border-radius: 8px;"/>
</p>

---

### 🧠 How it works

**1. Data collection (`precleaning.py`, `jsonWriter.py`).**
Crawled movie metadata and plot summaries from **Naver Series On**, then normalized and serialized the dataset to JSON for fast loading at query time.

**2. Three search modes.**
- **Keyword search** (`KeyWordSearch.py`) — tokenizes the query and the plot corpus, scores documents by TF-IDF + cosine similarity, and expands rare keywords with **Word2Vec** nearest neighbors.
- **Actor name search** (`ActorNameSearch.py`) — resolves the query against the cast field across the dataset.
- **Movie title search** (`MovieNameSearch.py`) — direct title lookup with fuzzy matching.

**3. Recommendation (`Recommend.py`).**
After candidate retrieval, plot vectors are compared against the user's query to produce a ranked list of similar movies.

**4. Serving (`FastAPI.py`).**
A FastAPI app exposes the search endpoints and serves the UI.

---

### 🎯 Takeaways
- Built end-to-end NLP intuition: tokenization, TF-IDF, cosine similarity, word embeddings.
- Hands-on experience with **crawling**, **JSON-based dataset design**, and serving an ML model behind a **FastAPI** endpoint.
- Learned how much of recommendation-system quality comes from data cleaning and query intent disambiguation — not just the model.

---

### 🛠️ Stack
- **Language.** Python
- **Backend.** FastAPI
- **ML / NLP.** scikit-learn (TF-IDF, cosine similarity) · gensim (Word2Vec)
- **Data.** Crawled plot summaries from Naver Series On, stored as JSON
