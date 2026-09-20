---
layout: default
permalink: /
title: Home
pagination:
  enabled: true
  collection: posts
  permalink: /page/:num/
  per_page: 10
  sort_field: date
  sort_reverse: true
  trail:
    before: 1
    after: 3
---

<div class="post home-feed">

  <div class="row">

    <aside class="col-md-3 home-sidebar">
      <div class="sidebar-profile">
        <img class="sidebar-avatar" src="{{ '/assets/img/sidebar_profile.jpeg' | relative_url }}" alt="Taewan Kim">
        <p class="sidebar-name">Taewan Kim</p>
        <p class="sidebar-motto">Zero to Hero 🚀</p>
        <ul class="sidebar-links">
          <li>
            <a href="mailto:{{ site.data.socials.email | encode_email }}"><i class="fa-solid fa-envelope"></i> Email</a>
          </li>
          <li>
            <a href="https://github.com/{{ site.data.socials.github_username }}" target="_blank" rel="noopener"><i class="fa-brands fa-github"></i> GitHub</a>
          </li>
        </ul>
      </div>

      <div class="category-tree">
        <p class="category-tree-title">📂 Categories</p>
        <ul>
          {% for parent in site.display_categories %}
            {% assign parent_posts = site.categories[parent] %}
            {% unless parent_posts.size > 0 %}{% continue %}{% endunless %}
            <li>
              <a class="cat-parent" href="{{ parent | slugify | prepend: '/blog/category/' | relative_url }}">{{ parent }}</a>
              {% assign child_names = "" | split: "" %}
              {% for post in parent_posts %}
                {% if post.categories.size > 1 %}
                  {% assign child_names = child_names | push: post.categories[1] %}
                {% endif %}
              {% endfor %}
              {% assign uniq_children = child_names | uniq | sort %}
              {% if uniq_children.size > 0 %}
                <ul>
                  {% for child in uniq_children %}
                    {% assign child_posts = parent_posts | where_exp: "p", "p.categories contains child" %}
                    <li>
                      <a href="{{ child | slugify | prepend: '/blog/category/' | relative_url }}">{{ child }}</a>
                      <span class="cat-count">({{ child_posts | size }})</span>
                    </li>
                  {% endfor %}
                </ul>
              {% endif %}
            </li>
          {% endfor %}
        </ul>
      </div>
    </aside>

    <div class="col-md-9 home-main">
      <h2 class="recent-posts-title">Recent Posts</h2>

      <ul class="recent-posts">
        {% for post in paginator.posts %}
          <li>
            <a class="post-card" href="{{ post.url | relative_url }}">
              <div class="post-card-body">
                <div class="post-card-meta">
                  {% for category in post.categories %}
                    <span class="post-card-chip">{{ category }}</span>
                  {% endfor %}
                  <span>{{ post.date | date: '%Y.%m.%d' }}</span>
                </div>
                <span class="post-card-title">{{ post.title }}</span>
                {% if post.description %}
                  <p class="post-card-desc">{{ post.description }}</p>
                {% endif %}
              </div>
              {% if post.thumbnail %}
                <div class="post-card-thumb">
                  <img src="{{ post.thumbnail | relative_url }}" alt="" loading="lazy">
                </div>
              {% endif %}
            </a>
          </li>
        {% endfor %}
      </ul>

      {% include pagination.liquid %}
    </div>

  </div>

</div>
