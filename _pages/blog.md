---
layout: default
permalink: /blog/
title: Categories
nav: true
nav_order: 2
---

<div class="post categories-page">

  <header class="post-header">
    <h1 class="post-title">Categories</h1>
    <p class="post-description">all posts, grouped by category</p>
  </header>

  {% for parent in site.display_categories %}
    {% assign parent_posts = site.categories[parent] %}
    {% unless parent_posts.size > 0 %}{% continue %}{% endunless %}
    <section class="category-section">
      <h2 class="category-heading">
        <a href="{{ parent | slugify | prepend: '/blog/category/' | relative_url }}">{{ parent }}</a>
      </h2>

      {% assign child_names = "" | split: "" %}
      {% assign direct_posts = "" | split: "" %}
      {% for post in parent_posts %}
        {% if post.categories.size > 1 %}
          {% assign child_names = child_names | push: post.categories[1] %}
        {% else %}
          {% assign direct_posts = direct_posts | push: post %}
        {% endif %}
      {% endfor %}
      {% assign uniq_children = child_names | uniq | sort %}

      {% if direct_posts.size > 0 %}
        <ul class="category-post-list">
          {% for post in direct_posts %}
            <li>
              <span class="post-date">{{ post.date | date: '%Y.%m.%d' }}</span>
              <a class="post-link" href="{{ post.url | relative_url }}">{{ post.title }}</a>
            </li>
          {% endfor %}
        </ul>
      {% endif %}

      {% for child in uniq_children %}
        {% assign child_posts = parent_posts | where_exp: "p", "p.categories contains child" %}
        <h3 class="category-subheading">
          <a href="{{ child | slugify | prepend: '/blog/category/' | relative_url }}">{{ child }}</a>
          <span class="cat-count">({{ child_posts | size }})</span>
        </h3>
        <ul class="category-post-list">
          {% for post in child_posts %}
            <li>
              <span class="post-date">{{ post.date | date: '%Y.%m.%d' }}</span>
              <a class="post-link" href="{{ post.url | relative_url }}">{{ post.title }}</a>
            </li>
          {% endfor %}
        </ul>
      {% endfor %}
    </section>
  {% endfor %}

</div>
