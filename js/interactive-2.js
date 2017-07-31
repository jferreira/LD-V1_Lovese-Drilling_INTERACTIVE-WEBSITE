var disableMapControls = true;
var zoomedToArea = false;
var flying = false;
var startDelay = 0; //2000
var totalTime = 30 * 1; // Minutes - should be 60

// Name of layers used in the interface
//var dataLayers = ['lovese_land', 'lovese_sea', 'opened_oil_areas', 'oil_prospects'];

// GeoJSON data sources for MapBox layers
var dataSources = [
  {name:'corals', data:'../include/map-layers/corals.geojson'},
  {name:'cod', data:'../include/map-layers/cod.geojson'},
  {name:'lovese_sea', data:'../include/map-layers/lovese_blocks.geojson'},
  {name:'oil_prospects', data:'../include/map-layers/prospekter_union.geojson'},
  {name:'opened_oil_areas', data:'../include/map-layers/opened_areas.geojson'},
];

var dataLayerBounds = new Array(dataSources.length);

var mapLayers = new Array(6);
mapLayers["lovese_land"] = {added : false,visible : false}
mapLayers["lovese_sea"] = {added : false,visible : false}
mapLayers["opened_oil_areas"] = {added : false,visible : false}
mapLayers["ncs"] = {added : false,visible : false}
mapLayers["oil_prospects"] = {added : false,visible : false}
mapLayers["people"] = {added : false,visible : false}

var mapLayersStyle = new Array(3);
mapLayersStyle["lovese_sea"] = {
    color : "#fff",
    opacity : 0.5,
    border_color : "#fff"
}
mapLayersStyle["opened_oil_areas"] = {
    color : "#E7A930",
    opacity : 1,
    border_color : "#fff"
}
mapLayersStyle["oil_prospects"] = {
    color : "#000",
    opacity : 0.9,
    border_color : "#000"
}
var mapIcons = ["eldar","anne","johanna", "image360_1", "image360_2", "image360_3", "image360_4", "image360_5", "image360_6"];
var peopleAdded = false;

var addedMapIcons = new Array(6);
addedMapIcons["eldar"] = {zoomedTo : false, playedVideo : false, clicked : 0, coordinates : []}
addedMapIcons["anne"] = {zoomedTo : false, playedVideo : false, clicked : 0, coordinates : []}
addedMapIcons["johanna"] = {zoomedTo : false, playedVideo : false, clicked : 0, coordinates : []}
addedMapIcons["image360_1"] = {zoomedTo : false, playedVideo : false, clicked : 0, coordinates : []}
addedMapIcons["image360_2"] = {zoomedTo : false, playedVideo : false, clicked : 0, coordinates : []}
addedMapIcons["image360_3"] = {zoomedTo : false, playedVideo : false, clicked : 0, coordinates : []}
addedMapIcons["image360_4"] = {zoomedTo : false, playedVideo : false, clicked : 0, coordinates : []}
addedMapIcons["image360_5"] = {zoomedTo : false, playedVideo : false, clicked : 0, coordinates : []}
addedMapIcons["image360_6"] = {zoomedTo : false, playedVideo : false, clicked : 0, coordinates : []}

var zoomed = new Array(4);
zoomed["first"] = false;
zoomed["eldar"] = false;
zoomed["anne"] = false;
zoomed["johanna"] = false;

var paused;
var countdown;

var land_areas_lavbels = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "message": "Lofoten",
                "iconSize": [200, 32],
                "imgName" : "_ICN_LABEL_Lofoten-Archipelago@2x"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    14.248825694533252,
                    68.26400752799873
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "message": "Vesterålen",
                "iconSize": [200, 32],
                "imgName" : "_ICN_LABEL_Vesterålen-Archipelago@2x"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    14.908509488458321,
                    68.72214903472567
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "message": "Senja",
                "iconSize": [200, 32],
                "imgName" : "_ICN_LABEL_Senja-Archipelago@2x"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    17.457677872120883,
                    69.30793670755747
                ]
            }
        }
    ]
};

var oilareas = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "name": "TROMS II"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [16.89656278272045, 69.99959900300283]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "name": "NORDLAND VII"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [12.54395051590086, 68.67553211914631]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "name": "NORDLAND VI",
            },
            "geometry": {
                "type": "Point",
                "coordinates": [9.682141227345937, 67.69129025619176]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "name": "NORDLAND V",
            },
            "geometry": {
                "type": "Point",
                "coordinates": [11.62876179579601, 66.77177798313087]
            }
        }
    ]
};

