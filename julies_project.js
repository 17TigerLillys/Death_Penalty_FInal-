// Define SVG area dimensions
var svgWidth = 900;
var svgHeight = 500;

// Define the chart's margins as an object
var chartMargin = {
  top: 50,
  right: 200,
  bottom:150,
  left: 150
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


// var toolTip = d3.tip()
//   .attr("class", "d3-tip")
//   .offset([80, -60])
//   .html(function(data){
//     var country = data.Country;
//     var executed = +data.Executed;
//     var deathSentence = +data.Death_Sentence;
//     return (country + "<br> Executed: "+ executed +"<br> While rendering: "+ deathSentence + "<br> death sentences.")
//   });
//     svg.call(toolTip);

// Load data from death_penalty.csv
d3.csv("death_penalty2.csv", function(error, dp) {
  console.log(dp[0]);

  // Throw an error if one occurs
  if (error) throw error;

  // Print the data
  console.log(dp);

  dp.forEach(function(data) {
    data.Executed = +data.Executed;
    data.Death_Sentence = +data.Death_Sentence;
  })
  // Set the domain of the band scale to the names of countries in death_penalty.csv
  xBandScale.domain(dp.map(function(dpData) {
    return dpData.Country;
  }));

  // Set the domain of the linear scale to 0 and the largest number of executions vs sentencing
  yLinearScale1.domain([0, d3.max(dp, function(data) {
    return data.Executed;
  })]);

    yLinearScale2.domain([0, d3.max(dp, function(data) {
    return data.Executed;
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
          .attr("fill", "green")
          .attr("x", function(dp) {
            return xBandScale(dp.Country);
          })
          .attr("y", function(dp) {
            console.log(dp.Country, dp.Executed, yLinearScale1(dp.Executed))
            return yLinearScale1(dp.Executed);
          })
          .attr("opacity", .5)
          .attr("width", xBandScale.bandwidth())
          .attr("height", function(dp) {
            return chartHeight - yLinearScale1(dp.Executed)
          // .on("click", function(data){
          //   toolTip.show(data);
          // })
          // .on("mouseout", function(data, index){
          //   toolTip.hide(data);
          // })
          });
          // .on('mouseover', toolTip.show);
          // .on('mouseout', toolTip.hide);

  svg
    .selectAll(".bar2")
      .data(dp)
      .enter()
        .append("rect")
          .attr("class", "bar")
          .attr("fill", "red")
          .attr("x", function(dp) {
            return xBandScale(dp.Country);
          })
          .attr("y", function(dp) {
            // console.log(dp.Country, dp.Death_Sentence, yLinearScale2(dp.Death_Sentence))
            return yLinearScale2(dp.Death_Sentence);
          })
          .attr("opacity", .5)
          .attr("width", xBandScale.bandwidth())
          .attr("height", function(dp) {
            return chartHeight - yLinearScale2(dp.Death_Sentence);
          });
  // Append two SVG group elements to the SVG area, create the bottom and left axes inside of them
  svg.append("g")
  .attr("class", "bar1")
  .call(leftAxis);

  svg.append("g")
    .attr("transform", "translate(0, " + chartHeight + ")")
    .call(bottomAxis)
    .selectAll("text")
    .attr("y", 0)
    .attr("x", 9)
    .attr("dy", ".35em")
    .attr("transform", "rotate(90)")
    .style("text-anchor", "start");

  // svg.append("g")
  // // Define the color of the axis text
  // .attr("class", "bar2")
  // .attr("transform", "translate(" + chartMargin.top + chartWidth + ",0)")

  svg.append("g")
    .attr("class", "bar2")
    .call(rightAxis)
    .attr("transform", "translate(" + chartWidth +",0)")

  // svg.append("g")
  //   .attr("class", "bar2")
    .append("text")
      .attr("transform", "rotate(90)", "translate(" + chartWidth +",0")
      .attr("y", 0 - (chartHeight)/4)
      // .attr("x", chartWidth + (chartHeight/2))
      .attr("dy", "1em")
      .attr("font-size", "16px")
      .attr("class", "axisText")
      .text("Death Sentences");


svg.append("g")
  .attr("class", "bar1")
  .call(leftAxis)
  .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - (chartMargin.left/2))
      .attr("x", 0 - (chartHeight/20))
      .attr("dy", "1em")
      .attr("font-size", "16px")
      .attr("class", "axisText")
      .text("Executions");


// Append x-axis labels
  svg.append("text")
    .attr("transform", "translate(" + (chartWidth / 4.5) + " ," + (chartHeight + chartMargin.top + 60) + ")")
    .attr("class", "axisText")
    .attr("font-size", "16px")
    .text("Comparison of Executions vs. Death Sentences");

  svg.append("text")
    .attr("transform", "translate(" + 100 + " ," + (chartHeight + chartMargin.top + 85) + ")")
    .attr("class", "axisText")
    .attr("font-size", "16px")
    .text("Top Executing Countries between 2007 and 2012 (excluding China)");
});



