---
layout: distill
title: Spatial Projection of Antenna Radiation Patterns - IN PROGRESS
description: a detailed guide to projecting antenna radiation patterns onto spatial regions from the ground up
giscus_comments: true
date: 2024-02-23

authors:
  - name: Serhat Tadik
    affiliations:
      name: ECE, Georgia Tech


bibliography: 2024-3-7-random.bib

# Optionally, you can add a table of contents to your post.
# NOTES:
#   - make sure that TOC names match the actual section names
#     for hyperlinks within the post to work correctly.
#   - we may want to automate TOC generation in the future using
#     jekyll-toc plugin (https://github.com/toshimaru/jekyll-toc).
toc:
  - name: Equations
    # if a section has subsections, you can add them as follows:
    # subsections:
    #   - name: Example Child Subsection 1
    #   - name: Example Child Subsection 2
  - name: Citations
  - name: Footnotes
  - name: Code Blocks
  - name: Interactive Plots
  - name: Layouts
  - name: Other Typography?

# Below is an example of injecting additional post-specific styles.
# If you use this post as a template, delete this _styles block.
_styles: >
  .fake-img {
    background: #bbb;
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 0 0px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 12px;
  }
  .fake-img p {
    font-family: monospace;
    color: white;
    text-align: left;
    margin: 12px 0;
    text-align: center;
    font-size: 16px;
  }

---

### Import Libraries
{% highlight python %}

import numpy as np
import scipy.io as sio
import os
import warnings
from collections import defaultdict
from tqdm import tqdm

{% endhighlight %}






<style>
.code-container {
  position: relative;
}

.copy-btn {
  position: absolute;
  top: 5px; /* Adjust based on padding */
  right: 5px; /* Adjust based on padding */
  cursor: pointer;
  /* Add more styling here */
}
</style>









***

## Interactive Plots

You can add interative plots using plotly + iframes :framed_picture:
<style>
/* Flex container for side-by-side iframe display */
.figure-container {
    display: flex;
    justify-content: space-between; /* Ensures iframes are spaced evenly across the full width */
    align-items: stretch; /* Stretches items to fill the container vertically */
    width: 100%; /* Ensures the container takes the full width of its parent */
    max-width: 100%; /* Prevents the container from exceeding the width of the page */
    flex-wrap: nowrap; /* Prevents wrapping to ensure side-by-side layout */
}

/* Responsive iframes with adjusted width for side-by-side view a*/
.figure-container iframe {
    flex: 1; /* Allows the iframe to grow and fill the space evenly */
    height: 550px; /* Adjust height as needed, or set to a specific value for uniformity */
    border: none; /* Updates border styling */
}

/* Optional: Adjust the bottom margin of iframes if needed */
iframe {
    margin-bottom: 1px;
}

/* Adjust iframe container for aspect ratio and responsiveness */
.responsive-iframe {
    position: relative;
    overflow: hidden;
    /* This might be adjusted based on the content's aspect ratio */
}

@media only screen and (max-width: 600px) {
    .figure-container {
        flex-direction: column; /* Stacks iframes vertically on small screens */
    }

    .figure-container iframe {
        flex: 0 0 100%; /* Ensures iframe takes full width on small screens */
        /* Adjust the height or padding-bottom as necessary for aspect ratio */
    }

    .responsive-iframe {
        /* Adjust for aspect ratio on small screens */
        width: 100%; /* Ensures full width on small screens */
    }
}
</style>



<style>
/* Flex container for side-by-side iframe display */

html, body {
    margin: 0;
    padding: 0;
    box-sizing: content-box; /* Includes padding and borders in the element's total width and height */
}

.figure-container2 {
    display: flex;
    justify-content: space-evenly; /* Ensures iframes are spaced evenly */
    align-items: stretch; /* Stretches items to fill the container vertically */
    width: 100%; /* Ensures the container takes the full width of its parent */
    max-width: 100%;
    flex-wrap: nowrap; /* Prevents wrapping to ensure side-by-side layout */
}

/* Responsive iframes */
.figure-container2 .responsive_iframe {
    flex: 1; /* Allows the iframe to grow and fill the space evenly */
    height: 100%; /* Sets iframe height to fill the container */
    border: none; /* Updates border styling */
}


@media only screen and (max-width: 600px) {
    .figure-container2 {
        flex-direction: column; /* Stacks iframes vertically on small screens */
    }

    .responsive-iframe {
        width: 100%; /* Each iframe should take the full width on small screens */
        height: 50vh; /* Adjust the height for small screens */
    }

    .figure-container2 iframe {
        height: 50vh; /* Adjust iframe height on small screens */
    }
}
</style>


