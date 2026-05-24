---
layout: page
title: Projects
permalink: /projects/
description:
nav: true
nav_order: 3
---

<style>
  .haxproj-section-title {
    font-size: 1.35rem;
    font-weight: 700;
    color: var(--global-text-color);
    margin: 50px 0 0;
    padding-bottom: 8px;
    border-bottom: 2px solid var(--global-theme-color);
  }
  .haxproj-section-title:first-of-type {
    margin-top: 20px;
  }
  .haxproj-group-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--global-text-color);
    margin: 30px 0 16px;
  }
  .haxproj-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-bottom: 20px;
  }
  .haxproj-card {
    display: grid;
    grid-template-columns: 130px 1fr;
    gap: 24px;
    align-items: center;
    padding: 22px 24px;
    background: var(--global-card-bg-color, var(--global-bg-color));
    border: 1px solid var(--global-divider-color);
    border-radius: 10px;
    transition: box-shadow .2s, border-color .2s;
    min-height: 170px;
    color: inherit;
    text-decoration: none;
  }
  .haxproj-card:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border-color: var(--global-theme-color);
    text-decoration: none;
    color: inherit;
  }
  .haxproj-card--static {
    cursor: default;
  }
  .haxproj-card--static:hover {
    box-shadow: none;
    border-color: var(--global-divider-color);
  }
  .haxproj-card--static:hover .haxproj-logo {
    border-color: var(--global-divider-color);
  }

  .haxproj-logo {
    width: 120px;
    height: 120px;
    background: #ffffff;
    border: 1px solid var(--global-divider-color);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px;
    flex-shrink: 0;
    transition: border-color .2s;
  }
  .haxproj-card:hover .haxproj-logo {
    border-color: var(--global-theme-color);
  }
  .haxproj-logo img {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    object-fit: contain;
    display: block;
  }
  .haxproj-logo i {
    font-size: 2.2rem;
    color: var(--global-text-color-light, #888);
  }

  .haxproj-body {
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .haxproj-card h4 {
    font-size: 1rem;
    font-weight: 700;
    margin: 0 0 8px;
    line-height: 1.4;
    color: var(--global-text-color);
  }
  .haxproj-card p {
    font-size: 0.88rem;
    color: var(--global-text-color-light, var(--global-text-color));
    margin-bottom: 12px;
    line-height: 1.5;
  }
  .haxproj-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 18px;
    font-size: 0.78rem;
    color: var(--global-text-color-light, var(--global-text-color));
  }
  .haxproj-meta i {
    color: var(--global-theme-color);
    margin-right: 6px;
    font-size: 0.75rem;
  }
  @media (max-width: 768px) {
    .haxproj-card {
      grid-template-columns: 1fr;
      gap: 14px;
      min-height: auto;
      padding: 18px;
    }
    .haxproj-logo {
      width: 90px;
      height: 90px;
      padding: 8px;
    }
  }
</style>

{% assign type_order = "research,personal" | split: "," %}
{% for ptype in type_order %}
  {% assign type_projects = site.projects | where: "project_type", ptype %}
  {% if type_projects.size > 0 %}
    {% if ptype == "research" %}
<h2 class="haxproj-section-title">Research Projects</h2>
      {% assign meta_icon = "fa-solid fa-landmark" %}
    {% else %}
<h2 class="haxproj-section-title">Personal Projects</h2>
      {% assign meta_icon = "fa-solid fa-code" %}
    {% endif %}

    {% assign years = type_projects | map: "display_year" | uniq | sort | reverse %}
    {% for year in years %}
      {% if year %}
<h3 class="haxproj-group-title">{{ year }}</h3>
<div class="haxproj-list">
        {% assign year_projects = type_projects | where: "display_year", year | sort: "importance" %}
        {% for project in year_projects %}
          {% if ptype == "research" %}
  <div class="haxproj-card haxproj-card--static">
    <div class="haxproj-logo">
      {% if project.logo %}
        <img src="{{ '/assets/img/projects/' | append: project.logo | relative_url }}" alt="{{ project.logo_alt | default: project.funding }}">
      {% elsif project.logo_icon %}
        <i class="{{ project.logo_icon }}"></i>
      {% else %}
        <i class="fa-solid fa-flask"></i>
      {% endif %}
    </div>
    <div class="haxproj-body">
      <h4>{{ project.title }}</h4>
      <p>{{ project.description }}</p>
      <div class="haxproj-meta">
        {% if project.funding %}<span><i class="{{ meta_icon }}"></i>{{ project.funding }}</span>{% endif %}
      </div>
    </div>
  </div>
          {% else %}
  <a class="haxproj-card" href="{{ project.url | relative_url }}">
    <div class="haxproj-logo">
      {% if project.logo %}
        <img src="{{ '/assets/img/projects/' | append: project.logo | relative_url }}" alt="{{ project.logo_alt | default: project.funding }}">
      {% elsif project.logo_icon %}
        <i class="{{ project.logo_icon }}"></i>
      {% else %}
        <i class="fa-solid fa-flask"></i>
      {% endif %}
    </div>
    <div class="haxproj-body">
      <h4>{{ project.title }}</h4>
      <p>{{ project.description }}</p>
      <div class="haxproj-meta">
        {% if project.funding %}<span><i class="{{ meta_icon }}"></i>{{ project.funding }}</span>{% endif %}
      </div>
    </div>
  </a>
          {% endif %}
        {% endfor %}
</div>
      {% endif %}
    {% endfor %}
  {% endif %}
{% endfor %}
