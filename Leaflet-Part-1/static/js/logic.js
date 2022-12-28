var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

// Perform a GET request to the query URL
d3.json(link, function(data) {
  // get features in to the function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Function for each feature in the features array displaying descriptive popup
  
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3> Where: " + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<br><h2> Magnitude: " + feature.properties.mag + "</h2>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  function createCircleMarker(feature,latlng){
    let options = {
        radius:feature.properties.mag*5,
        fillColor: chooseColor(feature.properties.mag),
        color: chooseColor(feature.properties.mag),
        weight: 1,
        opacity: .8,
        fillOpacity: 0.35
    }
    return L.circleMarker(latlng, options);
}
  
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: createCircleMarker
  });
  
  //funtion to read earthquakes
  createMap(earthquakes);
}

// Function for colours of circles depending on magnitude

function chooseColor(mag) {
  
  switch(true) {

      case (1.0 <= mag && mag <= 2.5):
        return "#0071BC";
      case (2.5 <= mag && mag <= 4.0):
        return "#35BC00";
      case (4.0 <= mag && mag <= 5.5):
        return "#BCBC00";
      case (5.5 <= mag && mag <= 7.0):
        return "#BC3500";
      case (7.0 <= mag && mag <= 15.0):
        return "#BC0000";
      default:
        return "#E2FFAE";
  }
}

var legend = L.control({position: 'bottomleft'});

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [1.0, 2.5, 4.0, 5.5, 7.0],
        labels = [];

    // generate labels
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + chooseColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
};

function createMap(earthquakes) {

  // Define outdoors and lightmap layers
  var outdoorsmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "outdoors-v11",
    accessToken: API_KEY
  });

  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  });

  // base map object 
  var baseMaps = {
    "Outdoors Map": outdoorsmap,
    "Light Map": lightmap
  };

  // Create overlay object for overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create map with the streetmap and earthquakes layers to display 
  var myMap = L.map("map", {
    center: [
      39.8282, -98.5795
    ],
    zoom: 4,
    layers: [outdoorsmap, earthquakes]
  });

  // layer control
  
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
  legend.addTo(myMap);
}