var people = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "title": "Eldar",
                "name": "eldar",
                "iconSize": [42, 42],
                "imgName" : "_ICN_IMG-INT-01@3x"
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
                "title": "Anne-Birgit",
                "name": "anne",
                "iconSize": [32, 32],
                "imgName" : "_Plus-Circle@3x"
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
                "title": "Johanna",
                "name": "johanna",
                "iconSize": [32, 32],
                "imgName" : "_Plus-Circle@3x"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    13.435388,
                    68.133261
                ]
            }
        }
    ]
};

var images360 = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "title": "Verøy",
                "name": "image360_1",
                "iconSize": [42, 42],
                "imgName" : "_ICN_BTN_Birds@3x"
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
                "imgName" : "_ICN_BTN_Birds@3x"
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
                "imgName" : "_ICN_BTN_Birds@3x"
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
                "imgName" : "_ICN_BTN_Birds@3x"
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
                "title": "Flakstad",
                "name": "image360_5",
                "iconSize": [42, 42],
                "imgName" : "_ICN_BTN_Birds@3x"
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
                "title": "Napp",
                "name": "image360_6",
                "iconSize": [42, 42],
                "imgName" : "_ICN_BTN_Birds@3x"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    13.471063888889,
                    68.126827777778
                ]
            }
        }
    ]
};

mapboxgl.accessToken = 'pk.eyJ1IjoibG92ZXNlIiwiYSI6ImNpeTF0NTIxdzAwODMycWx4anRuc2dteGoifQ.h_sW40YOKtU1XOVyrJlqaw';

var map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/lovese/ciy1xowr100e22rqlyky3qgcg', //hosted style id
  center: [-8.,55.9], // starting position: lng/lat
  zoom: 3, // starting zoom,
  pitch: 0, // pitch in degrees
  bearing: 0, // bearing in degrees
  attributionControl: false
});

if(disableMapControls) {
  mapControls(true);
}

