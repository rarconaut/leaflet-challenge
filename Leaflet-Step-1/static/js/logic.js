// Homework 17-Leaflet Challenge - Step 1
// Based on Activity 17.1 10-Stu_GeoJson

// Store our USGS "USGS Significant Earthquakes, Past Month" API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function (data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place, magnitude, rms-power, tsunami status,
    // and time of the earthquake
    function markerSize(feature) {
        console.log(feature);
        return feature ** 1.75;
    };

    function markerColor(feature) {
        console.log(feature)
        return feature >= 4 & feature < 5 ? 'yellow' :
            feature >= 5 & feature < 6 ? 'orange' :
                feature >= 6 ? 'red' :
                    "white";
    };

    // Tsunami status function
    function tsunami(feature) {
        // console.log(feature.properties.tsunami);
        // if (feature.properties.tsunami = 0) {
        //     return "None";
        // }
        // else {
        //     return "Yes";
        // };
        return feature == 0 ? 'None' :
            "Yes";
    }

    function onEachFeature(feature, layer) {
        layer.bindPopup(
            `<h3> ${feature.properties.place} </h3>`
            + `<hr><p> 
                Magnitude: ${feature.properties.mag} 
                <br>RMS: ${feature.properties.rms}`
            + "<br>Tsunami: " + tsunami(feature.properties.tsunami) + "</p>"
            + `<hr><p> ${new Date(feature.properties.time)} </p>`
        );
    };

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array

    // var geojsonMarkerOptions = {
    //     radius: markerSize(feature),
    //     fillColor: "#ff7800",
    //     color: "#000",
    //     weight: 1,
    //     opacity: 1,
    //     fillOpacity: markerColor(feature)
    // };

    // L.geoJSON(someGeojsonFeature, {
    //     pointToLayer: function (feature, latlng) {
    //         return L.circleMarker(latlng, geojsonMarkerOptions);
    //     }
    // }).addTo(map);

    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function (feature, latlng) {
            // geojsonMarkerOptions
            return L.circleMarker(latlng, {
                radius: markerSize(feature.properties.mag),
                fillColor: markerColor(feature.properties.mag),
                weight: 1,
                fillOpacity: .75
            });
        },
        onEachFeature: onEachFeature
    });

    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
}

function createMap(earthquakes) {

    // Define streetmap and darkmap layers
    var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/satellite-v9",
        accessToken: API_KEY
    });

    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "dark-v10",
        accessToken: API_KEY
    });

    // Define a baseMaps object to hold our base layers
    var baseMaps = {
        "Satellite Map": satellitemap,
        "Dark Map": darkmap
    };

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        "Significant Earthquakes (30 Day)": earthquakes
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
        center: [21.30, -12.82],
        zoom: 1.5,
        layers: [satellitemap, earthquakes]
    });

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

        var legend = L.control({
            position: "bottomleft"
        });

        // When the layer control is added, insert a div with the class of "legend"
        legend.onAdd = function () {
            var div = L.DomUtil.create("div", "legend");
            return div;
        };

        legend.addTo(myMap);

        // Call the updateLegend function to update the legend
        var updatedAt = data.features.metadata.generated;

        updateLegend(updatedAt);
    }


    // Update the legend's innerHTML with the last updated time and station count
    function updateLegend(updatedAt) {
        document.querySelector(".legend").innerHTML = [
            '<p><strong>Magnitude</strong></p>' 
            +'<i class="circle" style="background:white"></i>' + "<p> <4 </p>"
            +"<p>Updated: " + new Date(updatedAt) + "</p>",
        ].join("");




    // var legend = L.control({ position: 'bottomleft' });
    // legend.onAdd = function () {
    //     var div = L.DomUtil.create('div', 'legend');
    //     labels = ['<strong>Magnitude</strong>'],
    //         categories = ['<4', '4-5', '5-6', '6+'];
    //     legendColors = ['white', 'yellow', 'orange', 'red']

    //     for (var i = 0; i < categories.length; i++) {

    //         div.innerHTML +=
    //             labels.push(
    //                 '<i class="circle" style="background:' + legendColors[i] + '"></i> '
    //             );

    //     }
    //     div.innerHTML = labels.join('<br>');
    //     return div;
    // };
    // legend.addTo(map);
};

// feature >= 4 & feature < 5 ? 'yellow' :
//     feature >= 5 & feature < 6 ? 'orange' :
//         feature >= 6 ? 'red' :
//             "white";