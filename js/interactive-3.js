"use strict";

// Make sure the app variable exist. It should exist, from app.framework6.js
var app = app || {};

var disableMapControls = false;
var zoomedToArea = false;
var flying = false;
var startDelay = 0; //2000
var totalTime = 60 * 1; // Minutes - should be 60
var mapFiltersLocked = false;

// Bounding boxes for specific layers
var bbox_area   = [[9.0088,67.3314],[18.0505,69.7181]];
var bbox_roest  = [[11.814423,67.402211],[12.204437,67.542167]];
var bbox_corals = [[7.9871,67.0074],[16.3368,69.3735]];

// Color picking for layers
//var colors = chroma.scale(['#fafa6e','#2A4858']).mode('lch').colors(5);
// var colors2 = chroma.scale('YlGnBu').colors(5);
// var colors3 = chroma.scale(['yellow', '008ae5']).mode('lch').colors(5);
// console.log(colors2)

// GeoJSON data sources for MapBox layer
// Get more data layers here: http://maps.imr.no/geoserver/web/?wicket:bookmarkablePage=:org.geoserver.web.demo.MapPreviewPage

var dataSources = [
  {
    name: 'lovese_sea',
    data: '../include/map-layers/lovese_blocks.geojson'
  },
  {
    name: 'fish',
    data: '../include/map-layers/cod.geojson'
  },
  {
    name: 'saith',
    data: '../include/map-layers/sei_gyte.geojson'
  },
  {
    name: 'haddock',
    data: '../include/map-layers/hyse_gyte.geojson'
  },
  {
    name: 'herring',
    data: '../include/map-layers/nvg_sild_gyte.geojson'
  },
  {
    name: 'hallibut',
    data: '../include/map-layers/blaakveite_gyte.geojson'
  },
  {
    name: 'oil_prospects',
    data: '../include/map-layers/prospekter_union.geojson'
  },
  {
    name: 'corals',
    data: '../include/map-layers/corals.geojson'
  }
];

var dataLayerBounds = new Array(dataSources.length);

var mapLayers = new Array(6);
mapLayers["lovese_land"] = {added: false,visible: false}
mapLayers["fish"] = {added: false,visible: false}
mapLayers["saith"] = {added: false,visible: false}
mapLayers["haddock"] = {added: false,visible: false}
mapLayers["herring"] = {added: false,visible: false}
mapLayers["hallibut"] = {added: false,visible: false}
mapLayers["birds"] = {added: false,visible: false}
mapLayers["corals"] = {added: false,visible: false}
mapLayers["people"] = {added: false,visible: false}
mapLayers["oil_prospects"] = {added: false,visible: false}

// ["#fafa6e", "#86d780", "#23aa8f", "#007882", "#2a4858"]
// ["#ffffd9", "#c7e9b4", "#41b6c4", "#225ea8", "#081d58"]
var mapLayersStyle = new Array(3);
mapLayersStyle["fish"] = {color: "#fafa6e",opacity: 0.5,border_color: "#fafa6e"}
mapLayersStyle["saith"] = {color: "#fafa6e",opacity: 0.5,border_color: "#fafa6e"}
mapLayersStyle["haddock"] = {color: "#fafa6e",opacity: 0.5,border_color: "#fafa6e"}
mapLayersStyle["herring"] = {color: "#fafa6e",opacity: 0.5,border_color: "#fafa6e"}
mapLayersStyle["hallibut"] = {color: "#fafa6e",opacity: 0.5,border_color: "#fafa6e"}
mapLayersStyle["oil_prospects"] = {color: "#000",opacity: 0.8,border_color: "#000"}

var mapIcons = ["sven", "martin", "heike", "image360_1", "image360_2", "image360_3", "image360_4", "image360_5", "image360_6", "image360_7"];
var addedPeople = false;
var added360Markers = false;

