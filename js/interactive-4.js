"use strict";

// Make sure the app variable exist. It should exist, from app.framework6.js
//var app = app || {};

var disableMapControls = false;
var zoomedToArea = false;
var flying = false;
var startDelay = 0; //2000
var totalTime = 60 * 1; // Minutes - should be 60
var mapFiltersLocked = false;
var measurement = false;
var show_oil = false;

// Bounding boxes for specific layers
var bbox_area   = [[9.0088,67.3314],[18.0505,69.7181]];
var bbox_oilwells = [[0.18,	55.65],	[31.73,	77.17]];
// var bbox_roest  = [[11.814423,67.402211],[12.204437,67.542167]];
// var bbox_corals = [[7.9871,67.0074],[16.3368,69.3735]];
// var bbox_roest_and_oil = [[10.7865,67.351],[12.2298,67.64]];

// Set the number of interactive sections - should move it somewhere else
$(".map-features-count p span.total").text($('.map-details').length);

// Color picking for layers
//var colors = chroma.scale(['#fafa6e','#2A4858']).mode('lch').colors(5);
// var colors2 = chroma.scale('YlGnBu').colors(5);
// var colors3 = chroma.scale(['yellow', '008ae5']).mode('lch').colors(5);
// console.log(colors2)

// GeoJSON data sources for MapBox layer
// Get more data layers here: http://maps.imr.no/geoserver/web/?wicket:bookmarkablePage=:org.geoserver.web.demo.MapPreviewPage

var dataSources = [
  {
    name: 'opened_oil_areas',
    data: '../include/map-layers/opened_areas.geojson'
  },
  {
    name: 'oilwells',
    data: '../include/map-layers/wells.geojson'
  },
  // {
  //   name: 'lovese_sea',
  //   data: '../include/map-layers/lovese_blocks.geojson'
  // },
  {
    name: 'oil_prospects',
    data: '../include/map-layers/prospekter_union.geojson'
  }
];

var deferreds = [];
var dataLayerBounds = new Array(dataSources.length);

var mapLayers = new Array(10);
mapLayers["oilwells"] = {added: false,visible: false}
mapLayers["people"] = {added: false,visible: false}
mapLayers["oil_prospects"] = {added: false,visible: false}

// ["#fafa6e", "#86d780", "#23aa8f", "#007882", "#2a4858"]
// ["#ffffd9", "#c7e9b4", "#41b6c4", "#225ea8", "#081d58"]
var mapLayersStyle = new Array(6);
mapLayersStyle["oil_prospects"] = {color: "#000",opacity: 0.8, border_color: "#000"}
mapLayersStyle["opened_oil_areas"] = { color: "#E7A930", opacity: 1, border_color: "#fff"}

var mapIcons = ["heike", "gaute", "odda", "image360_1", "image360_2", "image360_3", "image360_4", "image360_5", "image360_6", "image360_7"];
var addedPeople = false;
var added360Markers = false;

var addedMapIcons = new Array(18);
addedMapIcons["heike"] = {zoomedTo: false,playedVideo: false,clicked: 0,coordinates: []}
addedMapIcons["gaute"] = {zoomedTo: false,playedVideo: false,clicked: 0,coordinates: []}
addedMapIcons["odda"] = {zoomedTo: false,playedVideo: false,clicked: 0,coordinates: []}
addedMapIcons["image360_1"] = {zoomedTo: false,playedVideo: false,clicked: 0,coordinates: []}
addedMapIcons["image360_2"] = {zoomedTo: false,playedVideo: false,clicked: 0,coordinates: []}
addedMapIcons["image360_3"] = {zoomedTo: false,playedVideo: false,clicked: 0,coordinates: []}
addedMapIcons["image360_4"] = {zoomedTo: false,playedVideo: false,clicked: 0,coordinates: []}
addedMapIcons["image360_5"] = {zoomedTo: false,playedVideo: false,clicked: 0,coordinates: []}
addedMapIcons["image360_6"] = {zoomedTo: false,playedVideo: false,clicked: 0,coordinates: []}
addedMapIcons["image360_7"] = {zoomedTo: false,playedVideo: false,clicked: 0,coordinates: []}
// addedMapIcons["bird_island_1"] = {zoomedTo: false,playedVideo: false,clicked: 0,coordinates: []}
// addedMapIcons["bird_island_2"] = {zoomedTo: false,playedVideo: false,clicked: 0,coordinates: []}
// addedMapIcons["bird_island_3"] = {zoomedTo: false,playedVideo: false,clicked: 0,coordinates: []}
// addedMapIcons["bird_island_4"] = {zoomedTo: false,playedVideo: false,clicked: 0,coordinates: []}
// addedMapIcons["bird_island_5"] = {zoomedTo: false,playedVideo: false,clicked: 0,coordinates: []}
// addedMapIcons["corals_1"] = {zoomedTo: false,playedVideo: false,clicked: 0,coordinates: []}
// addedMapIcons["corals_2"] = {zoomedTo: false,playedVideo: false,clicked: 0,coordinates: []}
// addedMapIcons["corals_3"] = {zoomedTo: false,playedVideo: false,clicked: 0,coordinates: []}

