mapboxgl.accessToken = 'pk.eyJ1IjoibG92ZXNlIiwiYSI6ImNpeTF0NTIxdzAwODMycWx4anRuc2dteGoifQ.h_sW40YOKtU1XOVyrJlqaw';

var map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/lovese/ciy1xowr100e22rqlyky3qgcg', //hosted style id
  center: [12.901721434467618,68.71391887946749], // starting position
  zoom: 6.54, // starting zoom,
  pitch: 80, // pitch in degrees
  bearing: 15, // bearing in degrees
  attributionControl: false
});

function setSizes() {
  console.log("Resize")
  var containerHeight = $(".interactive-pane").height();
  $(".interactive-pane").height(containerHeight - 130);
}

map.on('load', function() {
  console.log("loaded everything");
  map.resize();
  $(".container-full").show();
  $(".loading").fadeOut(1500).promise().done(function() {
    // Fadeout done, start the timer for going through the map (2 minutes)
    startMapFeautures();
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
  } else {
    $(".interactive-pane").css({"bottom":"30px"});
  }
});

function startMapFeautures() {
  var totalTime = (60 * 2) * 1000
  var sectionTime = totalTime / $('.map-details').length;
  sectionTime = 1000;

  var mapF = $('.map-features .map-details');
  var $active = mapF.eq(0);

  var $next = $active.next();
  var timer = setInterval(function() {
    $next.addClass("active");
    $active.removeClass("active");
    $active = $next;

    // Do map operations

    $next = (mapF.last().index() == mapF.index($active)) ?
    $next = mapF.eq(0): $active.next();
    if(mapF.last().index() == mapF.index($active)) {
      clearInterval(timer);
      timer = null;
    }
  }, sectionTime);
}
