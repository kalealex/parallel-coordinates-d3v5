const svgWidth = 960,
    svgHeight = 560,
    margin = { top: 30, right: 30, bottom: 30, left: 30 },
    width = svgWidth - margin.left - margin.right,
    height = svgHeight - margin.top - margin.bottom;

var x,
    y = {},
    dimensions,
    lines,
    g;

var svg = d3.select("body").append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

d3.csv("cars.csv")
    .then(function (data) {
        console.log(data);

        // Extract the list of dimensions as keys and create a y scale for each.
        dimensions = d3.keys(data[0]).filter(function (key) {
            if (key !== "") {
                y[key] = d3.scaleLinear()
                    .domain(d3.extent(data, function (d) { return +d[key]; }))
                    .range([height, 0]);
                return key;
            };
        });

        // Create our x axis scale.
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

        // Draw lines
        lines = svg.append("g")
            .attr("class", "lines")
            .selectAll("path")
            .data(data).enter()
            .append("path")
            .attr("d", line);

        // Add a group element for each dimension.
        g = svg.selectAll(".dimension")
            .data(dimensions).enter()
            .append("g")
            .attr("class", "dimension")
            .attr("transform", function (d) { return "translate(" + x(d) + ")"; });

        // Add an axis and title.
        g.append("g")
            .attr("class", "axis")
            .each(function (d) { d3.select(this).call(d3.axisLeft().scale(y[d])); })
            .append("text")
            .style("text-anchor", "middle")
            .attr("fill", "black")
            .attr("font-size", "12")
            .attr("y", -9)
            .text(function (d) { return d; });

        // Add and store a brush for each axis.
        g.append("g")
            .attr("class", "brush")
            .call(d3.brushY()
                .extent([[-10, 0], [10, height]])
                .on("start", brushstart)
                .on("brush", brush)
                .on("end", brush))
            .selectAll("rect")
            .attr("x", -8)
            .attr("width", 16);
    })
    .catch(function (err) {
        console.error(err);
    });

// Take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
function line(d) {
    return d3.line()(dimensions.map(function (key) {
        return [x(key), y[key](d[key])];
    }));
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
            console.log(d3.brushSelection(this));
            return d3.brushSelection(this);
        })
        .each(function (key) {
            actives.push({
                dimension: key,
                extent: d3.brushSelection(this)
            });
        });
    // Change line visibility based on brush extent.
    if (actives.length === 0) {
        lines.style("display", null);
    } else {
        lines.style("display", function (d) {
            return actives.every(function (brushObj) {
                return brushObj.extent[0] <= y[brushObj.dimension](d[brushObj.dimension]) && y[brushObj.dimension](d[brushObj.dimension]) <= brushObj.extent[1];
            }) ? null : "none";
        });
    }
}

// function position(d) {
//     var v = dragging[d];
//     return v == null ? x(d) : v;
// }