var zoomed = new Array(4);
zoomed["first"] = false;
zoomed["heike"] = false;
zoomed["gaute"] = false;
zoomed["odda"] = false;

var paused;
var countdown;

var land_labels_images = [{
    name: "lofoten",
    coordinates: [14.248825694533252, 68.26400752799873],
    imgUrl: "_ICN_LABEL_Lofoten-Archipelago@2x.png",
    localhost: "http://lovese.dev/resources/_Graphics/_GFX_005_EP2_LD/",
    beta: "https://beta.lovese.no/resources/_Graphics/_GFX_005_EP2_LD/",
    live: "https://www.lovese.no/resources/_Graphics/_GFX_005_EP2_LD/"
  },
  {
    name: "vesteralen",
    coordinates: [14.908509488458321, 68.72214903472567],
    imgUrl: "_ICN_LABEL_Vesterålen-Archipelago@2x.png",
    localhost: "http://lovese.dev/resources/_Graphics/_GFX_005_EP2_LD/",
    beta: "https://beta.lovese.no/resources/_Graphics/_GFX_005_EP2_LD/",
    live: "https://www.lovese.no/resources/_Graphics/_GFX_005_EP2_LD/"
  },
  {
    name: "senja",
    coordinates: [17.457677872120883, 69.30793670755747],
    imgUrl: "_ICN_LABEL_Senja-Archipelago@2x.png",
    localhost: "http://lovese.dev/resources/_Graphics/_GFX_005_EP2_LD/",
    beta: "https://beta.lovese.no/resources/_Graphics/_GFX_005_EP2_LD/",
    live: "https://www.lovese.no/resources/_Graphics/_GFX_005_EP2_LD/"
  }
];

var people = {
  "type": "FeatureCollection",
  "features": [{
      "type": "Feature",
      "properties": {
        "title": "Heike",
        "name": "heike",
        "iconSize": [42, 42],
        "imgPath": "EP4/",
        "imgName": "heike@3x"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          14.22199493102596,
          68.1608805347768
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "title": "Gaute",
        "name": "gaute",
        "iconSize": [42, 42],
        "imgPath": "EP4/",
        "imgName": "gaute@3x"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          14.440113443757042,
          68.21202830918577
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "title": "Odd Arne",
        "name": "odda",
        "iconSize": [42, 42],
        "imgPath": "EP4/",
        "imgName": "odda@3x"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          14.487515572335155,
          68.21044769739109
        ]
      }
    }
  ]
};

var images360 = {
  "type": "FeatureCollection",
  "features": [{
      "type": "Feature",
      "properties": {
        "title": "Verøy",
        "name": "image360_1",
        "iconSize": [42, 42],
        "imgPath": "_GFX_006_EP3_BG/",
        "imgName": "_ICN_BTN_360@3x"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          12.621902777778,
          67.658158333333
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "title": "Sørlandsvågen",
        "name": "image360_2",
        "iconSize": [42, 42],
        "imgPath": "_GFX_006_EP3_BG/",
        "imgName": "_ICN_BTN_360@3x"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          12.725080555556,
          67.648355555556
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "title": "Nordland",
        "name": "image360_3",
        "iconSize": [42, 42],
        "imgPath": "_GFX_006_EP3_BG/",
        "imgName": "_ICN_BTN_360@3x"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          12.729925,
          67.694366666667
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "title": "Værøy",
        "name": "image360_4",
        "iconSize": [42, 42],
        "imgPath": "_GFX_006_EP3_BG/",
        "imgName": "_ICN_BTN_360@3x"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          12.700561111111,
          67.654016666667
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "title": "Ramberg",
        "name": "image360_5",
        "iconSize": [42, 42],
        "imgPath": "_GFX_006_EP3_BG/",
        "imgName": "_ICN_BTN_360@3x"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          13.223294444444,
          68.100188888889
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "title": "Festvågtind",
        "name": "image360_6",
        "iconSize": [42, 42],
        "imgPath": "_GFX_006_EP3_BG/",
        "imgName": "_ICN_BTN_360@3x"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          14.227638888889,
          68.172030555556
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "title": "Henningsvær",
        "name": "image360_7",
        "iconSize": [42, 42],
        "imgPath": "_GFX_006_EP3_BG/",
        "imgName": "_ICN_BTN_360@3x"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          14.214352777778,
          68.147161111111
        ]
      }
    }
  ]
};

