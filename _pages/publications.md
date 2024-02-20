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
  <h2 class="publication-title">reviews </h2>
  <p class="publication-description">contributions to the scientific communities </p>

  {%- for review in site.reviews %}
      <h2 class="year">{{ review.year }}</h2>
      <h5 class="publication-title">{{ review.name }}</h5>
  {% endfor %}
</div>
