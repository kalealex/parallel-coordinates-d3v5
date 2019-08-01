const svgWidth = 960,
    svgHeight = 500,
    margin = { top: 30, right: 10, bottom: 10, left: 30 },
    width = svgWidth - margin.left - margin.right,
    height = svgHeight - margin.top - margin.bottom;

var x,
    y = {},
    dimensions,
    dragging = {},
    background,
    foreground;

var svg = d3.select("body").append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("cars.csv")
    .then(function (data) {
        // console.log(data)

        // Extract the list of dimensions as keys and create a y scale for each.
        dimensions = d3.keys(data[0]).filter(function (key) {
            if (key !== "") {
                y[key] = d3.scaleLinear()
                    .domain(d3.extent(data, function (d) { return +d[key]; }))
                    .range([height, 0]);
                return key;
            };
        });
        // console.log(dimensions);
        // Creata a x scale for each dimension
        x = d3.scalePoint()
            .domain(dimensions)
            .range([0, width]);

        // Add grey background lines for context.
        background = svg.append("g")
            .attr("class", "background")
            .selectAll("path")
            .data(data)
            .enter().append("path")
            .attr("d", line);

        // Add blue foreground lines for focus.
        foreground = svg.append("g")
            .attr("class", "foreground")
            .selectAll("path")
            .data(data)
            .enter().append("path")
            .attr("d", line);

        // Add a group element for each dimension.
        var g = svg.selectAll(".dimension")
            .data(dimensions)
            .enter().append("g")
            .attr("class", "dimension")
            .attr("transform", function (d) { return "translate(" + x(d) + ")"; })
            .call(d3.drag()
                .on("start", function (d) {
                    dragging[d] = x(d);
                    background.attr("visibility", "hidden");
                })
                .on("drag", function (d) {
                    dragging[d] = Math.min(width, Math.max(0, d3.event.x));
                    foreground.attr("d", line);
                    dimensions.sort(function (a, b) { return position(a) - position(b); });
                    x.domain(dimensions);
                    g.attr("transform", function (d) { return "translate(" + position(d) + ")"; })
                })
                .on("end", function (d) {
                    delete dragging[d];
                    transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
                    transition(foreground).attr("d", line);
                    background
                        .attr("d", line)
                        .transition()
                        .delay(500)
                        .duration(0)
                        .attr("visibility", null);
                }));

        // Add an axis and title.
        g.append("g")
            .attr("class", "axis")
            .each(function (d) { d3.select(this).call(d3.axisLeft().scale(y[d])); })
            .append("text")
            .style("text-anchor", "middle")
            .attr("y", -9)
            .text(function (d) { return d; });

        // Add and store a brush for each axis.
        g.append("g")
            .attr("class", "brush")
            .each(function (d) {
                d3.select(this).call(y[d].brush = d3.brush()
                    .extent([[-10, 0], [10, height]])
                    .on("start", brushstart)
                    .on("brush", brush));
            })
            .selectAll("rect")
            .attr("x", -8)
            .attr("width", 16);
    })
    .catch(function (err) {
        console.error(err);
    });

function position(d) {
    var v = dragging[d];
    return v == null ? x(d) : v;
}

function transition(g) {
    return g.transition().duration(500);
}

// Take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
function line(d) {
    return d3.line()(dimensions.map(function (key) { return [x(key), y[key](d[key])]; }));
}

function brushstart() {
    d3.event.sourceEvent.stopPropagation();
}

// Handles a brush event, toggling the display of foreground lines.
function brush() {
    // Get a set of dimensions with active brushes and their current extent.
    var actives = [];
    svg.selectAll(".brush")
        .filter(function (d) {
            return d3.brushSelection(this);
        })
        .each(function (key) {
            actives.push({
                dimension: key,
                extent: d3.brushSelection(this)
            });
        });

    foreground.style("display", function (d) {
        return actives.every(function (brushObj) {
            return brushObj.extent[1][0] <= y[brushObj.dimension](d[brushObj.dimension]) && y[brushObj.dimension](d[brushObj.dimension]) <= brushObj.extent[1][1];
        }) ? null : "none";
    });
}