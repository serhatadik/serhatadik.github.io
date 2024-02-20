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

<!-- Reviews Section for Journals/Conferences -->
<div class="reviews">
  <h2 class="reviews-title">Journals/Conferences Reviewed For</h2>

  <!-- Loop through reviews collection -->
  {%- for review in site.reviews %}
    <div class="review">
      <h4 class="review-name">{{ review.name }}</h4>
      <h2 class="year">{{y}}</h2>
      <!-- Add more fields as necessary -->
    </div>
  {% endfor %}
</div>