var addedMapIcons = new Array(6);
addedMapIcons["sven"] = {zoomedTo: false,playedVideo: false,clicked: 0,coordinates: []}
addedMapIcons["martin"] = {zoomedTo: false,playedVideo: false,clicked: 0,coordinates: []}
addedMapIcons["heike"] = {zoomedTo: false,playedVideo: false,clicked: 0,coordinates: []}
addedMapIcons["image360_1"] = {zoomedTo: false,playedVideo: false,clicked: 0,coordinates: []}
addedMapIcons["image360_2"] = {zoomedTo: false,playedVideo: false,clicked: 0,coordinates: []}
addedMapIcons["image360_3"] = {zoomedTo: false,playedVideo: false,clicked: 0,coordinates: []}
addedMapIcons["image360_4"] = {zoomedTo: false,playedVideo: false,clicked: 0,coordinates: []}
addedMapIcons["image360_5"] = {zoomedTo: false,playedVideo: false,clicked: 0,coordinates: []}
addedMapIcons["image360_6"] = {zoomedTo: false,playedVideo: false,clicked: 0,coordinates: []}
addedMapIcons["image360_7"] = {zoomedTo: false,playedVideo: false,clicked: 0,coordinates: []}
addedMapIcons["bird_island_1"] = {zoomedTo: false,playedVideo: false,clicked: 0,coordinates: []}
addedMapIcons["bird_island_2"] = {zoomedTo: false,playedVideo: false,clicked: 0,coordinates: []}
addedMapIcons["bird_island_3"] = {zoomedTo: false,playedVideo: false,clicked: 0,coordinates: []}
addedMapIcons["bird_island_4"] = {zoomedTo: false,playedVideo: false,clicked: 0,coordinates: []}
addedMapIcons["bird_island_5"] = {zoomedTo: false,playedVideo: false,clicked: 0,coordinates: []}
addedMapIcons["corals_1"] = {zoomedTo: false,playedVideo: false,clicked: 0,coordinates: []}
addedMapIcons["corals_2"] = {zoomedTo: false,playedVideo: false,clicked: 0,coordinates: []}
addedMapIcons["corals_3"] = {zoomedTo: false,playedVideo: false,clicked: 0,coordinates: []}

var zoomed = new Array(4);
zoomed["first"] = false;
zoomed["sven"] = false;
zoomed["martin"] = false;
zoomed["heike"] = false;

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
        "title": "Sven Tommy",
        "name": "sven",
        "iconSize": [42, 42],
        "imgPath": "_GFX_006_EP3_BG/",
        "imgName": "sven@3x"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          12.71917260338634,
          67.6552201739818
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "title": "Martin",
        "name": "martin",
        "iconSize": [42, 42],
        "imgPath": "_GFX_006_EP3_BG/",
        "imgName": "martin@3x"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          13.241099194372055,
          68.09483751373435
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "title": "Heike",
        "name": "heike",
        "iconSize": [42, 42],
        "imgPath": "_GFX_006_EP3_BG/",
        "imgName": "heike@3x"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          14.22199493102596,
          68.1608805347768
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
        "name": "bird_island_1",
        "iconSize": [42, 42],
        "imgPath": "_GFX_006_EP3_BG/",
        "imgName": "_ICN_BTN_birds@3x"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          12.018116196083497,
          67.48001667342737
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "title": "Storfjellet",
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
        "name": "bird_island_3",
        "iconSize": [42, 42],
        "imgPath": "_GFX_006_EP3_BG/",
        "imgName": "_ICN_BTN_birds@3x"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          11.912297356460783,
          67.4473372411731
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "title": "Trenyken",
        "name": "bird_island_4",
        "iconSize": [42, 42],
        "imgPath": "_GFX_006_EP3_BG/",
        "imgName": "_ICN_BTN_birds@3x"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          11.891550507512648,
          67.43628541535423
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "title": "Hernyken:",
        "name": "bird_island_4",
        "iconSize": [42, 42],
        "imgPath": "_GFX_006_EP3_BG/",
        "imgName": "_ICN_BTN_birds@3x"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          11.880073225904368,
          67.4268137592164
        ]
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

