var zoomedToArea = false;
var flying = false;
var startDelay = 0; //2000
var totalTime = 30 * 1; // Minutes - should be 60

var mapLayers = new Array(3);
mapLayers["lovese"] = false;
mapLayers["opened_oil_areas"] = false;
mapLayers["oil_prospects"] = false;

var mapLayersStyle = new Array(3);
mapLayersStyle["lovese"] = {
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

var paused;
var countdown;

var areas = {
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

map.on('load', function() {
  // Add all the data sources that we need:
  map.addSource('corals', { type: 'geojson', data: '../include/map-layers/corals.geojson' });
  map.addSource('cod', { type: 'geojson', data: '../include/map-layers/cod.geojson' });
  map.addSource('lovese', { type: 'geojson', data: '../include/map-layers/lovese_blocks.geojson' });
  map.addSource('oil_areas', {type: 'geojson', data : oilareas});
  map.addSource('oil_prospects', { type: 'geojson', data: '../include/map-layers/prospekter_union.geojson' });
  map.addSource('opened_oil_areas', { type: 'geojson', data: '../include/map-layers/opened_areas.geojson' });

  map.resize();
  $(".loading").fadeOut(1500).promise().done(function() {
    // Fadeout done, start the timer for going through the map (set in top of script)
    setTimeout(function() {
      zoomToArea();
    }, startDelay);
  });
});

// Not currently in use
// map.on('style.load', function (e) {
//   console.log("loaded style")
// });

// Not currently in use
// $(window).resize(function() {
//   //setSizes();
// });

map.on("mousedown", function(e) {
  var center = map.getCenter().wrap();
  var zoom = map.getZoom();
  console.log(center, zoom, e.lngLat, e.point);
});

// Change the cursor to a pointer when the mouse is over the places layer.
// Does not work on the dynamically added layers?
map.on('mouseenter', 'lovese', function () {
    map.getCanvas().style.cursor = 'pointer';
});

// Change it back to a pointer when it leaves.
map.on('mouseleave', 'lovese', function () {
    map.getCanvas().style.cursor = '';
});

$("#hover-navigation .arrow").on("click", function() {
  if (app.navigation.state == app.navigation.visible) {
    $(".interactive-pane").css({"bottom":"130px"});
  } else if(app.navigation.state == app.navigation.hidden) {
    $(".interactive-pane").css({"bottom":"30px"});
  }
});

map.on('flystart', function(){
  flying = true;
});
map.on('flyend', function(){
  flying = false;
});
map.on('moveend', function(e){
  if(!flying && zoomedToArea){
    //map.fire(flyend);
    $(".container-full").fadeIn("1500");

    // Add marker for each area to the map (Lofoten, Vesterålen and Senja)
    areas.features.forEach(function(marker) {
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
    zoomedToArea = false;
  }
});

$("#map-filters ul li").on('click', function () {
  $(this).siblings().each(function(){
     $(this).removeClass("active");
     // Turn off any visible layers
     removeMapLayer($(this).attr('data-layer-name'));
     // remove any previously set info panes
     $("section[data-layer-name='" + $(this).attr('data-layer-name') + "']").removeClass("active");
  });
  $(this).addClass("active");
  // Turn on this map layer
  showMapLayer($(this).attr('data-layer-name'));
  // Update the info pane which corresponds to the button
  $("section[data-layer-name='" + $(this).attr('data-layer-name') + "']").addClass("active");
});

// Add a given map layer to the map
function showMapLayer(layer){
  if(layer !== undefined || layer !== null) {
    if(mapLayers[layer] == false) {
      map.addLayer({"id":layer,"source":layer,"type":"fill","paint": {"fill-opacity":mapLayersStyle[layer].opacity, "fill-color":mapLayersStyle[layer].color,"fill-outline-color":mapLayersStyle[layer].border_color}});

      if(layer === "lovese") {
        // Add labels for the different sea areas
        map.addLayer({
          "id": "lovese-labels",
          "type": "symbol",
          "source": "oil_areas",
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
      mapLayers[layer] = true;
    }
  }
}

// Remove a given map layer
function removeMapLayer(layer){
  if(layer !== undefined || layer !== null || layer !== "undefined") {
    if(mapLayers[layer] == true) {
      map.removeLayer(layer);
      if(layer === "lovese") {
        map.removeLayer("lovese-labels");
      }
      mapLayers[layer] = false;
    }
  }
}

function setSizes() {
  // Currently not in use
  var containerHeight = $(".interactive-pane").height();
  $(".interactive-pane").height(containerHeight - 130);
}

function zoomToArea() {
  if(app.navigation.state == app.navigation.visible) {
    $(".interactive-pane").css({"bottom":"30px"});
    app.navigation.toggle(); // toggle the nav
  }
  zoomedToArea = true;
  map.flyTo({
    center: [12.901721434467618,68.71391887946749],
    zoom: 6.54,
    // For perspective on the zoom - implement this to handle specific sections (oil prospects etc.)
    // pitch: 80, // pitch in degrees
    // bearing: 15, // bearing in degrees

    // These options control the flight curve, making it move
    // slowly and zoom out almost completely before starting
    // to pan.
    speed: 0.5, // make the flying slow
    curve: 1.5, // change the speed at which it zooms out

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
