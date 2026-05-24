---
layout: page
title: OtkkiDokkiYo (옷키도키요) — AI Shopping Assistant for the Visually Impaired
description: A voice-driven mobile app that lets visually impaired users photograph an item of clothing and hear a detailed description back, built on a Mask-R-CNN + ResNet-50 vision pipeline.
img:
importance: 1
category: personal
project_type: personal
display_year: "2025"
funding: "Flutter · FastAPI · PyTorch · Mask R-CNN · ResNet-50"
logo_icon: fa-solid fa-shirt
---

**Course.** Capstone Design II (Spring 2025) &nbsp;·&nbsp; **Duration.** Mar 2025 – Jun 2025
**Team.** 김민수, **김태완 (me)**, 이지강 — 3-person team
**Computing.** Supported by the **KIT (Kumoh National Institute of Technology) Supercomputing Center**

---

### 🎯 Problem

Visually impaired people have a hard time figuring out *what* a piece of clothing actually looks like — its category, color, material, length, fit, pattern. Korean ICT statistics show that **92.8 % of visually impaired individuals own a smartphone** (KISA 2023) — by far the highest of any disability group — so the device they're already comfortable with should be the platform.

We targeted **completely blind users as the primary persona** (with usability for low-vision and color-blind users as a bonus), and built a phone-first, **voice-controlled** shopping aid: point the phone, say *"촬영"* (capture), and the app reads back a natural-language description of the garment.

---

### 🧱 System architecture

```
  Flutter (iOS / Android)         FastAPI backend (Python)
  ┌──────────────────────┐        ┌────────────────────────────────┐
  │ Voice command (STT)  │        │ /images/predict                │
  │   "촬영" / "목록"     │ ──HTTP─▶│   1. Mask R-CNN segment + crop │
  │ Camera (image_picker)│  POST  │      → 아우터·상의·하의·원피스    │
  │ Image upload         │        │   2. ResNet-50 per-category    │
  │                      │        │      attribute classification  │
  │ Recent list (local)  │        │      (색상·소재·기장·핏·...)      │
  │ Detail screen        │ ◀──────│      → structured attribute    │
  │ TTS read-back        │  JSON  │        JSON returned to client │
  └──────────────────────┘        └────────────────────────────────┘
```

The pipeline is intentionally a **two-stage hybrid** instead of a single end-to-end model — each stage is independently trainable, debuggable, and replaceable.

---

### 🤖 Vision stack

**1. Segmentation — Mask R-CNN.** Detects the four super-categories (*아우터 / 상의 / 하의 / 원피스*) in the photo, then crops each garment via its bounding box. Trained on AI Hub Korean fashion data after converting the original annotations to **COCO** format and merging per-image JSONs into a single training corpus.

<p align="center">
  <img src="{{ '/assets/img/projects/okido_segment_shirt.png' | relative_url }}" alt="Mask R-CNN inference — shirt category detected with confidence 0.65" width="100%" style="border: 1px solid var(--global-divider-color); border-radius: 8px;"/>
</p>

<p align="center">
  <img src="{{ '/assets/img/projects/okido_segment_full.png' | relative_url }}" alt="Mask R-CNN full-body inference — top and bottom segmented separately" width="80%" style="border: 1px solid var(--global-divider-color); border-radius: 8px;"/>
</p>

**2. Attribute classification — ResNet-50, one model per super-category.** Each cropped garment is passed to a category-specific ResNet-50 head (top / bottom / outer / one-piece). Per-category attribute spaces include **color** (21 classes), **detail** (29), **print** (21), **material** (25), **length** (10), **sleeve length** (6), **neckline** (12), **collar** (8), **fit** (7).

Example test output for a top sample:
```json
{
  "색상": ["옐로우"], "프린트": ["플로럴"],
  "소재": ["퍼"],     "기장": ["크롭"],
  "소매기장": ["반팔"], "넥라인": ["라운드넥"],
  "칼라": ["셔츠칼라"], "핏": ["타이트"]
}
```

The aggregated attribute JSON is returned to the Flutter client, which formats it into a description and reads it aloud through TTS.

---

### 📱 The Flutter app (voice-first UX)

Built in Flutter so a single codebase ships to iOS and Android. The whole UX is reachable **without sighted touch input** — every primary action has a voice equivalent.

**Voice commands**: *촬영* (capture) · *최근 목록* (recent list) · *상세 페이지* (detail page)

**Key packages**: `image_picker` (camera), `speech_to_text` (STT), `flutter_tts` (TTS), `permission_handler`, `shared_preferences`, `http`.

<p align="center">
  <img src="{{ '/assets/img/projects/okido_main.png' | relative_url }}" alt="Main page — large capture button, voice-capture, server test, detail preview" width="40%" style="border: 1px solid var(--global-divider-color); border-radius: 8px;"/>
</p>

<p align="center">
  <em>Main page.</em> A single large capture button is the primary affordance; secondary actions (voice capture / server connection test / detail preview) sit below. Bottom status line reports how many analyses are stored locally.
</p>

<p align="center">
  <img src="{{ '/assets/img/projects/okido_list.png' | relative_url }}" alt="Recent clothing list" width="40%" style="border: 1px solid var(--global-divider-color); border-radius: 8px;"/>
</p>

<p align="center">
  <em>Recent list.</em> Locally persisted history of analyzed items with date and the leading sentence of the analysis. Reachable via the voice command <em>최근 목록</em>.
</p>

<p align="center">
  <img src="{{ '/assets/img/projects/okido_detail.png' | relative_url }}" alt="AI clothing analysis result on detail page" width="40%" style="border: 1px solid var(--global-divider-color); border-radius: 8px;"/>
</p>

<p align="center">
  <em>Detail page.</em> Photo of the captured item plus the analyzed clothing attributes — read aloud by TTS so it works without looking at the screen. A purple <em>새 의류 촬영</em> bar lets the user immediately re-shoot.
</p>

---

### 🛠️ Stack

| Layer | Tech |
|---|---|
| **Mobile front end** | Flutter (Dart) · iOS + Android |
| **Voice I/O** | `speech_to_text` (STT) · `flutter_tts` (TTS) |
| **Backend API** | FastAPI · Uvicorn · python-multipart |
| **Vision** | PyTorch · **Mask R-CNN** (segmentation) · **ResNet-50** (per-category attribute classifiers) |
| **Data** | **AI Hub** Korean fashion dataset, converted to COCO format for training |

---

### 🧠 My contribution

- Owned the **vision pipeline** — JSON-to-COCO conversion, Mask R-CNN training, and the per-category ResNet-50 attribute classifiers (with training notebooks for each super-category).
- Co-authored the requirements, design, mid-presentation, and final-report deliverables across the semester.

---

### 🎯 Takeaways

- Building for **a specific accessibility persona** (totally blind users) forced clean, hard product decisions — every UI affordance had to survive without sight, and the system became simpler as a result.
- A **two-stage hybrid pipeline** (segment → classify) was much easier to debug, retrain, and iterate on than an end-to-end model would have been.
- Wiring a **Flutter front end + FastAPI back end** turned out to be a clean split for a small team — voice/UX work and vision-model work could progress independently.
