async function drawChart() {
  const dataset = await d3.json("./nyc_weather_data.json");
  const metricAccessor = (d) => d.humidity;
  const yAccessor = (d) => d.length;
  //   const dateParser = d3.timeParse("%Y-%m-%d");
  //   const xAccessor = (d) => dateParser(d.date);

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
    .attr("y", (d) => yScale(yAccessor(d)));
  // .attr("height", (d) => dimensions.boundedHeight - yScale(yAccessor(d)))
  // .attr("width", (d) => xScale(d.x1) - xScale(d.x0) - barPadding);

  //   // Create scales
  //   const yScale = d3
  //     .scaleLinear()
  //     .domain(d3.extent(data, yAccessor))
  //     .range([dimensions.boundedHeight, 0]);

  //   const freezingTemperaturePlacement = yScale(32);
  //   bounds
  //     .append("rect")
  //     .attr("x", 0)
  //     .attr("width", dimensions.boundedWidth)
  //     .attr("y", freezingTemperaturePlacement)
  //     .attr("height", dimensions.boundedHeight - freezingTemperaturePlacement)
  //     .attr("fill", "#e0f3f3");

  //   // Draw data
  //   const lineGenerator = d3
  //     .line()
  //     .x((d) => xScale(xAccessor(d)))
  //     .y((d) => yScale(yAccessor(d)));

  //   const line = bounds
  //     .append("path")
  //     .attr("d", lineGenerator(data))
  //     .attr("fill", "none")
  //     .attr("stroke", "black")
  //     .attr("stroke-width", 2);

  //   // Add axes
  //   const yAxisGenerator = d3.axisLeft(yScale);
  //   bounds.append("g").call(yAxisGenerator);

  //   const xAxisGenerator = d3.axisBottom(xScale);
  //   bounds
  //     .append("g")
  //     .call(xAxisGenerator)
  //     .style("transform", `translateY(${dimensions.boundedHeight}px)`);
}

drawChart();