<!-- Example of an iframe using .l-body -->
<div class="l-screen-inset responsive-iframe">
  <iframe src="{{ '/assets/plotly/dtm.html' | relative_url }}" frameborder="0" scrolling="yes" height= "500px" margin-bottom= 1px width="100%" style="border: 0px solid rgba(150, 150, 150, 0.5);"></iframe>
</div>

<!-- Add more iframes as needed using the appropriate classes for the desired layout -->

### Reading Antenna Pattern Files (.msi, .pat, and .ana)

{% highlight python %}

def read_antenna_pattern_file(pattern_folder_dir, pattern_file_name, extension):
    if not os.path.isdir(pattern_folder_dir):
        warnings.warn(f'Error: The following folder does not exist:\n{pattern_folder_dir}')
        return

    if pattern_file_name not in os.listdir(pattern_folder_dir):
        warnings.warn(f'Error: The file does not exist in the folder:\n {pattern_folder_dir}')
        return

    pattern_file = os.path.join(pattern_folder_dir, pattern_file_name)
    threeD_pat = {}

    with open(pattern_file, 'r') as file:
        lines = file.readlines()
        if extension in ['ana', '.ana', 'msi', '.msi']:
            azimuth_gain, elevation_gain = {}, {}
            is_horizontal, is_vertical = False, False
            for line in lines:
                line = line.strip()
                if line.startswith(('Horizontal', 'HORIZONTAL')):
                    is_horizontal, is_vertical = True, False
                elif line.startswith(('Vertical', 'VERTICAL')):
                    is_horizontal, is_vertical = False, True
                elif line:
                    if is_horizontal or is_vertical:
                        angle, gain = map(float, line.split())
                        if extension in ['msi', '.msi']:
                            gain = -gain  # specific adjustment for msi files
                        if is_horizontal:
                            azimuth_gain[angle] = gain
                        else:
                            elevation_gain[angle] = gain
            if len(azimuth_gain) == 1:  # Spread single azimuth gain across all angles if only one is present
                azimuth_gain = {i: list(azimuth_gain.values())[0] for i in np.arange(1.0, 360.0)}
            for az in azimuth_gain:
                for el in elevation_gain:
                    threeD_pat[(az, el)] = azimuth_gain[az] + elevation_gain[el]

        elif extension in ['pat', '.pat']:
            azimuth_gain, elevation_gain = {}, defaultdict(list)
            is_horizontal, is_vertical, flag, cnt_999 = False, False, 0, None
            for cnt, line in enumerate(lines, 1):
                line = line.strip()
                if cnt == 1:
                    KYPAT = line[-1]
                if KYPAT == '2' and cnt > 1:
                    if line == "999":
                        flag, cnt_999 = 1, cnt
                        continue
                    if flag == 1 and cnt == cnt_999 + 1:
                        num_splits, num_elv = line.split(',')
                    if flag == 0:
                        angle, gain = map(float, line.split(','))
                        azimuth_gain[angle] = gain
                    elif flag == 1 and cnt > cnt_999 + 2 and cnt not in [cnt_999 + int(num_elv) + 3 + n * 181 for n in
                                                                         range(int(num_splits))]:
                        angle, gain = map(float, line.split(','))
                        elevation_gain[angle].append(gain)
            if len(azimuth_gain) == 1:  # Spread single azimuth gain across all angles if only one is present
                azimuth_gain = {i: list(azimuth_gain.values())[0] for i in range(1, 360)}
            for az in azimuth_gain:
                for el in elevation_gain:
                    threeD_pat[(az, el)] = azimuth_gain[az] + np.mean(elevation_gain[el])

    fig = plt.figure(layout='constrained')
    ax1 = fig.add_subplot(1, 1, 1, projection='polar')
    ax1.set_theta_direction(-1)
    theta = np.array(list(elevation_gain.keys())) * np.pi / 180
    ax1.plot(theta, np.array(list(elevation_gain.values())))
    plt.title("Elevation Angles vs Gain (Polar Plot)")
    plt.show()

    fig = plt.figure(layout='constrained')
    ax1 = fig.add_subplot(1, 1, 1, projection='polar', theta_offset=np.pi / 2)
    ax1.set_theta_direction(-1)
    ax1.plot(np.array(list(azimuth_gain.keys())) * np.pi / 180, np.array(list(azimuth_gain.values())))
    plt.title("Azimuth Angles vs Gain (Polar Plot)")
    plt.show()

    return threeD_pat

