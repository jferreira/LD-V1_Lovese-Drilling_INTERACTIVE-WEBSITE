/*!
 * Start Bootstrap - Grayscale Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

// jQuery to collapse the navbar on scroll
$(window).scroll(function() {
    if ($(".navbar").offset().top > 50) {
        $(".navbar-fixed-top").addClass("top-nav-collapse");
    } else {
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
    }
});

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function() {
    $('.navbar-toggle:visible').click();
});

L.mapbox.accessToken = 'pk.eyJ1IjoiaGF2YXJkbCIsImEiOiJtSTFleXg4In0.bCnuP121PLOPrqhdwUwYDA';
var mapinfo = L.mapbox.map('map', 'mapbox.streets')
    .setView([68.635428,15.463257], 6);

   var map = L.mapbox.map('trip-map', 'mapbox.streets')
   .setView([68.7,17], 7);

       map.on('click', function(e) {
           // Let's add a callback to makeMarker so that it can draw the route only
           // *after* it's done processing the marker adding.
          // makeMarker(e, drawRoute);
       });

       var coordinates = [
         [67.6718510,12.6566600], // Værøy
         [67.932387, 13.088733], // Reine
         [68.089448, 13.229474],  //ramberg
         [68.103797, 13.30204], // Flakstad
         [68.132715, 13.441086], // Napp
         [68.033271, 13.340836], // Nusfjord
         [68.075869, 13.542709], // Ballstad
         [68.145498, 13.607254], // Leknes
         [68.270912, 13.583908], // Unstad
         [68.153676, 14.211502], // Henningsvær
         [68.210388, 14.477105], // Kabelvåg
         [68.234309, 14.568224], // Svolvær
         [68.564838, 14.909872], // Stokmarknes
         [68.695439, 15.412809], // Sortland
         [68.618655, 14.460672], // Bø
         [68.995812, 15.013565], // NYksund
         [69.31608, 16.120228], // Andenes
         [69.363265, 17.034266], // Gryllefjord
         [69.465202, 17.22564], // Bøvær
         [69.481213, 17.401743], // Ersfjord
         [69.496826, 17.489829], // Senjahopen
         [69.507443, 17.902924], // Botnhamn
         [69.649205, 18.955324] // Tromsø
       ];

       var places = [
         'Værøy',
         'Reine',
         'Ramberg',
         'Flakstad',
         'Napp',
         'Nusfjord',
         'Ballstad',
         'Leknes',
         'Unstad',
         'Henningsvær',
         'Kabelvåg',
         'Svolvær',
         'Stokmarknes',
         'Sortland',
         'Bø',
         'Nyksund',
         'Andenes',
         'Gryllefjord',
         'Bøvær',
         'Ersfjord',
         'Senjahopen',
         'Botnhamn',
         'Tromsø'
       ];

       var waypoints = [];
       var polyline = L.polyline([], {color: '#000'}).addTo(map);

       var geojson = {
           type: 'FeatureCollection',
           features: []
       };

       function makeMarker(e, done) {
           var marker = L.marker(e.latlng, { draggable: true }).addTo(map);
           marker.on('dragend', drawRoute);
           waypoints.push(marker);
           return done();
       }

       for(var i = 0; i < coordinates.length; i++) {
        var marker = L.marker(coordinates[i], { draggable: false });
        waypoints.push(marker);

         var data = {
             type: 'Feature',
             properties: {
                 title: places[i],
                 'marker-color': '#42dca3',
                 'marker-size': 'large',
                 'marker-symbol': 'town-hall'
             },
             geometry: {
                 type: 'Point',
                 coordinates: [coordinates[i][1], coordinates[i][0]]
             }
         }
         geojson.features.push(data);
       }
       drawRoute();

       function drawRoute() {
           if (waypoints.length < 2) return;

           var points = waypoints.map(function(marker) {
               var latlng = marker._latlng;
               return [latlng.lng, latlng.lat].join(',');
           }).join(';');

           var directionsUrl = 'https://api.mapbox.com/directions/v5/mapbox/driving/' +
           points + '.json?access_token=' + L.mapbox.accessToken + '&geometries=geojson&steps=false&overview=full';
           console.log(directionsUrl);
           $.get(directionsUrl, function(data) {
              console.log(data);
               // Do something with the directions returned from the API.
               var route = data.routes[0].geometry.coordinates;
               console.log(route);
               route = route.map(function(point) {
                   // Turns out if we zoom out we see that the lat/lngs are flipped,
                   // which is why it didn't look like they were being added to the
                   // map. We can invert them here before drawing.
                   return [point[1], point[0]];
               });
               polyline.setLatLngs(route);
           });
       }

       var myLayer = L.mapbox.featureLayer().addTo(map);
       myLayer.setGeoJSON(geojson);
       myLayer.on('mouseover', function(e) {
           e.layer.openPopup();
       });
       myLayer.on('mouseout', function(e) {
           e.layer.closePopup();
       });