var bird_islands = {
  "type": "FeatureCollection",
  "features": [{
      "type": "Feature",
      "properties": {
        "title": "Vedøya",
        "description": "One of the five islands with bird colony mountains.",
        "imgProfile": "https://gfx.nrk.no/j3aqq6gnGPOAADw9d2EdqgHVi2v61F9C4FO7z2g3nisg",
        "name": "bird_island_1",
        "iconSize": [42, 42],
        "imgPath": "_GFX_006_EP3_BG/",
        "imgName": "_ICN_BTN_birds@3x"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [12.018116196083497, 67.48001667342737]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "title": "Storfjellet",
        "description": "One of the five islands with bird colony mountains.",
        "name": "bird_island_2",
        "iconSize": [42, 42],
        "imgPath": "_GFX_006_EP3_BG/",
        "imgName": "_ICN_BTN_birds@3x"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          11.937251472179213,
          67.46210208044724
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "title": "Ellefsnyken",
        "description": "One of the five islands with bird colony mountains.",
        "name": "bird_island_3",
        "iconSize": [42, 42],
        "imgPath": "_GFX_006_EP3_BG/",
        "imgName": "_ICN_BTN_birds@3x"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [11.912297356460783,67.4473372411731]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "title": "Trenyken",
        "description": "One of the five islands with bird colony mountains.",
        "name": "bird_island_4",
        "iconSize": [42, 42],
        "imgPath": "_GFX_006_EP3_BG/",
        "imgName": "_ICN_BTN_birds@3x"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [11.891550507512648,67.43628541535423]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "title": "Hernyken:",
        "name": "bird_island_4",
        "description": "One of the five islands with bird colony mountains.",
        "iconSize": [42, 42],
        "imgPath": "_GFX_006_EP3_BG/",
        "imgName": "_ICN_BTN_birds@3x"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [11.880073225904368,67.4268137592164]
      }
    },
  ]
};

var corals = {
  "type": "FeatureCollection",
  "features": [{
      "type": "Feature",
      "properties": {
        "title": "Træna reef",
        "description": "The Træna reef became a marine protected area in 2012, but the protection is only against fishing equipment. The ovaral area which is protected is 440 km2.",
        "moreInfo": ["http://mpa.ospar.org/home_ospar/mpa_datasheets/an_mpa_datasheet_en?wdpaid=555557208&gid=1956&lg=0", "https://www.protectedplanet.net/traenarevet-marine-protected-area-ospar", "https://www.regjeringen.no/no/aktuelt/verner-ti-korallrev/id2469789/"],
        "name": "corals_1",
        "iconSize": [42, 42],
        "imgPath": "_GFX_006_EP3_BG/",
        "imgName": "_ICN_BTN_corals@3x"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          11.039713114483305, 66.94196228799836
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "title": "Røst reef",
        "name": "corals_2",
        "description" : "The world's largest known deep-water coral reef is located between 300-400 meters below the surface. <br /><br /> It became a marine protected area in 2005, but the protection is only against fishing equipment. The ovaral area which is protected is 305 km2.",
        "moreInfo" : ["http://mpa.ospar.org/home_ospar/mpa_datasheets/an_mpa_datasheet_en?wdpaid=555557142&gid=1824", "https://www.protectedplanet.net/555557142", "https://www.regjeringen.no/no/aktuelt/verner-ti-korallrev/id2469789/"],
        "iconSize": [42, 42],
        "imgPath": "_GFX_006_EP3_BG/",
        "imgName": "_ICN_BTN_corals@3x"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
            9.378126177649193, 67.48767541331077
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "title": "Hola reef",
        "name": "corals_3",
        "description" : "The Hola reef consists of more than 350 single coral reefs, down to 300 meters below the surface. These can be up to 35 meters tall and one km long.",
        "moreInfo" : "",
        "iconSize": [42, 42],
        "imgPath": "_GFX_006_EP3_BG/",
        "imgName": "_ICN_BTN_corals@3x"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          14.38328982835074, 68.92608088745928
        ]
      }
    }
  ]
};

var distanceContainer = document.getElementById('distance');

// GeoJSON object to hold our measurement features
var geojson = {
    "type": "FeatureCollection",
    "features": []
};

// Used to draw a line between points
var linestring = {
    "type": "Feature",
    "geometry": {
        "type": "LineString",
        "coordinates": []
    }
};

mapboxgl.accessToken = 'pk.eyJ1IjoibG92ZXNlIiwiYSI6ImNpeTF0NTIxdzAwODMycWx4anRuc2dteGoifQ.h_sW40YOKtU1XOVyrJlqaw';

var map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/lovese/ciy1xowr100e22rqlyky3qgcg', //hosted style id
  center: [12.9, 68.7], // starting position: lng/lat
  zoom: 6, // starting zoom,
  pitch: 0, // pitch in degrees
  bearing: 0, // bearing in degrees
  attributionControl: false
});

if (disableMapControls) {
  mapControls(true);
}

function mapControls(disable) {
  if (disable) {
    map.scrollZoom.disable();
    map.dragRotate.disable();
    map.dragPan.disable();
    map.touchZoomRotate.disableRotation();
    map.doubleClickZoom.disable();
  } else {
    map.scrollZoom.enable();
    map.dragRotate.enable();
    map.dragPan.enable();
    map.touchZoomRotate.enable();
    map.doubleClickZoom.enable();
  }
}

var d = new Date( "01 " + "January 1966");
var first = d.getFullYear();

var s = new Date( "01 " + "December 2017");
var second = s.getFullYear();
var years = Array();

