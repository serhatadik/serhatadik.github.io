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
<style>
.small-text {
  font-size: 0.75rem; /* Or any size smaller than the default for <h6> */
}
</style>

<div class="publications">
  <h2 class="publication-title">reviews</h2>
  <p class="small-text">contributions to the scientific community</p>

  {%- for review in site.reviews %}
      <h2 class="year">{{ review.year }}</h2>
      <!-- Corrected the <h5> tag and wrapped the publication title in an <a> tag -->
      <h5 class="publication-title"><a href="{{ review.link }}">{{ review.name }}</a></h5>
  {% endfor %}
</div>