function mapControls(disable) {
  if(disable) {
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
  // Add geojson sources and calculate the bbox for each layer for later use
  dataSources.forEach(function(source) {
    $.ajax({
      beforeSend: function(xhr){
        if (xhr.overrideMimeType)
        {
          xhr.overrideMimeType("application/json");
        }
      },
      dataType: "json",
      url: source.data,
      success: function(data){
        var bounds = turf.bbox(data);
        map.addSource(source.name, {type: 'geojson', data : data});
        dataLayerBounds[source.name] = bounds;
      }
    });
  });

  // Add labels
  map.addSource('oil_areas_labels', {type: 'geojson', data : oilareas});

  // Crude way of checking if a layer has been added when the map re-renders
  // Could add all the layers here, and loop through them to check if they have been added
  // map.on("render", function() {
  //   if(map.loaded()) {
  //     dataLayers.forEach(function(layer) {
  //       if(map.getLayer(layer)) {
  //         //var features = map.queryRenderedFeatures({layers:[layer]});
  //         var relatedFeatures = map.querySourceFeatures(layer, {
  //                     sourceLayer: layer
  //                     //filter: ['in', 'COUNTY', feature.properties.COUNTY]
  //                 });
  //
  //         console.log(relatedFeatures);
  //         zoomToExtent(relatedFeatures);
  //       }
  //     });
  //   }
  // });

  // map.on('sourcedata', function(e) {
  //   console.log(e);
  // });

  //console.log(map.getLayer('opened_oil_areas'), map.querySourceFeatures('opened_oil_areas'));
  // https://bl.ocks.org/danswick/83a8ddff7fb9193176a975a02a896792 or https://stackoverflow.com/questions/35673704/how-do-i-get-the-bounding-box-of-a-mapboxgl-geojsonsource-object
  // or: https://github.com/mapbox/geojson-extent
  // Get boudning box of geojson - need to load the file first.
  //var bbox = turf.bbox(geojson);

  // map.on('sourcedata', function(e) {
  //   console.log(e);
  // });

  map.resize();
  $(".loading").fadeOut(1500).promise().done(function() {
    // Fadeout done, start the timer for going through the map (set in top of script)
    setTimeout(function() {
      zoomToArea("first", [12.901721434467618,68.71391887946749], 6.54, 0.5, 1.5, 0, 0, [0,0]);
    }, startDelay);
  });

  map.on("mousedown", function(e) {
    var center = map.getCenter().wrap();
    var zoom = map.getZoom();

    console.log(center, zoom, e.lngLat, e.point);
  });

  map.on('zoomend', function(e) {
    var zoom = map.getZoom();
    if(zoom < 5.5 || zoom > 7.5) {
      $(".areas-marker").hide();
    } else {
      $(".areas-marker").show();
    }
  });

  // map.on("mouseup", function(e) {
  // });
  //
  // map.on("zoomend", function(e) {
  // });

  // // Change the cursor to a pointer when the mouse is over the places layer.
  // // Does not work on the dynamically added layers?
  // map.on('mouseenter', 'lovese', function () {
  //     map.getCanvas().style.cursor = 'pointer';
  // });
  //
  // // Change it back to a pointer when it leaves.
  // map.on('mouseleave', 'lovese', function () {
  //     map.getCanvas().style.cursor = '';
  // });

  // Functions for flying to a specific part of the map
  map.on('flystart', function(){
    flying = true;
  });
  map.on('flyend', function(){
    flying = false;
  });
  map.on('moveend', function(e){

    //TODO: Need to implement a check here on the different times we're zooming on the map
    /*Need:
      zoom into Norway/the areas
      zoom out to see all the areas Norway has opened for oil
      zoom into Værøy / zoom out from Værøy
      zoom to Johanne / zoom out from Johanne (Napp)
      zoom to Anne Birgit / zoom out from Anne B. (Flakstad)
    */

    if(!flying && zoomedToArea){
      //map.fire(flyend);
      if(zoomed["first"]) {
        console.log("First zoom event!");
        $(".container-full").fadeIn("1500");
        $(".interactive-pane-text").css({'z-index':1}).show();
        $(".cd-section").css({'z-index':1}).show();

        // Add marker for each area to the map (Lofoten, Vesterålen and Senja) [the first part of the interactive episode]
        land_areas_lavbels.features.forEach(function(marker) {
            // create a DOM element for the marker
            var el = document.createElement('div');
            el.className = 'areas-marker';

            el.style.backgroundImage = 'url(../resources/_Graphics/_GFX_005_EP2_LD/' + marker.properties.imgName + '.png)';
            el.style.width = marker.properties.iconSize[0] + 'px';
            el.style.height = marker.properties.iconSize[1] + 'px';

            // Get the screen x,y representation of the coordinates
            //var lnglat = new mapboxgl.LngLat(marker.geometry.coordinates);
            var point = map.project(marker.geometry.coordinates);

            el.addEventListener('click', function() {
                console.log(marker.properties.message, point);
            });

            // add marker to map
            //new mapboxgl.Marker(el)
            new mapboxgl.Marker(el, { offset: [-100 / 2, -50 / 2] })
                .setLngLat(marker.geometry.coordinates)
                .addTo(map);
        });

        // Show map filters
        $("#map-filters").show();

        if (countdown) {
          clearInterval(countdown);
        }
        paused = false;

        startTimer(totalTime);
        startMapFeautures();
        zoomed["first"] = false; // Not to do this again
      } else if(zoomed["eldar"]) {
        // We have zoomed in on the first interview, so update their marker overlay position accordingly
        add360Icons(); // Should we move this - or even break it down for each person?
        //updateMarkerOverlayPos();

        // var point = map.project(peopleIcons["eldar"].coordinates);
        //
        // $(".cd-modal-action").css({'left':point.x-10, 'top':point.y-10});
        // $(".cd-section").css({'z-index':1}).show();
        //
        // zoomed["second"] = false;
      }

      zoomedToArea = false; // Always do this
    }

    // Used to be peopleAdded
    if(zoomed["eldar"]) {
      updateMarkerOverlayPos();
      //
      // try{
      //   // Update the overlay if the map moves
      //   var point = map.project(peopleIcons["eldar"].coordinates);
      //   $(".cd-modal-action").css({'left':point.x-10, 'top':point.y-10});
      // }
      // catch(err) {
      //     console.log(err);
      // }
    }
  });
});

function updateMarkerOverlayPos() {
  $(".cd-modal-action").show();
  mapIcons.forEach(function(icon) {
    try{
      // Update the overlay if the map moves
      var point = map.project(addedMapIcons[icon].coordinates);
      console.log("Update overlay for: ", icon, point);
      $(".cd-modal-action."+ icon +" ").css({'left':point.x-19, 'top':point.y-19});
      //console.log(point);
    }
    catch(err) {
        console.log(err);
    }
  });
}

