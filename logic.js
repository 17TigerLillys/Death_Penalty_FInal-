// Get references to the tbody element, input field and button
var $tbody = document.querySelector("tbody");
var $stateInput = document.querySelector("#state");
var $searchBtn = document.querySelector("#search");
var $sexInput = document.querySelector("#sex");

var $dateInput = document.querySelector("#date");
var $regionInput = document.querySelector("#region");
var $nameInput = document.querySelector("#name");
var $raceInput = document.querySelector("#race");
var $methodInput = document.querySelector("#method");
var $volInput = document.querySelector("#vol");
//var $durationInput = document.querySelector("#duration");


// Add an event listener to the searchButton, call handleSearchButtonClick when clicked
$searchBtn.addEventListener("click", handleSearchButtonClick);
// Set filteredconvictes to convictData initially
var filteredConvicts = [];
for(var i = 0; i < Object.keys(exc_data).length; i++){
  value = exc_data[Object.keys(exc_data)[i]]
  filteredConvicts.push(value);
}
all_convicts = filteredConvicts
function length_(data) {
  var length= 0;
for(var key in data) {
    if(data.hasOwnProperty(key)){
        length++;
    }
}
return length
}

//console.log(length)
//console.log(filteredConvicts.State)
// renderTable renders the filteredconvictes to the tbody
function renderTable() {
  $tbody.innerHTML = "";
  //console.log(filteredConvicts)
  for (var i = 0; i < length_(filteredConvicts); i++) {
    // Get get the current convict object and its fields
    var convict = filteredConvicts[i];
    var fields = Object.keys(convict);
    //console.log(convict)
    // Create a new row in the tbody, set the index to be i + startingIndex
    var $row = $tbody.insertRow(i);
    for (var j = 0; j < fields.length; j++) {
      // For every field in the convict object, create a new cell at set its inner text to be the current value at the current convict's field
      var field = fields[j];
      var $cell = $row.insertCell(j);
      $cell.innerText = convict[field];
    }
  }
  //console.log(filteredConvicts)
}
function handleSearchButtonClick() {
  // Format the user's search by removing leading and trailing whitespace, lowercase the string
  // Set filteredconvictes to an array of all convictes whose "state" matches the filter
  var filtername = $nameInput.value.trim().toLowerCase();
  var filterState = $stateInput.value.trim().toLowerCase();
  var filtersex = $sexInput.value.trim().toLowerCase();
  var filterDate = $dateInput.value.trim().toLowerCase();
  var filterregion = $regionInput.value.trim().toLowerCase();
  var filterRace = $raceInput.value.trim().toLowerCase();
  var filterVol = $volInput.value.trim().toLowerCase();
  //console.log(filterState)

  if (filterState !=="") {
  filteredConvicts = all_convicts.filter(function(convict) {
    var convictState = convict["State"].toLowerCase();
    var filterState = $stateInput.value.trim().toLowerCase();
    return convictState === filterState;
  }); }

    if (filtersex !=="") {
    filteredConvicts = filteredConvicts.filter(function(convict) {
    var filtersex = $sexInput.value.trim().toLowerCase();
    var convictsex = convict["Sex"].toLowerCase();
    return convictsex === filtersex;
  }) };

    if (filtername !=="") {
    filteredConvicts = filteredConvicts.filter(function(convict) {
      var filtername = $nameInput.value.trim().toLowerCase();
      var convictname = convict["Name"].toLowerCase();
      return convictname === filtername;
  })  }; 

    if (isNaN(filterDate)) {
    filteredConvicts = filteredConvicts.filter(function(convict) {
      var filterDate = Date.parse($dateInput.value);
      var convictDate = Date.parse(convict["Date"]);
      return convictDate === filterDate;
  }); }

    if (filterRace !=="") {
    filteredConvicts = filteredConvicts.filter(function(convict) {
      var filterRace = $raceInput.value.trim().toLowerCase();
      var convictrace = convict["Race"].toLowerCase();
      return convictrace === filterRace;
  })  }; 

        if (filterregion !=="") {
    filteredConvicts = filteredConvicts.filter(function(convict) {
      var filterregion = $regionInput.value.trim().toLowerCase();
      var convictregion = convict["Region"].toLowerCase();
      return convictregion === filterregion;
  })  }; 


  renderTable();
}
// Render the table for the first time on page load
renderTable();
