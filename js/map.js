var map = null; //made it global so mutliple functions could access it

// Function to draw your map
var drawMap = function() {

  // Create map and set view 
  map = L.map('container').setView([37.87222, -96.21528], 4); //googled center of USA :)

  // Create a tile layer variable using the appropriate url
  var layer = L.tileLayer('https://api.mapbox.com/v4/mapbox.dark/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYmllZ21hbiIsImEiOiJZVmhQbjRRIn0.-5x1gakyhj02duK_QKQEqg');

  // Add the layer to your map
  layer.addTo(map);

  // Execute your function to get data
  getData();
}

// Function for getting data
var getData = function() {

  // Execute an AJAX request to get the data in data/response.js
	$.ajax({
		type: "get",
		url: "data/response.json",
		success: function( data ) {
			customBuild(data);
		},
		dataType: "json"
	});

  // When your request is successful, call your customBuild function

}

// Loop through your data and add the appropriate layers and points
var customBuild = function(data) {
	//creates all of the layer groups
	var unknown = L.layerGroup();
	var kids = L.layerGroup();
	var teens = L.layerGroup();
	var twenties = L.layerGroup();
	var thirties = L.layerGroup();
	var fourties = L.layerGroup();
	var fifties = L.layerGroup();
	var sixties = L.layerGroup();
	var seventies = L.layerGroup();
	var eighties = L.layerGroup();
	var nineties = L.layerGroup();
	var hundreds = L.layerGroup();

	//creates all table variables
	var maleArmed = 0;
	var maleUnarmed = 0;
	var femaleArmed = 0;
	var femaleUnarmed = 0;

	//loops through all data points
	for (var i = 0; i < data.length; i++) {
		//finds current vals for all table variables
		if(data[i]["Victim's Gender"] == "Male"){
			if(data[i]["Armed or Unarmed?"] == "Armed"){
				maleArmed++;
			} else {
				maleUnarmed++;
			} 
		} else {
			if(data[i]["Armed or Unarmed?"] == "Armed"){
				femaleArmed++;
			} else {
				femaleUnarmed++;
			}
		}


		//adds data to table
		$("#male-row td:nth-child(2)").text(maleArmed);
		$("#male-row td:nth-child(3)").text(maleUnarmed);
		$("#female-row td:nth-child(2)").text(femaleArmed);
		$("#female-row td:nth-child(3)").text(femaleUnarmed);

		//creats circle for each data point
		var circleColor = data[i]["Hit or Killed?"] == "Killed" ? "red" : "lightGray"; 
		var circle = new L.circleMarker([data[i].lat, data[i].lng], {
			color : circleColor,
			stroke: false,
			radius: 5,
			fillOpacity: .4 
		});

		//adds popup text to circle
		circle.bindPopup("<p>" + data[i].Summary + "</p> <a href='" + data[i]["Source Link"] + "'>Source Link </a>");

		//checks which group to add the circle to
		if (data[i]["Victim's Age"] == null) {
			unknown.addLayer(circle);
		} else {

			var age = parseInt(data[i]["Victim's Age"]);

			if (age < 10) {
				circle.addTo(kids);
			} else if (age < 20) {
				circle.addTo(teens);
			} else if (age < 30) {
				circle.addTo(twenties);
			} else if (age < 40) {
				circle.addTo(thirties);
			} else if (age < 50) {
				circle.addTo(fourties);
			} else if (age < 60) {
				circle.addTo(fifties);
			} else if (age < 70) {
				circle.addTo(sixties);
			} else if (age < 80) {
				circle.addTo(seventies);
			} else if (age < 90) {
				circle.addTo(eighties);
			} else if (age < 100){
				circle.addTo(nineties);
			}  else {
				circle.addTo(hundreds);
			}
		}
	};

	//adds all layerGroups to var
	var ages = {
		"Unknown" : unknown,
		"Kids" : kids,
		"Teens" : teens,
		"Twenties" : twenties,
		"Thirties" : thirties,
		"Fourties" : fourties,
		"Fifties" : fifties,
		"Sixties" : sixties,
		"Seventies" : seventies,
		"Eighties" : eighties,
		"Nineties" : nineties,
		"Hundreds" : hundreds
	};

	// Be sure to add each layer to the map
	unknown.addTo(map);
	kids.addTo(map);
	teens.addTo(map);
	twenties.addTo(map);
	thirties.addTo(map);
	fourties.addTo(map);
	fifties.addTo(map);
	sixties.addTo(map);
	seventies.addTo(map);
	eighties.addTo(map);
	nineties.addTo(map);
	hundreds.addTo(map);

	// Once layers are on the map, add a leaflet controller that shows/hides layers
  	L.control.layers(null,ages).addTo(map);

  	//add event handler to update point count
  	$(".leaflet-control-layers-selector").click(function() {
  		countPoints();
  	});

  	//updat point count for page start
  	countPoints();
}

var countPoints = function() {
	var num = $(".leaflet-clickable").size();
	$("#num-points").text(num);
}