for(var i = first; i <= second; i++) years.push(i);

function filterBy(year) {
    var filter = ['<=', 'year', years[year]];
    map.setFilter('oilwells', filter);

    // Get features which is visible on the current layer, within the current viewport
    // var features = map.queryRenderedFeatures({ layers: ['wells'] });

    // Set the label to the year
    document.getElementById('year').textContent = years[year];
}

map.on('load', function() {
  map.addSource('geojson', {
      "type": "geojson",
      "data": geojson
  });

  // Add styles to the map
  map.addLayer({
      id: 'measure-points',
      type: 'circle',
      source: 'geojson',
      paint: {
          'circle-radius': 5,
          'circle-color': '#fff'
      },
      filter: ['in', '$type', 'Point']
  });
  map.addLayer({
      id: 'measure-lines',
      type: 'line',
      source: 'geojson',
      layout: {
          'line-cap': 'round',
          'line-join': 'round'
      },
      paint: {
          'line-color': '#fff',
          'line-width': 2.5
      },
      filter: ['in', '$type', 'LineString']
  });

  // Add labels for the land areas (LoVeSe)
  // land_labels_images.forEach(function(label) {
  //   map.loadImage(label.live + label.imgUrl, function(error, image) {
  //     if (error) throw error;
  //     map.addImage(label.name, image);
  //   });
  //
  //   map.addLayer({
  //     "id": label.name,
  //     "type": "symbol",
  //     "source": {
  //       "type": "geojson",
  //       "data": {
  //         "type": "FeatureCollection",
  //         "features": [{
  //           "type": "Feature",
  //           "geometry": {
  //             "type": "Point",
  //             "coordinates": label.coordinates
  //           }
  //         }]
  //       }
  //     },
  //     "maxzoom": 12,
  //     "minzoom": 5,
  //     "layout": {
  //       "icon-image": label.name,
  //       "icon-size": {
  //         "stops": [
  //           [0, 0],
  //           [5, 0.4],
  //           [6, 0.5],
  //           [11, 0.55]
  //         ]
  //       }
  //     }
  //   });
  // });

  // Add geojson sources and calculate the bbox for each layer for later use
  // dataSources.forEach(function(source) {
  //   $.ajax({
  //     beforeSend: function(xhr) {
  //       if (xhr.overrideMimeType) {
  //         xhr.overrideMimeType("application/json");
  //       }
  //     },
  //     dataType: "json",
  //     url: source.data,
  //     success: function(data) {
  //       //var bounds = turf.bbox(data);
  //       map.addSource(source.name, {
  //         type: 'geojson',
  //         data: data
  //       });
  //
  //       if(source.name === 'corals') {
  //         dataLayerBounds[source.name] = bbox_corals;
  //       } else {
  //         dataLayerBounds[source.name] = bbox_area;
  //       }
  //     }
  //   });
  // });

  dataSources.forEach(function(source) {
    deferreds.push(
      $.ajax({
        beforeSend: function(xhr) {
          if (xhr.overrideMimeType) {
            xhr.overrideMimeType("application/json");
          }
        },
        dataType: "json",
        url: source.data,
        layer_name: source.name
      })
    );
  });

  $.when.apply($, deferreds).done(function() {
     for (var i = 0; i < arguments.length; i++) {
       if(this[i].layer_name === "opened_oil_areas") {
         map.addSource(this[i].layer_name, {
           type: 'geojson',
           data: arguments[i][0]
         });

         map.addLayer({
           "id": this[i].layer_name,
           "source": this[i].layer_name,
           "type": "fill",
           "paint": {
             "fill-opacity": mapLayersStyle[this[i].layer_name].opacity,
             "fill-color": mapLayersStyle[this[i].layer_name].color,
             "fill-outline-color": mapLayersStyle[this[i].layer_name].border_color
           }
         }); // Add it before the oil prospects
       } else if(this[i].layer_name==="oilwells") {

          // Create a month property value based on time
          // used to filter against.
          arguments[i][0].features = arguments[i][0].features.map(function(d) {
              //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getDay
              d.properties.date = new Date(d.properties.time).getDate();
              d.properties.day = new Date(d.properties.time).getDay();
              d.properties.month = new Date(d.properties.time).getMonth();
              d.properties.year = new Date(d.properties.time).getFullYear();
              return d;
          });

          map.addSource(this[i].layer_name, {
            type: 'geojson',
            data: arguments[i][0]
          });

          map.addLayer({
              'id': this[i].layer_name,
              'type': 'circle',
              'source': this[i].layer_name,
              "layout": {
              },
              "paint": {
                  "circle-color": 'white',
                  'circle-radius': {
                      "base": 1.1,
                      "stops": [
                        [0, 1],
                        [5, 2],
                        [10, 3],
                        [20, 10]
                      ]
                  }
              },
          });

          dataLayerBounds[this[i].layer_name] = bbox_oilwells;

          // Set filter to first year
          filterBy(0);

          // Update filter on slider change
          document.getElementById('slider').addEventListener('input', function(e) {
              var year = parseInt(e.target.value, 10);
              filterBy(year);
          });
        } else {
          map.addSource(this[i].layer_name, {
            type: 'geojson',
            data: arguments[i][0]
          });
          dataLayerBounds[this[i].layer_name] = bbox_area;
        }
     }
  });

  map.resize();
  $(".interactive-content").fadeOut(1500).promise().done(function() {
    // Fadeout done, start the timer for going through the map (set in top of script)
    $("span.loading-text").hide();
    $("#start-interactive-tour").show();
  });

  map.on("mousedown", function(e) {
    var center = map.getCenter().wrap();
    var zoom = map.getZoom();

    console.log(center, zoom, e.lngLat, e.point);
  });


  map.on('click', function(e) {
    // If measurement is turned on:
    if(measurement) {
      var features = map.queryRenderedFeatures(e.point, { layers: ['measure-points'] });

      // Remove the linestring from the group
      // So we can redraw it based on the points collection
      if (geojson.features.length > 1) geojson.features.pop();

      // Clear the Distance container to populate it with a new value
      distanceContainer.innerHTML = '';

      // If a feature was clicked, remove it from the map
      if (features.length) {
          var id = features[0].properties.id;
          geojson.features = geojson.features.filter(function(point) {
              return point.properties.id !== id;
          });
      } else {
          var point = {
              "type": "Feature",
              "geometry": {
                  "type": "Point",
                  "coordinates": [
                      e.lngLat.lng,
                      e.lngLat.lat
                  ]
              },
              "properties": {
                  "id": String(new Date().getTime())
              }
          };

          geojson.features.push(point);
      }

      if (geojson.features.length > 1) {
          linestring.geometry.coordinates = geojson.features.map(function(point) {
              return point.geometry.coordinates;
          });

          geojson.features.push(linestring);

          // Populate the distanceContainer with total distance
          var value = document.createElement('pre');
          value.textContent = 'Distance: ' + parseFloat(turf.lineDistance(linestring)).toFixed(1) + ' km'; // .toLocaleString()
          distanceContainer.appendChild(value);
      }

      map.getSource('geojson').setData(geojson);
    }
  });

  // Need this?
  map.on('zoomend', function(e) {
    var zoom = map.getZoom();
    if (zoom <= 7) {
      $(".marker-360, .marker-birds").hide();
    } else {
      $(".marker-360, .marker-birds").show();
    }

    if (zoom < 5) {
      $(".marker-corals").hide();
    } else {
      $(".marker-corals").show();
    }
  });

  // Functions for flying to a specific part of the map
  map.on('flystart', function() {
    flying = true;
  });
  map.on('flyend', function() {
    flying = false;
  });
  map.on('moveend', function(e) {
    if (!flying && zoomedToArea) {
      //map.fire(flyend);
      if (zoomed["heike"] || zoomed["gaute"] || zoomed["odda"]) {
        // We have zoomed in on the first interview, so update their marker overlay position accordingly
        //add360Icons(); // Should we move this - or even break it down for each person?
        if(!added360Markers) {
            addMarkers("360", images360);
        }

        // // Enable map filters and map controls
        // mapFiltersLocked = false;
        // mapControls(false);
      }
      zoomedToArea = false; // Always do this
    }

    // Used to be peopleAdded
    if (zoomed["heike"] || zoomed["gaute"] || zoomed["odda"]) {
      updateMarkerOverlayPos();
    }
  });
});

