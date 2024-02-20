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

<!-- Reviews Section with corrected alignment -->
<div class="publications">
  <h2 class="year">Journals/Conferences Reviewed For</h2>

  {%- for review in site.reviews %}
    <!-- Ensure the div class here matches that of the publications for consistent styling -->
    <div class="publication-entry">
      <h3 class="publication-title">{{ review.name }}</h3>
      <div class="publication-meta">Year: {{ review.year }}</div>
      <!-- Adjust the class as necessary to match the publications style -->
    </div>
  {% endfor %}
</div>
