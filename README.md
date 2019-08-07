# Parallel Coordinates in D3 Version 5

This is an example of parallel coordinates in D3 that we will build together in seminar on 08/09/2019. We will probably end up deviating from this implementation depending on time and what the group wants to focus on. However, I think it will be helpful for us to have a working version to reference as we go along.

## Setup

You'll need to download this repo. You can do so by opening the terminal, navigating to a folder where you want to download the file `cd <path/to/your/folder>`, and cloneing the repo `git clone https://github.com/kalealex/parallel-coordinates-d3v5.git`. Alternatively, you can download the repo as a zip file.

You'll want to launch a local server on your machine, so we can develop a visualization offline. Navigate to folder you want to host the website from, either `cd inclass` or `cd working`. Then launch a local server using your preferred method. I use php (e.g., `php -S localhost:5555`).

## Contents

* */inclass*: a folder containing template files where we will start developing as a group
    * *index.html*: the template for our webpage; we'll modify this primarily to add CSS styling to our chart
    * *parallel-coodinates.js*: the Javascript file where we will build our visualization
    * *cars.csv*: an example dataset we can visualize; we'll build the visualization so that it could easily be adapted to other datasets
* */working*: a folder containing the same files as above, fleshed out so that we have a working version of the parallel corrdinates plot to reference

## Credits

I used the following three resources to put this example together. The first one inspired my overall approach, but I had to adapt the code to run in v5. I used the other examples to help me modernize the code from the first example without fundamentally changing the approach.

* [Inspiration in v3](https://bl.ocks.org/jasondavies/1341281)
* [Simple parallel coordinates in v4](https://www.d3-graph-gallery.com/graph/parallel_basic.html)
* [Parallel coordinates with brushing in v4](https://bl.ocks.org/syntagmatic/482706e0638c67836d94b20f0cb37122)