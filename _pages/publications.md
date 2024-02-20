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
  <h2 class="publication-title">Journals/Conferences Reviewed For </h2>

  {%- for review in site.reviews %}
      <h3 class="publication-title">{{ review.name }}</h3>
      <h2 class="year">{{ review.year }}</h2>
      <!-- Maintain similar markup and class names as in your publications for stylistic consistency -->
      <!-- Adjust the class as necessary to match the publications style -->
    </div>
  {% endfor %}
</div>
