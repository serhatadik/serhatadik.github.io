---
layout: page
permalink: /publications/
title: publications
description: publications in reversed chronological order.
years: [2023]
nav: true
nav_order: 1
---
<!-- _pages/publications.md -->
<div class="publications">

{%- for y in page.years %}
  <h2 class="year">{{y}}</h2>
  {% bibliography -f papers -q @*[year={{y}}]* %}
{% endfor %}

</div>

<!-- Adjusted Reviews Section for stylistic consistency -->
<div class="publications"> <!-- Use the same class as for publications for consistent styling -->
  <h2 class="year">Journals/Conferences Reviewed For</h2>

  {%- for review in site.reviews %}
    <div class="publication-entry"> <!-- Use a similar class as for publication entries -->
      <h3 class="publication-title">{{ review.name }}</h3>
      <p class="publication-meta">Year: {{ review.year }}</p>
      <!-- Maintain similar markup and class names as in your publications for stylistic consistency -->
    </div>
  {% endfor %}
</div>
