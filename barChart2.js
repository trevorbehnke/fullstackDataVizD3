async function drawChart() {
  const dataset = await d3.json("./nyc_weather_data.json");
  // const metricAccessor = (d) => d.humidity;
  // const yAccessor = (d) => d.length;

  const width = 600;

  let dimensions = {
    width: width,
    height: width * 0.6,
    margin: {
      top: 30,
      right: 10,
      bottom: 50,
      left: 50,
    },
  };

  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.boundedHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  const drawHistogram = (metric) => {
    const metricAccessor = (d) => d[metric];
    const yAccessor = (d) => d.length;

    const wrapper = d3
      .select("#wrapper")
      .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height);

    const bounds = wrapper
      .append("g")
      .style(
        "transform",
        `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
      );

    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(dataset, metricAccessor))
      .range([0, dimensions.boundedWidth])
      .nice();

    const binsGenerator = d3
      .histogram()
      .domain(xScale.domain())
      .value(metricAccessor)
      .thresholds(12);

    const bins = binsGenerator(dataset);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(bins, yAccessor)])
      .range([dimensions.boundedHeight, 0])
      .nice();

    const binsGroup = bounds.append("g");

    const binGroups = binsGroup.selectAll("g").data(bins).enter().append("g");

    const barPadding = 1;

    const barRects = binGroups
      .append("rect")
      .attr("x", (d) => xScale(d.x0) + barPadding / 2)
      .attr("y", (d) => yScale(yAccessor(d)))
      .attr("width", (d) =>
        d3.max([0, xScale(d.x1) - xScale(d.x0) - barPadding])
      )
      .attr("height", (d) =>
        d3.max([0, dimensions.boundedHeight - yScale(yAccessor(d))])
      )
      .attr("fill", "steelblue");

    const barText = binGroups
      .filter(yAccessor)
      .append("text")
      .attr("x", (d) => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
      .attr("y", (d) => yScale(yAccessor(d)) - 10)
      .attr("dy", "0.35em")
      .text(yAccessor)
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-family", "sans-serif");

    const mean = d3.mean(dataset, metricAccessor);

    const meanLine = bounds
      .append("line")
      .attr("x1", xScale(mean))
      .attr("x2", xScale(mean))
      .attr("y1", -15)
      .attr("y2", dimensions.boundedHeight)
      .attr("stroke", "red")
      .attr("stroke-dasharray", "2px 4px");

    const meanLabel = bounds
      .append("text")
      .attr("x", xScale(mean))
      .attr("y", -20)
      .text(`mean`)
      .attr("fill", "red")
      .style("font-size", "12px")
      .style("font-family", "sans-serif")
      .style("text-anchor", "middle");

    const xAxisGenerator = d3.axisBottom(xScale);

    const xAxis = bounds
      .append("g")
      .call(xAxisGenerator)
      .style("transform", `translateY(${dimensions.boundedHeight}px)`);

    const xAxisLabel = xAxis
      .append("text")
      .attr("x", dimensions.boundedWidth / 2)
      .attr("y", dimensions.margin.bottom - 10)
      .text(metric)
      .style("text-transform", "capitalize")
      .attr("fill", "black")
      .style("font-size", "12px")
      .style("font-family", "sans-serif")
      .style("text-anchor", "middle");
  };

  const metrics = [
    "windSpeed",
    "moonPhase",
    "dewPoint",
    "humidity",
    "uvIndex",
    "windBearing",
    "temperatureMin",
    "temperatureMax",
  ];

  metrics.forEach(drawHistogram);
}

drawChart();
