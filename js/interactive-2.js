// https://stackoverflow.com/questions/35452705/mapbox-leaflet-increase-marker-size-on-zoom
// Show/hide on specific zoom level: https://www.mapbox.com/mapbox-gl-js/example/updating-choropleth/
// Use layers instead of markers? https://stackoverflow.com/questions/40153538/how-to-hide-point-labels-at-certain-zoom-levels-in-mapbox-gl-js
// min zoom or stops: http://android.wekeepcoding.com/article/11539332/How+to+hide+point+labels+at+certain+zoom+levels+in+mapbox-gl-js%3F
// https://www.mapbox.com/mapbox-gl-js/example/add-image/
// OR: https://www.mapbox.com/mapbox-gl-js/example/animate-images/


var zoomedToArea = false;
var flying = false;
var startDelay = 2000;
var totalTime = 60 * 2;

var paused;
var countdown;

// https://www.mapbox.com/help/custom-markers-gl-js/
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

// var filters = document.getElementById('filters');
//
// map.addSource('cod', {
//     type: 'geojson',
//     data: 'cod.geojson'
// }).on('ready', layer);
//
// function layer() {
//   var layer = this;
//   var name = layer.getGeoJSON().name;
//
//   var item = filters.appendChild(document.createElement('div'));
//   var checkbox = item.appendChild(document.createElement('input'));
//   var label = item.appendChild(document.createElement('label'));
//   checkbox.type = 'checkbox';
//   checkbox.id = name;
//   label.innerHTML = name;
//   label.setAttribute('for', name);
//   checkbox.addEventListener('change', update);
//
//   function update() {
//     (checkbox.checked) ? layer.addTo(map) : map.removeLayer(layer);
//   }
// }

map.on('load', function() {
  //console.log("loaded everything");

  map.addSource('corals', { type: 'geojson', data: '../include/map-layers/corals.geojson' });
  map.addSource('cod', { type: 'geojson', data: '../include/map-layers/cod.geojson' });

  map.addSource('lovese', { type: 'geojson', data: '../include/map-layers/lovese_blocks.geojson' });
  map.addSource('oil_areas', {type: 'geojson', data : oilareas});

  map.addSource('oil_prospects', { type: 'geojson', data: '../include/map-layers/prospekter_union.geojson' });
  map.addSource('opened_oil_areas', { type: 'geojson', data: '../include/map-layers/opened_areas.geojson' });

  // Style specification: https://www.mapbox.com/mapbox-gl-js/style-spec/
  // map.addLayer({
  //   "id": "corals",
  //   "type": "circle",
  //   "source": "corals",
  //   'layout': {
  //     'visibility': 'visible'
  //   },
  //   "paint": {
  //     'circle-radius': 5,
  //     'circle-opacity': 0.5,
  //     'circle-color': 'rgba(172,255,178,1)'
  //   },
  //   "filter": ["==", "$type", "Point"],
  // });

  // var filters = document.getElementById('map-filters');
  // var item = filters.appendChild(document.createElement('div'));
  // var checkbox = item.appendChild(document.createElement('input'));
  // var label = item.appendChild(document.createElement('label'));
  // checkbox.type = 'checkbox';
  // checkbox.id = "Test";
  // label.innerHTML = "Test";
  // label.setAttribute('for', "Test");
  // checkbox.addEventListener('change', update);

  function update() {
  (checkbox.checked) ? map.addLayer({"id":"lovese","source":"lovese","type":"fill","paint": {"fill-opacity":0.5, "fill-color":"#fff","fill-outline-color":"#000"}}) : map.removeLayer("lovese");
    console.log("Updated");
  }

  // map.on('click', 'body > #lovese', function (e) {
  //   console.log("CLICKED");
  //   // new mapboxgl.Popup()
  //   //   .setLngLat(e.features[0].geometry.coordinates)
  //   //   .setHTML(e.features[0].properties.description)
  //   //   .addTo(map);
  // });

  map.resize();
  $(".loading").fadeOut(1500).promise().done(function() {
    // Fadeout done, start the timer for going through the map (2 minutes)
    setTimeout(function() {
      zoomToArea();
    }, startDelay);
  });
});

map.on('style.load', function (e) {
  console.log("loaded style")
});

$(window).resize(function() {
  //setSizes();
});

//$("body")
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
  console.log("moveend");
  if(!flying && zoomedToArea){
    // tooltip or overlay here
    //map.fire(flyend);
    //console.log("we are here");
    $(".container-full").fadeIn("1500");

    // add marker for each area to map
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
            //window.alert(marker.properties.message);
            console.log(marker, point);
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

// $('#map-filters img').on('mouseenter mouseleave', function() {
//   console.log("Should change");
//     $(this).attr({
//         'src': $(this).attr('data-other-src'), 'data-other-src': $(this).attr('src')
//     });
// });

$("#map-filters ul li").on('click', function () {
  $(this).siblings().each(function(){
     $(this).removeClass("active");
     // Turn off any visible layers
     removeMapLayer($(this).attr('data-layer-name'));
  });
  $(this).addClass("active");
  // Turn on this map layer
  showMapLayer($(this).attr('data-layer-name'));
});

// Add a given map layer to the map
function showMapLayer(layer){
  // Create a global array with the specific colors and opacity for each layer

  if(layer !== undefined || layer !== null) {
    map.removeLayer(layer);
    map.addLayer({"id":layer,"source":layer,"type":"fill","paint": {"fill-opacity":0.5, "fill-color":"#fff","fill-outline-color":"#000"}});

    if(layer === "lovese") {
      // Do this after loading the sub areas (with the timed transition or on click)
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
  }
}

// Remove a given map layer
function removeMapLayer(layer){
  if(layer !== undefined || layer !== null || layer !== "undefined") {
      map.removeLayer(layer);
  }
  if(layer === "lovese") {
    map.removeLayer("lovese-labels");
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
    // For perspektiv:
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

/*
if(this.readyState > 0) {
var value = (100 / this.duration) * this.currentTime;

var minutes = parseInt((this.duration - this.currentTime) / 60, 10);
var seconds = (this.duration - this.currentTime) % 60;

seconds = Math.ceil(seconds);
$(".timeRemaining").text(minutes + ":" + app.helpers.twoDigits(seconds));

var d = 100 * this.currentTime / this.duration;
$(".avancee").css({width:d+"%"});

$("#seek-bar").val(value);
}
*/

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

  var mapF = $('.map-features .map-details');
  var $active = mapF.eq(0);

  var $next = $active.next();
  var timer = setInterval(function() {
    $next.addClass("active");
    $active.removeClass("active");
    $active = $next;

    // Do map operations

    $next = (mapF.last().index() == mapF.index($active)) ? $next = mapF.eq(0): $active.next();

    if(mapF.last().index() == mapF.index($active)) {
      clearInterval(timer);
      timer = null;
      // Move to next episode.
    }
  }, sectionTime);
}
