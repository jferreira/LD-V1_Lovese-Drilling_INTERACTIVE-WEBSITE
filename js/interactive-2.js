var zoomedToArea = false;
var flying = false;
var startDelay = 2000;
var totalTime = 60 * 2;

var paused;
var countdown;

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

function setSizes() {
  console.log("Resize")
  var containerHeight = $(".interactive-pane").height();
  $(".interactive-pane").height(containerHeight - 130);
}

map.on('load', function() {
  console.log("loaded everything");

  map.addSource('corals', { type: 'geojson', data: '../include/map-layers/corals.geojson' });
  map.addSource('cod', { type: 'geojson', data: '../include/map-layers/cod.geojson' });
  //map.addSource('oil', { type: 'json', data: '../include/map-layers/prospekter.json' });

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


    var item = filters.appendChild(document.createElement('div'));
    var checkbox = item.appendChild(document.createElement('input'));
    var label = item.appendChild(document.createElement('label'));
    checkbox.type = 'checkbox';
    checkbox.id = "Test";
    label.innerHTML = "Test";
    label.setAttribute('for', "Test");
    checkbox.addEventListener('change', update);

    function update() {
      (checkbox.checked) ? map.addLayer({"id":"cod","source":"cod","type":"fill"}) : map.removeLayer("cod");
      console.log("Updated");
    }


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

$("body").on("mousedown", function() {
  var center = map.getCenter().wrap();
  var zoom = map.getZoom();
  console.log(center, zoom);
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
    console.log("we are here");
    $(".container-full").fadeIn("1500");
    //startMapFeautures();

    if (countdown) {
      clearInterval(countdown);
    }
    paused = false;

    startTimer(totalTime);
    startMapFeautures();
    zoomedToArea = false;
  }
});

function zoomToArea() {
  if(app.navigation.state == app.navigation.visible) {
    $(".interactive-pane").css({"bottom":"30px"});
    app.navigation.toggle(); // toggle the nav
  }
  zoomedToArea = true;
  map.flyTo({
    center: [12.901721434467618,68.71391887946749],
    zoom: 6.54,
    pitch: 80, // pitch in degrees
    bearing: 15, // bearing in degrees

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