map.on('mousemove', function (e) {
  if(measurement) {
    var features = map.queryRenderedFeatures(e.point, { layers: ['measure-points'] });
    // UI indicator for clicking/hovering a point on the map
    map.getCanvas().style.cursor = (features.length) ? 'pointer' : 'crosshair';
  } else {
    map.getCanvas().style.cursor = 'auto'; // grab doesn't work for some reason
  }
});

function updateMarkerOverlayPos() {
  $(".cd-modal-action").show();
  mapIcons.forEach(function(icon) {
    try {
      // Update the overlay if the map moves
      var point = map.project(addedMapIcons[icon].coordinates);
      $(".cd-modal-action." + icon + " ").css({
        'left': point.x - 19,
        'top': point.y - 19
      });
    } catch (err) {
      console.log(err);
    }
  });
}

// Turn on off fish stock layers
$('input[name="fish_stocks"], input[name="oil_prospects"]').on('click', function () {
    if ($(this).is(':checked')) {
        showMapLayer($(this).attr('data-layer-name'));
    } else {
        removeMapLayer($(this).attr('data-layer-name'));
    }
});

$("#hover-navigation .arrow").on("click", function() {
  if (app.navigation.state == app.navigation.visible) {
    $(".interactive-pane").css({
      "bottom": "130px"
    });
  } else if (app.navigation.state == app.navigation.hidden) {
    $(".interactive-pane").css({
      "bottom": "30px"
    });
  }
});