{% endhighlight %}

<div class="figure-container">
  <div class="responsive-iframe">
    <iframe src="{{ '/assets/plotly/azaw3939_360.html' | relative_url }}" frameborder="0" scrolling="yes" height= "500px" margin-bottom= 1px width="100%" style="border: 0px solid rgba(150, 150, 150, 0.5);"></iframe>
  </div>
  <div class="responsive-iframe">
    <iframe src="{{ '/assets/plotly/elevaw3939_360.html' | relative_url }}" frameborder="0" scrolling="yes" height= "500px" margin-bottom= 1px width="100%" style="border: 0px solid rgba(150, 150, 150, 0.5);"></iframe>
  </div>
</div>


### Calculating the Antenna Radiation Pattern Projection
{% highlight python %}
def add_rad_patt(initial_preds, map_, map_res, UTM_boundaries, tx_antenna_raster_idx, tx_antenna_height, rx_antenna_height,
                 antenna_0_az_bearing_angle, antenna_0_el_deviation_angle_from_zenith, antenna_threeD_gain,
                 antenna_inclined_tow_bearing_angle=90):
    (dim1, dim2) = initial_preds.shape
    elevs = np.zeros((dim1, dim2))
    bearings = np.zeros((dim1, dim2))
    tx_elevation = map_[tx_antenna_raster_idx[0], tx_antenna_raster_idx[1]]
    tx_total_height = tx_elevation + tx_antenna_height
    assert antenna_0_el_deviation_angle_from_zenith >= 90 and antenna_0_el_deviation_angle_from_zenith <= 180

    beta = antenna_0_el_deviation_angle_from_zenith - 90
    gamma = antenna_inclined_tow_bearing_angle - 90
    ant_dir = np.matmul(rotz(gamma), np.matmul(roty(beta), np.array([0, 0, 1])))

    print("Now calculating angles for gain projection. \n")
    for i in tqdm(range(dim1)):
        for j in range(dim2):
            rx_total_height = map_[i, j] + rx_antenna_height

            slope = (rx_total_height - tx_total_height) / (
                        map_res * (np.linalg.norm(np.array([i, j]) - np.array(tx_antenna_raster_idx))))

            # Elevation angle

            vec3_tx_to_rx = np.array(
                [j - tx_antenna_raster_idx[1], i - tx_antenna_raster_idx[0], rx_total_height - tx_total_height])

            el_angle = find_angle_bw_vecs(vec3_tx_to_rx, ant_dir)

            elevs[i, j] = el_angle

            vec_tx_to_rx = np.array([i, j]) - np.array(tx_antenna_raster_idx)

            norm_vec_tx_to_rx = np.linalg.norm(vec_tx_to_rx)

            dot_product = np.dot(vec_tx_to_rx, np.array([1, 0]))

            angle_radians = np.arccos(dot_product / norm_vec_tx_to_rx)
            angle_degrees = np.degrees(angle_radians)

            if vec_tx_to_rx[1] < 0:
                angle_degrees = 360 - angle_degrees

            bearings[i, j] = angle_degrees

    bearings = np.nan_to_num(bearings, nan=0)
    elevs = np.nan_to_num(elevs, nan=0)
    #plotter(elevs, "Elevation before Subtraction")
    final_preds = np.zeros_like(initial_preds)
    print("Now applying the projection. \n")
    for i in tqdm(range(dim1)):
        for j in range(dim2):
            if bearings[i, j] - antenna_0_az_bearing_angle >= 0:
                bearings[i, j] = bearings[i, j] - antenna_0_az_bearing_angle
            else:
                bearings[i, j] = 360 + bearings[i, j] - antenna_0_az_bearing_angle

            if elevs[i, j] - 90 >= 0:
                elevs[i, j] = elevs[i, j] - 90
            else:
                elevs[i, j] = 360 + elevs[i, j] - 90

            bearings[i, j] = round(bearings[i, j])
            if bearings[i, j] == 360:
                bearings[i, j] = 359

            elevs[i, j] = round(elevs[i, j])
            if elevs[i, j] == 360:
                elevs[i, j] = 359
            final_preds[i, j] = initial_preds[i, j] + antenna_threeD_gain[(bearings[i, j], elevs[i, j])]
    N1 = map_.shape[0]
    N2 = map_.shape[1]
    en = UTM_boundaries

    UTM_long = np.linspace(en[0, 2], en[0, 3] - map_res, N1)
    UTM_lat = np.linspace(en[0, 0], en[0, 1] - map_res, N2)
    plotter(final_preds, "Projected Antenna Gain", UTM_long, UTM_lat, "dBi")
    return final_preds

