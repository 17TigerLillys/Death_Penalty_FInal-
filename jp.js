
// Define SVG area dimensions
var svgWidth = 480;
var svgHeight = 250;

// Define the chart's margins as an object
var chartMargin = {
  top: 50,
  right: 75,
  bottom: 75,
  left: 100
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3
  .select("#svg-area")
  .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth)
    // Append a group to the SVG area and shift ('translate') it to the right and to the bottom
    .append("g")
      .attr("transform", "translate(" + chartMargin.left + ", " + chartMargin.top + ")");

// Configure a band scale with a range between 0 and the chartWidth and a padding of 0.1 (10%)
var xBandScale = d3.scaleBand().range([0,chartWidth]).padding(0.1);

// Create a linear scale, with a range between the chartHeight and 0.
var yLinearScale1 = d3.scaleLinear().range([chartHeight, 0]);
var yLinearScale2 = d3.scaleLinear().range([chartHeight, 0]);

// Load data from death_penalty.csv
d3.csv("executing_countries.csv", function(error, dp) {
  console.log(dp[0]);

  // Throw an error if one occurs
  if (error) throw error;

  // Print the data
  console.log(dp);

  var parseTime = d3.timeParse("%Y");

  dp.forEach(function(data) {
    data.year = parseTime(data.year);
    data.Executing_countries = +data.Executing_countries;
    data.Abolitionist = +data.Abolitionist;
  })
  // Set the domain of the band scale to the names of countries in death_penalty.csv
  xBandScale.domain(dp.map(function(dpData) {
    return dpData.Year;
  }));

  // Set the domain of the linear scale to 0 and the largest number of executions vs sentencing
  yLinearScale1.domain([0, d3.max(dp, function(data) {
    return data.Abolitionist;
  })]);

    yLinearScale2.domain([0, d3.max(dp, function(data) {
    return data.Abolitionist;
  })]);

  // Create two new functions passing our scales in as arguments
  // These will be used to create the chart's axes
  var bottomAxis = d3.axisBottom(xBandScale);
  var leftAxis = d3.axisLeft(yLinearScale1).ticks(20);
  var rightAxis = d3.axisRight(yLinearScale2).ticks(20);

  // d3 provides a variety of color schemes represented by arrays of hexidemical color values
  var colors = d3.schemeCategory20;
  console.log(colors);
  // Create one SVG rectangle per piece of 
  // Use the linear and band scales to position each rectangle within the chart
  svg
    .selectAll(".bar1")
      .data(dp)
      .enter()
        .append("rect")
          .attr("class", "bar")
          .attr("x", function(dp) {
            return xBandScale(dp.Year);
          })
          .attr("y", function(dp) {
            console.log(dp.Year, dp.Executing_countries, yLinearScale1(dp.Executing_countries))
            return yLinearScale1(dp.Executing_countries);
          })
          .attr("fill", "green")
          .attr("opacity", .99)
          .attr("width", xBandScale.bandwidth())
          .attr("height", function(dp) {
            return chartHeight - yLinearScale1(dp.Executing_countries);
          });

  svg
    .selectAll(".bar2")
      .data(dp)
      .enter()
        .append("rect")
          .attr("class", "bar")
          .attr("x", function(dp) {
            return xBandScale(dp.Year);
          })
          .attr("y", function(dp) {
            console.log(dp.Year, dp.Abolitionist, yLinearScale2(dp.Abolitionist))
            return yLinearScale2(dp.Abolitionist);
          })
          .attr("width", xBandScale.bandwidth())
          .attr("fill", "blue")
          .attr("opacity", .25)
          .attr("height", function(dp) {
            return chartHeight - yLinearScale2(dp.Abolitionist);
          });
  // Append two SVG group elements to the SVG area, create the bottom and left axes inside of them
  svg.append("g")
    .attr("class", "bar1")
    .call(leftAxis)
;

  svg.append("g").attr("transform", "translate(0, " + chartHeight + ")")
    .call(bottomAxis)


  svg.append("g")
  // Define the color of the axis text
    .attr("transform", "translate(" + chartWidth + ",0)")
    .attr("class", "bar3")
    .call(rightAxis)
      .append("text")
      .attr("transform", "rotate(90)", "translate(" + chartWidth +",0")
      .attr("y", 0 - (chartMargin.right)/2)
      .attr("x", 0 + 125)
      .attr("dy", "1em")
      .attr("font-size", "16px")
      .attr("class", "axisText")
      .text("Abolitionist");
    ;

  svg.append("text")
    .attr("transform", "translate(" + (chartWidth / 4.5) + " ," + (chartHeight + chartMargin.top) + ")")
    .attr("class", "axisText")
    .attr("font-size", "16px")
    .text("Comparison of Executing Countries vs. Abolitionist over time");

  svg.append("g")
      .attr("class", "bar1")
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - (chartMargin.left/3))
      .attr("x", 0 - (chartHeight/1.5))
      .attr("dy", "1em")
      .attr("font-size", "16px")
      .attr("class", "axisText")
      .text("Executing Country");
});