$("#start-interactive-tour").on("click", function(e) {
  e.preventDefault();
  map.fitBounds(bbox_oilwells);
  //map.setStyle('mapbox://styles/lovese/ciya7qynz006v2rl940yajywr');

  // TODO: Should move this into it's own function
  $(".loading").fadeOut(500);

  $(".container-full").fadeIn("1500");
  $(".interactive-pane-text").css({
    'z-index': 1
  }).show();
  $(".cd-section").css({
    'z-index': 1
  }).show();

  // Show map filters
  $("#map-filters").show();

  // If not running the tour on start:
  //showMapLayer("lovese_land");
  $("#map-filters ul li.oilwells").addClass("active");
});

// Map filter
$("#map-filters ul li").on('click', function() {
  if (!mapFiltersLocked) {
    if($(this).attr('data-layer-name') === "measure") {
      if($(this).hasClass("active")) {
        $(this).removeClass("active");
        measurement = false;
      } else {
        $(this).addClass("active");
        measurement = true;
      }
    } else if($(this).attr('data-layer-name') === "oil_prospects") {
      if($(this).hasClass("active")) {
        $(this).removeClass("active");
        show_oil = false;
        removeMapLayer("oil_prospects");
      } else {
        $(this).addClass("active");
        show_oil = true;
        showMapLayer("oil_prospects");
      }
    } else {
      $(this).siblings().each(function() {
        if(!$(this).hasClass("measure") || !$(this).hasClass("oil")) {
          $(this).removeClass("active");
          // remove any previously set info panes
          $("section[data-layer-name='" + $(this).attr('data-layer-name') + "']").removeClass("active"); // The info pane
        }
      });

      // Remove any visible layers
      for (var prop in mapLayers) {
        if (Object.prototype.hasOwnProperty.call(mapLayers,prop)){
          if(prop !== $(this).attr('data-layer-name') && mapLayers[prop].visible){
              removeMapLayer(prop);
              mapLayers[prop].visible = false;
              // Uncheck all checkboxes, except the cod checkbox
              $("input[type='checkbox']").prop( "checked", false );
              $("input[type='checkbox']#cod").prop( "checked", true );
          }
        }
      }

      $(this).addClass("active");
      // Set the current info pane number based on index of the section
      $(".map-features-count p span.current").text($(this).index() + 1);

      // Turn on this map layer
      showMapLayer($(this).attr('data-layer-name'));
      // Update the info pane which corresponds to the button
      $("section[data-layer-name='" + $(this).attr('data-layer-name') + "']").addClass("active");
    }
  }
});

// Interviewees pane - move to the area of the person on click
$(".interview").on('click', function() {
  $(this).siblings().each(function() {
    $(this).removeClass("active");
  });
  $(this).addClass("active");
  var person = $(this).attr('data-person');
  zoomToPerson(person);
});

// Hover function for 360 images - not working??
$('[data-type="modal-trigger"]').hover(function() {
  var currMarker = "image360_" + $(this).parent().attr('data-id');
  $('.marker-360[data-name="' + currMarker + '"]').css("background-image", "url(../resources/_Graphics/_GFX_006_EP3_BG/_ICN_BTN_360_Inverted@3x.png)");
  // .addClass('animated bounceIn') // Animation of the marker resets it's position (does the element need to be inline or just add display:block?)
}, function(e) {
  // on mouseout, reset the background
  var currMarker = "image360_" + $(this).parent().attr('data-id');
  $('.marker-360[data-name="' + currMarker + '"]').css("background-image", "url(../resources/_Graphics/_GFX_006_EP3_BG/_ICN_BTN_360@3x.png)");
});

// Add a given map layer to the map, except the islands layer - which has no layer
function showMapLayer(layer) {
  if (layer !== undefined || layer !== null || typeof layer !== "undefined" && layer !== "lovese_land" && layer !== "oilwells" && layer !== "people") {
    if (mapLayers[layer].visible == false) {
      if (!mapLayers[layer].added && layer !== "lovese_land" && layer !== "oilwells" && layer !== "people") {
        if (layer === "corals") {
          // Style specification: https://www.mapbox.com/mapbox-gl-js/style-spec/
          map.addLayer({
            "id": "corals",
            "type": "circle",
            "source": "corals",
            'layout': {
              'visibility': 'visible'
            },
            "paint": {
              'circle-radius': 5,
              'circle-opacity': 0.5,
              'circle-color': 'rgba(172,255,178,1)'
            },
            "filter": ["==", "$type", "Point"],
          });
        } else {
          map.addLayer({
            "id": layer,
            "source": layer,
            "type": "fill",
            "paint": {
              "fill-opacity": mapLayersStyle[layer].opacity,
              "fill-color": mapLayersStyle[layer].color,
              "fill-outline-color": mapLayersStyle[layer].border_color
            }
          }, 'lofoten'); // Add it before the oil prospects
        }
        mapLayers[layer].added = true;
      }

      if (layer !== "lovese_land" && layer !== "oilwells" && layer !== "people" && layer !== "oil_prospects") {
        map.setLayoutProperty(layer, 'visibility', 'visible');
        mapLayers[layer].visible = true;

        // Fit the map to the bounderies of the specific layer
        map.fitBounds(dataLayerBounds[layer], {padding: 30, linear: false, duration: 2000, offset: [200,0]});
      }

      if(layer === "corals") {
          addMarkers("corals", corals);
      }

      if(layer === "oil_prospects") {
        map.setLayoutProperty(layer, 'visibility', 'visible');
        mapLayers[layer].visible = true;

        // Might use this later:
        // if(mapLayers["birds"].visible) {
        //   map.fitBounds(bbox_roest_and_oil, {padding: 30, linear: false, duration: 2000, offset: [200,0]});
        // } else if(mapLayers["corals"].visible) {
        //   map.fitBounds(bbox_corals, {padding: 30, linear: false, duration: 2000, offset: [200,0]});
        // }

        map.fitBounds(dataLayerBounds[layer], {padding: 30, linear: false, duration: 2000, offset: [200,0]});

      }
    }
  }
  if(layer === "lovese_land") {
    map.fitBounds(bbox_area, {padding: 30, linear: false, duration: 2000, offset: [200,0]});
  }
  if (layer === "people") {
    addMarkers("people", people);
  }
}

