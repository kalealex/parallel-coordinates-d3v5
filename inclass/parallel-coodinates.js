const svgWidth = 960,
    svgHeight = 560,
    margin = { top: 30, right: 30, bottom: 30, left: 30 },
    width = svgWidth - margin.left - margin.right,
    height = svgHeight - margin.top - margin.bottom;

var x,
    y = {},
    dimensions,
    lines;

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

        lines = svg.append("g")
            .attr("class", "lines")
            .selectAll("path")
            .data(data).enter()
            .append("path")
            .attr("d", line);
    })
    .catch(function (err) {
        console.error(err);
    });

// Take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
function line(d) {
    return d3.line()(dimensions.map(function (key) { return [x(key), y[key](d[key])]; }));
}