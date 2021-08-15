// TITLE
console.log("Step 1");

var graymap = L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  }
);

// MAP OPTIONS
var map = L.map("map", {
  center: [
    40.7, -94.5
  ],
  zoom: 3
});

// GRAYMAP
graymap.addTo(map);

// AJAX
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {

  // EARTHQUAKE STYLE
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.geometry.coordinates[2]),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  // FUNCTION MAGNITUDE EARTHQUAKE
  function getColor(depth) {
    switch (true) {
    case depth > 90:
      return "#800026";
    case depth > 70:
      return "#BD0026";
    case depth > 50:
      return "#E31A1C";
    case depth > 30:
      return "#FC4E2A";
    case depth > 10:
      return "#FD8D3C";
    default:
      return "#FED976";
    }
  }

  // RADIUS
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude * 4;
  }

  // GeoJSON layer
  L.geoJson(data, {
    // circleMarker 
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    //  style circleMarker
    style: styleInfo,
    //popup 
    onEachFeature: function(feature, layer) {
      layer.bindPopup(
        "Magnitude: "
          + feature.properties.mag
          + "<br>Depth: "
          + feature.geometry.coordinates[2]
          + "<br>Location: "
          + feature.properties.place
      );
    }
  }).addTo(map);

  // Legends CONTROL
  var legend = L.control({
    position: "bottomright"
  });

  // Details
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");

    var grades = [-10, 10, 30, 50, 70, 90];
    var colors = [
      "#98ee00",
      "#d4ee00",
      "#eecc00",
      "#ee9c00",
      "#ea822c",
      "#ea2c2c"
    ];

    // INTERVALS.
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
      + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };

  // LEGENDS.
  legend.addTo(map);
});