// Remove a given map layer, except the islands layer - which has no layer
function removeMapLayer(layer) {
  if (layer !== undefined || layer !== null || typeof layer !== "undefined" && layer !== "lovese_land" && layer !== "oilwells" && layer !== "people") {
    if (mapLayers[layer].visible == true && layer !== "lovese_land" && layer !== "oilwells" && layer !== "people") {
      map.setLayoutProperty(layer, 'visibility', 'none');
      // if (layer === "lovese_sea") {
      //   map.setLayoutProperty("lovese-labels", 'visibility', 'none');
      // }
      mapLayers[layer].visible = false;
    }
  }
  if(layer === "oilwells") {
    mapLayers[layer].visible = false;
  }
}

// Add markers to the map
function addMarkers(name, markers) {
  markers.features.forEach(function(marker) {
    // create a DOM element for the marker
    var el = document.createElement('div');
    el.className = 'marker-' + name;

    el.style.backgroundImage = 'url(../resources/_Graphics/' + marker.properties.imgPath + marker.properties.imgName + '.png)';
    el.style.width = marker.properties.iconSize[0] + 'px';
    el.style.height = marker.properties.iconSize[1] + 'px';

    //var point = map.project(marker.geometry.coordinates);
    addedMapIcons[marker.properties.name].coordinates = marker.geometry.coordinates;

    if(name === "people") {
      addedPeople = true;
      el.addEventListener('click', function() {
        zoomToPerson(marker.properties.name);
      });
    } else if (name === "birds" || name === "corals") {
      el.addEventListener('click', function() {
        // Add reference to function which will handle stuff from here.
        // Add popup handler here.
      });
      el.addEventListener('mouseover', function (e) {
        $(this).css("background-image", "url(../resources/_Graphics/_GFX_006_EP3_BG/_ICN_BTN_"+name+"_Inverted@3x.png)");
      });
      el.addEventListener('mouseout', function (e) {
        $(this).css("background-image", "url(../resources/_Graphics/_GFX_006_EP3_BG/_ICN_BTN_"+name+"@3x.png)");
      });
    } else if (name === '360') {
      added360Markers = true;
    }

    if(name === "birds" || name === "corals") {
      new mapboxgl.Marker(el)
        .setLngLat(marker.geometry.coordinates)
        .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
        .setHTML('<h3>' + marker.properties.title + '</h3><p>' + marker.properties.description + '</p>'))
        .addTo(map);
    } else {
      new mapboxgl.Marker(el)
        .setLngLat(marker.geometry.coordinates)
        .addTo(map);
    }
  });
}

// Zoom the map to a given person
function zoomToPerson(name) {
  // zoomElement, center, zoom, speed, curve, pitch, bearing, offset
  zoomToArea(name, addedMapIcons[name].coordinates, 11.5, 1, 1, 150, -10, [350, 0]);
  addedMapIcons[name].zoomedTo = true;
  addedMapIcons[name].clicked += 1;
}

// Not in use
// function setSizes() {
//   // Currently not in use
//   var containerHeight = $(".interactive-pane").height();
//   $(".interactive-pane").height(containerHeight - 130);
// }

// Zoom to a given area
function zoomToArea(zoomElement, center, zoom, speed, curve, pitch, bearing, offset) {
  if (app.navigation.state == app.navigation.visible) {
    $(".interactive-pane").css({
      "bottom": "30px"
    });
    app.navigation.toggle(); // toggle the nav
  }
  zoomed[zoomElement] = true;
  zoomedToArea = true;
  map.flyTo({
    center: center, //[12.901721434467618,68.71391887946749],
    zoom: zoom,
    offset: offset,
    // For perspective on the zoom - implement this to handle specific sections (oil prospects etc.)
    pitch: pitch, // pitch in degrees - 80
    bearing: bearing, // bearing in degrees - 15

    // These options control the flight curve, making it move
    // slowly and zoom out almost completely before starting
    // to pan.
    speed: speed, //0.5, // make the flying slow
    curve: curve, //1.5, // change the speed at which it zooms out

    // This can be any easing function: it takes a number between
    // 0 and 1 and returns another number between 0 and 1.
    easing: function(t) {
      return t;
    }
  });
}