// Not currently in use
// map.on('style.load', function (e) {
//   console.log("loaded style")
// });

// Not currently in use
// $(window).resize(function() {
//   //setSizes();
// });

$("#hover-navigation .arrow").on("click", function() {
  if (app.navigation.state == app.navigation.visible) {
    $(".interactive-pane").css({"bottom":"130px"});
  } else if(app.navigation.state == app.navigation.hidden) {
    $(".interactive-pane").css({"bottom":"30px"});
  }
});

// Map filter
$("#map-filters ul li").on('click', function () {
  $(this).siblings().each(function(){
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
});

// Interviewees pane - move to the area of the person on click
$(".interview").on('click', function () {
  $(this).siblings().each(function(){
     $(this).removeClass("active");
  });
  $(this).addClass("active");
  var person = $(this).attr('data-person');
  zoomToPerson(person);
});

// Add a given map layer to the map, except the islands layer - which has no layer
function showMapLayer(layer){
  if(layer !== undefined || layer !== null || typeof layer !== "undefined" && layer !== "lovese_land" && layer !== "ncs" && layer !== "people") {
    if(mapLayers[layer].visible == false) {
      if(!mapLayers[layer].added && layer !== "lovese_land" && layer !== "ncs" && layer !== "people") {
        map.addLayer({"id":layer,"source":layer,"type":"fill","paint": {"fill-opacity":mapLayersStyle[layer].opacity, "fill-color":mapLayersStyle[layer].color,"fill-outline-color":mapLayersStyle[layer].border_color}});
        if(layer === "lovese_sea") {
          // Add labels for the different sea areas
          map.addLayer({
            "id": "lovese-labels",
            "type": "symbol",
            "source": "oil_areas_labels",
            "layout": {
              "text-field": "{name}",
              "text-font": [
                "DIN Offc Pro Medium",
                "Arial Unicode MS Bold"
              ],
              "text-size": 10,
            },
            "paint": {
              "text-color": "#fff"
            },
          });
        }
        mapLayers[layer].added = true;
      }

      // // Geographic coordinates of the LineString
      // var coordinates = geojson.features[0].geometry.coordinates;
      //
      // // Pass the first coordinates in the LineString to `lngLatBounds` &
      // // wrap each coordinate pair in `extend` to include them in the bounds
      // // result. A variation of this technique could be applied to zooming
      // // to the bounds of multiple Points or Polygon geomteries - it just
      // // requires wrapping all the coordinates with the extend method.
      // var bounds = coordinates.reduce(function(bounds, coord) {
      //     return bounds.extend(coord);
      // }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));
      //
      // map.fitBounds(bounds, {
      //     padding: 20
      // });

      if(layer === "lovese_sea") {
        map.setLayoutProperty("lovese-labels", 'visibility', 'visible');
      }
      if(layer !== "lovese_land" && layer !== "ncs" && layer !== "people") {
        map.setLayoutProperty(layer, 'visibility', 'visible');
        mapLayers[layer].visible = true;

        // Fit the map to the bounderies of the specific layer
        //console.log(layer);
        map.fitBounds(dataLayerBounds[layer], {padding: 20, linear:false, duration: 2000});
      }
    }
  }

  // Stuff to do for ncs (lovese_land is already loaded after the zoom event)
  if(layer === "people") {
    addPeopleIcons();
  }

}

// Remove a given map layer, except the islands layer - which has no layer
function removeMapLayer(layer){
  if(layer !== undefined || layer !== null || typeof layer !== "undefined" && layer !== "lovese_land" && layer !== "ncs" && layer !== "people") {
    if(mapLayers[layer].visible == true && layer !== "lovese_land" && layer !== "ncs" && layer !== "people") {
      //map.removeLayer(layer);
      map.setLayoutProperty(layer, 'visibility', 'none');
      if(layer === "lovese_sea") {
        //map.removeLayer("lovese-labels");
        map.setLayoutProperty("lovese-labels", 'visibility', 'none');
      }
      //mapLayers[layer] = false;
      mapLayers[layer].visible = false;
    }
  }
}

function addPeopleIcons() {
  peopleAdded = true;
  // Add marker for each area to the map (Lofoten, Vesterålen and Senja)
  people.features.forEach(function(marker) {
      // create a DOM element for the marker
      var el = document.createElement('div');
      el.className = 'people-marker';

      el.style.backgroundImage = 'url(../resources/_Graphics/_GFX_005_EP2_LD/' + marker.properties.imgName + '.png)';
      el.style.width = marker.properties.iconSize[0] + 'px';
      el.style.height = marker.properties.iconSize[1] + 'px';

      //var point = map.project(marker.geometry.coordinates);
      addedMapIcons[marker.properties.name].coordinates = marker.geometry.coordinates;

      el.addEventListener('click', function() {
        // Add reference to function which will handle stuff from here.
        zoomToPerson(marker.properties.name);
      });

      new mapboxgl.Marker(el)
        .setLngLat(marker.geometry.coordinates)
        .addTo(map);
  });
}

function zoomToPerson(name) {
  // TODO: Research if it's possible to zoom in to the extent of Værøya (create a bounding box?)

  //if(addedMapIcons[name].zoomedTo == false) {
  // zoomElement, center, zoom, speed, curve, pitch, bearing, offset
  zoomToArea(name, addedMapIcons[name].coordinates, 11, 1, 1, 150, -10, [350,0]);
  addedMapIcons[name].zoomedTo = true;
  addedMapIcons[name].clicked += 1;
  //console.log("this person has: ", addedMapIcons[name].coordinates);
  // } else {
  //   // 3. If person icon is clicked more than once
  //   if(addedMapIcons[name].clicked >= 1) {
  //     console.log("Play the video of ", name);
  //
  //     // TODO: Make this work (popup for watching the video)
  //     // var actionBtn = $(this),
  //     // 	scaleValue = retrieveScale(actionBtn.next('.cd-modal-bg'));
  //     //
  //     // actionBtn.addClass('to-circle');
  //     // actionBtn.next('.cd-modal-bg').addClass('is-visible').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
  //     // 	animateLayer(actionBtn.next('.cd-modal-bg'), scaleValue, true);
  //     // });
  //     //
  //     // //if browser doesn't support transitions...
  //     // if(actionBtn.parents('.no-csstransitions').length > 0 ) animateLayer(actionBtn.next('.cd-modal-bg'), scaleValue, true);
  //     //
  //     // peopleIcons["eldar"].playedVideo = true;
  //   }
  // }
}

function add360Icons() {
  // 2. Add the 360 icons to the map
  images360.features.forEach(function(marker) {
      // create a DOM element for the marker
      var el = document.createElement('div');
      el.className = 'marker-360';

      el.style.backgroundImage = 'url(../resources/_Graphics/_GFX_010_EP7_BG/' + marker.properties.imgName + '.png)';
      el.style.width = marker.properties.iconSize[0] + 'px';
      el.style.height = marker.properties.iconSize[1] + 'px';

      //var point = map.project(marker.geometry.coordinates);
      addedMapIcons[marker.properties.name].coordinates = marker.geometry.coordinates;

      // el.addEventListener('click', function() {
      //   // Add reference to function which will handle stuff from here.
      //   //zoomToPerson(marker);
      // });

      new mapboxgl.Marker(el)
        .setLngLat(marker.geometry.coordinates)
        .addTo(map);
  });
}

function setSizes() {
  // Currently not in use
  var containerHeight = $(".interactive-pane").height();
  $(".interactive-pane").height(containerHeight - 130);
}

function zoomToArea(zoomElement, center, zoom, speed, curve, pitch, bearing, offset) {
  if(app.navigation.state == app.navigation.visible) {
    $(".interactive-pane").css({"bottom":"30px"});
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
    easing: function (t) {
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
    $(".avancee").css({width:(100 - d)+"%"});

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

    $next.siblings().each(function(){
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
    $next = (mapF.last().index() == mapF.index($active)) ? $next = mapF.eq(0): $active.next();

    if(mapF.last().index() == mapF.index($active)) {
      clearInterval(timer);
      timer = null;
      // Move to Eldar
      zoomToPerson("eldar");

      // Move to next episode.
    }
  }, sectionTime);
}

// NOTES

// https://stackoverflow.com/questions/35452705/mapbox-leaflet-increase-marker-size-on-zoom
// Show/hide on specific zoom level: https://www.mapbox.com/mapbox-gl-js/example/updating-choropleth/
// Use layers instead of markers? https://stackoverflow.com/questions/40153538/how-to-hide-point-labels-at-certain-zoom-levels-in-mapbox-gl-js
// min zoom or stops: http://android.wekeepcoding.com/article/11539332/How+to+hide+point+labels+at+certain+zoom+levels+in+mapbox-gl-js%3F
// https://www.mapbox.com/mapbox-gl-js/example/add-image/
// OR: https://www.mapbox.com/mapbox-gl-js/example/animate-images/
// https://www.mapbox.com/help/custom-markers-gl-js/


// Open videos and 360s:
	//trigger the animation - open modal window
	$('[data-type="modal-trigger"]').on('click', function(e){
    e.preventDefault();
    var contentUrl = "";

    https://vimeo.com/200725736
    if($(this).parent().attr('data-type') == 'person') {
      switch($(this).parent().attr('data-id')) {
        case "eldar":
          console.log("Play eldar");
          contentUrl = "//player.vimeo.com/video/200725736?byline=0&amp;portrait=0";
          break;
        case "anne":
          console.log("play Anne");
          contentUrl = "//player.vimeo.com/video/200724627?byline=0&amp;portrait=0";
          break;
        case "johanna":
          console.log("Play Johanna");
          contentUrl = "//player.vimeo.com/video/199863373?byline=0&amp;portrait=0";
          break;
      }
    } else if($(this).parent().attr('data-type') == 'images360') {
      switch($(this).parent().attr('data-id')) {
        case "1":
          console.log("Værøy 1");
          contentUrl = "../resources/_360/Veroy.html";
          break;
        case "2":
          console.log("Værøy 2");
          contentUrl = "../resources/_360/Veroy.html";
          break;
        case "3":
          console.log("Værøy 3");
          contentUrl = "../resources/_360/Veroy.html";
          break;
        case "4":
          console.log("Værøy 4");
          contentUrl = "../resources/_360/Veroy.html";
          break;
        case "5":
          console.log("Flakstad");
          contentUrl = "../resources/_360/Flakstad.html";
          break;
        case "6":
          console.log("Napp");
          contentUrl = "../resources/_360/Napp.html";
          break;
      }
    }
    $("#overlayContent").attr("src", contentUrl);

		var actionBtn = $(this),
			scaleValue = retrieveScale(actionBtn.next('.cd-modal-bg'));

		actionBtn.addClass('to-circle');
		actionBtn.next('.cd-modal-bg').addClass('is-visible').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
			animateLayer(actionBtn.next('.cd-modal-bg'), scaleValue, true);
		});

		//if browser doesn't support transitions...
		if(actionBtn.parents('.no-csstransitions').length > 0 ) animateLayer(actionBtn.next('.cd-modal-bg'), scaleValue, true);

	});

	//trigger the animation - close modal window
	$('.cd-section .cd-modal-close').on('click', function(){
		closeModal();
	});

	$(document).keyup(function(event){
		if(event.which=='27') closeModal();
	});

	$(window).on('resize', function(){
		//on window resize - update cover layer dimention and position
		if($('.cd-section.modal-is-visible').length > 0) window.requestAnimationFrame(updateLayer);
	});

	function retrieveScale(btn) {
		var btnRadius = btn.width()/2,
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

	function scaleValue( topValue, leftValue, radiusValue, windowW, windowH) {
		var maxDistHor = ( leftValue > windowW/2) ? leftValue : (windowW - leftValue),
			maxDistVert = ( topValue > windowH/2) ? topValue : (windowH - topValue);
		return Math.ceil(Math.sqrt( Math.pow(maxDistHor, 2) + Math.pow(maxDistVert, 2) )/radiusValue);
	}

	function animateLayer(layer, scaleVal, bool) {
		layer.velocity({ scale: scaleVal }, 400, function(){
			$('body').toggleClass('overflow-hidden', bool);
			(bool)
				? layer.parents('.cd-section').addClass('modal-is-visible').end().off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend')
				: layer.removeClass('is-visible').removeAttr( 'style' ).siblings('[data-type="modal-trigger"]').removeClass('to-circle');
		});
	}

	function updateLayer() {
		var layer = $('.cd-section.modal-is-visible').find('.cd-modal-bg'),
			layerRadius = layer.width()/2,
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
		var section = $('.cd-section.modal-is-visible');
		section.removeClass('modal-is-visible').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
			animateLayer(section.find('.cd-modal-bg'), 1, false);
		});
		//if browser doesn't support transitions...
		if(section.parents('.no-csstransitions').length > 0 ) animateLayer(section.find('.cd-modal-bg'), 1, false);
	}
