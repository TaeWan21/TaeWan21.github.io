---
layout: page
permalink: /publications/
title: Publications
description:
nav: true
nav_order: 2
---

<style>
  .pub-section-title {
    font-size: 1.35rem;
    font-weight: 700;
    color: var(--global-text-color);
    margin: 50px 0 20px;
    padding-bottom: 8px;
    border-bottom: 2px solid var(--global-theme-color);
  }
  .pub-section-title:first-of-type {
    margin-top: 20px;
  }
</style>

<h2 class="pub-section-title">International Conferences</h2>
<div class="publications">
  {% bibliography --query @inproceedings[category=international] %}
</div>

<h2 class="pub-section-title">Domestic Journals (KCI)</h2>
<div class="publications">
  {% bibliography --query @article %}
</div>

<h2 class="pub-section-title">Domestic Conferences</h2>
<div class="publications">
  {% bibliography --query @inproceedings[category=domestic] %}
</div>

<h2 class="pub-section-title">Patents</h2>
<div class="publications">
  {% bibliography --query @misc %}
</div>