{% endhighlight %}

<div class="l-screen-inset responsive-iframe">
  <iframe src="{{ '/assets/plotly/demo_Antenna.html' | relative_url }}" frameborder="0" scrolling="yes" height= "500px" margin-bottom= 1px width="100%" style="border: 0px solid rgba(150, 150, 150, 0.5);"></iframe>
</div>


<div class="l-page" style="display: flex; justify-content: space-evenly; align-items: stretch;">
  <div class="responsive-iframe">
    <iframe src="{{ '/assets/plotly/demo_TIREM_nopattern.html' | relative_url }}" frameborder="0" scrolling="no" height= "550px" margin-bottom= 0px width="600px" style="border: 0px solid rgba(150, 150, 150, 0.5);"></iframe>
  </div>
  <div class="responsive-iframe">
    <iframe src="{{ '/assets/plotly/demo_TIREMwAntenna.html' | relative_url }}" frameborder="0" scrolling="no" height= "550px" margin-bottom= 0px  width="600px" style="border: 0px solid rgba(150, 150, 150, 0.5);"></iframe>
  </div>
</div>

<!--
<div class="l-screen-inset responsive-iframe">
  <iframe src="{{ '/assets/plotly/demo_TIREM_nopattern.html' | relative_url }}" frameborder="0" scrolling="yes" height= "550px" margin-bottom= 1px width="100%" style="border: 0px solid rgba(150, 150, 150, 0.5);"></iframe>
</div>

<div class="l-screen-inset responsive-iframe">
  <iframe src="{{ '/assets/plotly/demo_TIREMwAntenna.html' | relative_url }}" frameborder="0" scrolling="yes" height= "500px" margin-bottom= 1px width="100%" style="border: 0px solid rgba(150, 150, 150, 0.5);"></iframe>
</div>
-->

### Main Function
{% highlight python %}

def main():
    threeD_pat = read_antenna_pattern_file("./", "aw3939_3600_T0.msi", "msi")

    # Load map structure from .mat file
    map_struct = sio.loadmat("SLCmap_5May2022.mat")['SLC']

    # Extract SLC data and create a column map for easy access
    SLC = map_struct[0][0]
    column_map = dict(zip([name for name in SLC.dtype.names], [i for i in range(len(SLC.dtype.names))]))

    # Calculate the map data
    map_ = SLC[column_map['dem']] + 0.3048 * SLC[column_map['hybrid_bldg']]

    # Define additional variables for the add_rad_patt function
    map_res = SLC[column_map["cellsize"]]
    tx_antenna_height = 3
    rx_antenna_height = 1.5
    tirem_preds = np.zeros(map_.shape)
    antenna_0_az_bearing_angle = 120
    antenna_0_el_deviation_angle_from_zenith = 90
    antenna_inclined_tow_bearing_angle=90
    antenna_threeD_gain = threeD_pat
    endpoint_coords = [40.76895, -111.84167] # example basestation coordinate
    [BS_x, BS_y, indx] = lon_lat_to_grid_xy(endpoint_coords[1], endpoint_coords[0], SLC,
                                        column_map)  # establish basestation pixel location.

    tx_antenna_raster_idx = [BS_y, BS_x]

    add_rad_patt(tirem_preds, map_, map_res, SLC[column_map["axis"]], tx_antenna_raster_idx, tx_antenna_height, rx_antenna_height,
                 antenna_0_az_bearing_angle, antenna_0_el_deviation_angle_from_zenith, antenna_threeD_gain,
                 antenna_inclined_tow_bearing_angle=90)

if __name__ == "__main__":
    main()

{% endhighlight %}



***

## Equations