// Open videos and 360s:
$('[data-type="modal-trigger"]').on('click', function(e) {
  e.preventDefault();
  var contentUrl = "";

  https: //vimeo.com/200725736
    if ($(this).parent().attr('data-type') == 'person') {
      switch ($(this).parent().attr('data-id')) {
        case "heike":
          contentUrl = "//player.vimeo.com/video/229464407?byline=0&amp;portrait=0";
          break;
        case "gaute":
          contentUrl = "//player.vimeo.com/video/229463933?byline=0&amp;portrait=0";
          break;
        case "odda":
          contentUrl = "//player.vimeo.com/video/229463490?byline=0&amp;portrait=0";
          break;
      }
    } else
  if ($(this).parent().attr('data-type') == 'images360') {
    switch ($(this).parent().attr('data-id')) {
      case "1":
        contentUrl = "../resources/_360/Veroy.html";
        break;
      case "2":
        contentUrl = "../resources/_360/Veroy.html?vr&s=pano71";
        break;
      case "3":
        contentUrl = "../resources/_360/Veroy.html?vr&s=pano74";
        break;
      case "4":
        contentUrl = "../resources/_360/Veroy.html?vr&s=pano77";
        break;
      case "5":
        contentUrl = "../resources/_360/Flakstad.html";
        break;
      case "6":
        contentUrl = "../resources/_360/Henningsver.html?vr&s=pano1473";
        break;
      case "7":
        contentUrl = "../resources/_360/Henningsver.html?vr&s=pano1472";
        break;
    }
  }
  $("#overlayContent").attr("src", contentUrl);

  var actionBtn = $(this),
    scaleValue = retrieveScale(actionBtn.next('.cd-modal-bg'));

  actionBtn.addClass('to-circle');
  actionBtn.next('.cd-modal-bg').addClass('is-visible').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function() {
    animateLayer(actionBtn.next('.cd-modal-bg'), scaleValue, true);
  });

  //if browser doesn't support transitions...
  if (actionBtn.parents('.no-csstransitions').length > 0) animateLayer(actionBtn.next('.cd-modal-bg'), scaleValue, true);

});

//trigger the animation - close modal window
$('.cd-section .cd-modal-close').on('click', function() {
  closeModal();
});

$(document).keyup(function(event) {
  if (event.which == '27') closeModal();
});

$(window).on('resize', function() {
  //on window resize - update cover layer dimention and position
  if ($('.cd-section.modal-is-visible').length > 0) window.requestAnimationFrame(updateLayer);
});

function retrieveScale(btn) {
  var btnRadius = btn.width() / 2,
    left = btn.offset().left + btnRadius,
    top = btn.offset().top + btnRadius - $(window).scrollTop(),
    scale = scaleValue(top, left, btnRadius, $(window).height(), $(window).width());

  btn.css('position', 'fixed').velocity({
    top: top - btnRadius,
    left: left - btnRadius,
    translateX: 0,
  }, 0);

  return scale;
}

function scaleValue(topValue, leftValue, radiusValue, windowW, windowH) {
  var maxDistHor = (leftValue > windowW / 2) ? leftValue : (windowW - leftValue),
    maxDistVert = (topValue > windowH / 2) ? topValue : (windowH - topValue);
  return Math.ceil(Math.sqrt(Math.pow(maxDistHor, 2) + Math.pow(maxDistVert, 2)) / radiusValue);
}

function animateLayer(layer, scaleVal, bool) {
  layer.velocity({
    scale: scaleVal
  }, 400, function() {
    $('body').toggleClass('overflow-hidden', bool);
    (bool) ?
    layer.parents('.cd-section').addClass('modal-is-visible').end().off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend'): layer.removeClass('is-visible').removeAttr('style').siblings('[data-type="modal-trigger"]').removeClass('to-circle');
  });
}

function updateLayer() {
  var layer = $('.cd-section.modal-is-visible').find('.cd-modal-bg'),
    layerRadius = layer.width() / 2,
    layerTop = layer.siblings('.btn').offset().top + layerRadius - $(window).scrollTop(),
    layerLeft = layer.siblings('.btn').offset().left + layerRadius,
    scale = scaleValue(layerTop, layerLeft, layerRadius, $(window).height(), $(window).width());

  layer.velocity({
    top: layerTop - layerRadius,
    left: layerLeft - layerRadius,
    scale: scale,
  }, 0);
}

function closeModal() {
  $("#overlayContent").attr("src", "");
  var section = $('.cd-section.modal-is-visible');
  section.removeClass('modal-is-visible').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function() {
    animateLayer(section.find('.cd-modal-bg'), 1, false);
  });
  //if browser doesn't support transitions...
  if (section.parents('.no-csstransitions').length > 0) animateLayer(section.find('.cd-modal-bg'), 1, false);
}