map.on('load', function() {

  // Add labels for the land areas (LoVeSe)
  land_labels_images.forEach(function(label) {
    map.loadImage(label.localhost + label.imgUrl, function(error, image) {
      if (error) throw error;
      map.addImage(label.name, image);
    });

    map.addLayer({
      "id": label.name,
      "type": "symbol",
      "source": {
        "type": "geojson",
        "data": {
          "type": "FeatureCollection",
          "features": [{
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": label.coordinates
            }
          }]
        }
      },
      "maxzoom": 12,
      "minzoom": 5,
      "layout": {
        "icon-image": label.name,
        "icon-size": {
          "stops": [
            [0, 0],
            [5, 0.4],
            [6, 0.5],
            [11, 0.55]
          ]
        }
      }
    });
  });

  // Add geojson sources and calculate the bbox for each layer for later use
  dataSources.forEach(function(source) {
    $.ajax({
      beforeSend: function(xhr) {
        if (xhr.overrideMimeType) {
          xhr.overrideMimeType("application/json");
        }
      },
      dataType: "json",
      url: source.data,
      success: function(data) {
        //var bounds = turf.bbox(data);
        map.addSource(source.name, {
          type: 'geojson',
          data: data
        });

        if(source.name === 'corals') {
          dataLayerBounds[source.name] = bbox_corals;
        } else {
          dataLayerBounds[source.name] = bbox_area;
        }
      }
    });
  });

  map.resize();
  $(".interactive-content").fadeOut(1500).promise().done(function() {
    // Fadeout done, start the timer for going through the map (set in top of script)
    $("#start-interactive-tour").show();
  });

  map.on("mousedown", function(e) {
    var center = map.getCenter().wrap();
    var zoom = map.getZoom();

    console.log(center, zoom, e.lngLat, e.point);
  });

  // Need this?
  map.on('zoomend', function(e) {
    var zoom = map.getZoom();
    if (zoom <= 6.5) {
      $(".marker-360").hide();
    } else {
      $(".marker-360").show();
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
      if (zoomed["sven"] || zoomed["martin"] || zoomed["heike"]) {
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
    if (zoomed["sven"] || zoomed["martin"] || zoomed["heike"]) {
      updateMarkerOverlayPos();
    }
  });
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
$('input[name="fish_stocks"]').on('click', function () {
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

  // if (countdown) {
  //   clearInterval(countdown);
  // }
  // paused = false;
  //
  // startTimer(totalTime);
  // startMapFeautures();
});

// Map filter
$("#map-filters ul li").on('click', function() {
  if (!mapFiltersLocked) {
    $(this).siblings().each(function() {
      $(this).removeClass("active"); // The button
      // Turn off any visible layers
      removeMapLayer($(this).attr('data-layer-name'));
      // remove any previously set info panes
      $("section[data-layer-name='" + $(this).attr('data-layer-name') + "']").removeClass("active"); // The info pane
    });
    $(this).addClass("active");
    // Turn on this map layer
    showMapLayer($(this).attr('data-layer-name'));
    // Update the info pane which corresponds to the button
    $("section[data-layer-name='" + $(this).attr('data-layer-name') + "']").addClass("active");
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
  if (layer !== undefined || layer !== null || typeof layer !== "undefined" && layer !== "lovese_land" && layer !== "birds" && layer !== "people") {
    if (mapLayers[layer].visible == false) {
      if (!mapLayers[layer].added && layer !== "lovese_land" && layer !== "birds" && layer !== "people") {
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
        // else if(layer === 'fish' || layer === 'haddock' || layer === 'hallibut' || layer === 'saith' || layer === 'herring') {}
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

      if (layer !== "lovese_land" && layer !== "birds" && layer !== "people") {
        map.setLayoutProperty(layer, 'visibility', 'visible');
        mapLayers[layer].visible = true;

        // Fit the map to the bounderies of the specific layer
        map.fitBounds(dataLayerBounds[layer], {
          padding: 30,
          linear: false,
          duration: 2000,
          offset: [200,0]
        });
      }
      if(layer === "corals") {
          addMarkers("corals",corals);
      }
    }
  }

  // Stuff to do for ncs (lovese_land is already loaded after the zoom event)
  if (layer === "people") {
    //addPeopleIcons();
    addMarkers("people",people);
  }
  if (layer === "birds") {
    console.log("birds - røst");

    // zoomElement, center, zoom, speed, curve, pitch, bearing, offset
    //zoomToArea("birds", [11.937078079160585, 67.46127758453957], 9, 0.5, 1.5, 0, 0, [0, 0]);
    map.fitBounds(bbox_roest, {
      padding: 30,
      linear: false,
      duration: 2000,
      offset: [200,0]
    });

    addMarkers("birds",bird_islands);

    // TODO: Add markers to the different islands of Røst with popup info?
  }
}

// Remove a given map layer, except the islands layer - which has no layer
function removeMapLayer(layer) {
  if (layer !== undefined || layer !== null || typeof layer !== "undefined" && layer !== "lovese_sea" && layer !== "lovese_land" && layer !== "ncs" && layer !== "people") {
    if (mapLayers[layer].visible == true && layer !== "lovese_sea" && layer !== "lovese_land" && layer !== "ncs" && layer !== "people") {
      map.setLayoutProperty(layer, 'visibility', 'none');
      if (layer === "lovese_sea") {
        map.setLayoutProperty("lovese-labels", 'visibility', 'none');
      }
      mapLayers[layer].visible = false;
    }
  }
}

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
          console.log("mouseover!!");
          $(this).css("background-image", "url(../resources/_Graphics/_GFX_006_EP3_BG/_ICN_BTN_"+name+"_Inverted@3x.png)");
      });
      el.addEventListener('mouseout', function (e) {
          console.log("mouseover!!");
          $(this).css("background-image", "url(../resources/_Graphics/_GFX_006_EP3_BG/_ICN_BTN_"+name+"@3x.png)");
      });
    } else if (name === '360') {
      added360Markers = true;
    }

    new mapboxgl.Marker(el)
      .setLngLat(marker.geometry.coordinates)
      .addTo(map);
  });
}

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