This theme supports rendering beautiful math in inline and display modes using [MathJax 3](https://www.mathjax.org/) engine.
You just need to surround your math expression with `$$`, like `$$ E = mc^2 $$`.
If you leave it inside a paragraph, it will produce an inline expression, just like $$ E = mc^2 $$.

To use display mode, again surround your expression with `$$` and place it as a separate paragraph.
Here is an example:

$$
\left( \sum_{k=1}^n a_k b_k \right)^2 \leq \left( \sum_{k=1}^n a_k^2 \right) \left( \sum_{k=1}^n b_k^2 \right)
$$

Note that MathJax 3 is [a major re-write of MathJax](https://docs.mathjax.org/en/latest/upgrading/whats-new-3.0.html) that brought a significant improvement to the loading and rendering speed, which is now [on par with KaTeX](http://www.intmath.com/cg5/katex-mathjax-comparison.php).

***

## Citations

Citations are then used in the article body with the `<d-cite>` tag.
The key attribute is a reference to the id provided in the bibliography.
The key attribute can take multiple ids, separated by commas.

The citation is presented inline like this: <d-cite key="gregor2015draw"></d-cite> (a number that displays more information on hover).
If you have an appendix, a bibliography is automatically created and populated in it.

Distill chose a numerical inline citation style to improve readability of citation dense articles and because many of the benefits of longer citations are obviated by displaying more information on hover.
However, we consider it good style to mention author last names if you discuss something at length and it fits into the flow well — the authors are human and it’s nice for them to have the community associate them with their work.

***

## Footnotes

Just wrap the text you would like to show up in a footnote in a `<d-footnote>` tag.
The number of the footnote will be automatically generated.<d-footnote>This will become a hoverable footnote.</d-footnote>

***

## Code Blocks

Syntax highlighting is provided within `<d-code>` tags.
An example of inline code snippets: `<d-code language="html">let x = 10;</d-code>`.
For larger blocks of code, add a `block` attribute:

<d-code block language="javascript">
  var x = 25;
  function(x) {
    return x * x;
  }
</d-code>

**Note:** `<d-code>` blocks do not look good in the dark mode.
You can always use the default code-highlight using the `highlight` liquid tag:


## Other Typography?

Emphasis, aka italics, with *asterisks* (`*asterisks*`) or _underscores_ (`_underscores_`).

Strong emphasis, aka bold, with **asterisks** or __underscores__.

Combined emphasis with **asterisks and _underscores_**.

Strikethrough uses two tildes. ~~Scratch this.~~

1. First ordered list item
2. Another item
⋅⋅* Unordered sub-list.
1. Actual numbers don't matter, just that it's a number
⋅⋅1. Ordered sub-list
4. And another item.

⋅⋅⋅You can have properly indented paragraphs within list items. Notice the blank line above, and the leading spaces (at least one, but we'll use three here to also align the raw Markdown).

⋅⋅⋅To have a line break without a paragraph, you will need to use two trailing spaces.⋅⋅
⋅⋅⋅Note that this line is separate, but within the same paragraph.⋅⋅
⋅⋅⋅(This is contrary to the typical GFM line break behaviour, where trailing spaces are not required.)

* Unordered list can use asterisks
- Or minuses
+ Or pluses

[I'm an inline-style link](https://www.google.com)

[I'm an inline-style link with title](https://www.google.com "Google's Homepage")

[I'm a reference-style link][Arbitrary case-insensitive reference text]

[I'm a relative reference to a repository file](../blob/master/LICENSE)

[You can use numbers for reference-style link definitions][1]

Or leave it empty and use the [link text itself].

URLs and URLs in angle brackets will automatically get turned into links.
http://www.example.com or <http://www.example.com> and sometimes
example.com (but not on Github, for example).

Some text to show that the reference links can follow later.

[arbitrary case-insensitive reference text]: https://www.mozilla.org
[1]: http://slashdot.org
[link text itself]: http://www.reddit.com

Here's our logo (hover to see the title text):

Inline-style:
![alt text](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Logo Title Text 1")

Reference-style:
![alt text][logo]

[logo]: https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Logo Title Text 2"

Inline `code` has `back-ticks around` it.

```javascript
var s = "JavaScript syntax highlighting";
alert(s);
```

```python
s = "Python syntax highlighting"
print s
```

```
No language indicated, so no syntax highlighting.
But let's throw in a <b>tag</b>.
```

Colons can be used to align columns.

| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |

There must be at least 3 dashes separating each header cell.
The outer pipes (|) are optional, and you don't need to make the
raw Markdown line up prettily. You can also use inline Markdown.

Markdown | Less | Pretty
--- | --- | ---
*Still* | `renders` | **nicely**
1 | 2 | 3

> Blockquotes are very handy in email to emulate reply text.
> This line is part of the same quote.

Quote break.

> This is a very long line that will still be quoted properly when it wraps. Oh boy let's keep writing to make sure this is long enough to actually wrap for everyone. Oh, you can *put* **Markdown** into a blockquote.


Here's a line for us to start with.

This line is separated from the one above by two newlines, so it will be a *separate paragraph*.

This line is also a separate paragraph, but...
This line is only separated by a single newline, so it's a separate line in the *same paragraph*.