// TODO: Need to incorporate this into the overall framework.
// E.g: Interactive parts need to have their JS in the overall JS framework
function startTimer(duration) {
  var timer = duration;
  var minutes;
  var seconds;

  countdown = setInterval(function() {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    //display.text(minutes + ":" + seconds);
    //console.log("counting down", minutes + ":" + seconds);

    var value = (100 / duration) * timer;

    seconds = Math.ceil(seconds);
    $(".timeRemaining").text(minutes + ":" + app.helpers.twoDigits(seconds));

    var d = 100 * timer / duration;
    //console.log(value, d);
    $(".avancee").css({
      width: (100 - d) + "%"
    });

    $("#seek-bar").val(value);

    if (--timer < 0) {
      clearInterval(countdown);
    }
  }, 1000);
}

// Pause/Unpause timer
$('#btn-play-pause').on('click', '#countdown-timer', function() {
  console.log("clicked");
  if (paused) {
    var timer = $(".timeRemaining").text().split(':');
    startTimer(Number(timer[0] * 60) + Number(timer[1]));
    paused = false;
  } else {
    clearInterval(countdown);
    paused = true;
  }
});

function startMapFeautures() {
  var sectionTime = (totalTime * 1000) / $('.map-details').length;
  //sectionTime = 1000;
  $(".map-features-count p span.current").text(1);
  $(".map-features-count p span.total").text($('.map-details').length);

  var mapF = $('.map-features .map-details');
  var $active = mapF.eq(0);
  var currMapLayer = $active.attr('data-layer-name');
  showMapLayer(currMapLayer);
  $("#map-filters ul").find("[data-layer-name='" + currMapLayer + "']").addClass("active");

  var $next = $active.next();
  var timer = setInterval(function() {

    $next.siblings().each(function() {
      // Turn off any visible layers
      removeMapLayer($(this).attr('data-layer-name'));
      $("#map-filters ul").find("[data-layer-name='" + $(this).attr('data-layer-name') + "']").removeClass("active");
    });
    showMapLayer($next.attr('data-layer-name'));
    $("#map-filters ul").find("[data-layer-name='" + $next.attr('data-layer-name') + "']").addClass("active");

    $next.addClass("active");
    $active.removeClass("active");
    $active = $next;

    // Do map operations
    $(".map-features-count p span.current").text(mapF.index($next) + 1);
    $next = (mapF.last().index() == mapF.index($active)) ? $next = mapF.eq(0) : $active.next();

    if (mapF.last().index() == mapF.index($active)) {
      clearInterval(timer);
      timer = null;
      // Move to sven
      zoomToPerson("sven");

      // TODO: Move to next episode - How to do this?
    }
  }, sectionTime);
}

// Open videos and 360s:
$('[data-type="modal-trigger"]').on('click', function(e) {
  e.preventDefault();
  var contentUrl = "";

  https: //vimeo.com/200725736
    if ($(this).parent().attr('data-type') == 'person') {
      switch ($(this).parent().attr('data-id')) {
        case "sven":
          contentUrl = "//player.vimeo.com/video/228447528?byline=0&amp;portrait=0";
          break;
        case "martin":
          contentUrl = "//player.vimeo.com/video/228451663?byline=0&amp;portrait=0";
          break;
        case "heike":
          contentUrl = "//player.vimeo.com/video/228453330?byline=0&amp;portrait=0";
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
