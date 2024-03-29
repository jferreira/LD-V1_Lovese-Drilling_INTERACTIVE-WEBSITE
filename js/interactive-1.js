/*
for(var i = 0; i < 33; i++) {
console.log();
var section = $('<section></section>',{
id: 'cb-' + (i+1),
attr: {
"data-id" : (i+1)
},
html: "<img src='../../resources/_Images/_BG-Headers/" + (i+1) + ".png' />",
css: {}
}).appendTo("#features");
}
$("#features section:first-child").addClass("active");
*/

mapboxgl.accessToken = 'pk.eyJ1IjoibG92ZXNlIiwiYSI6ImNpeTF0NTIxdzAwODMycWx4anRuc2dteGoifQ.h_sW40YOKtU1XOVyrJlqaw';
var map = new mapboxgl.Map({
  container: 'map-1', // container id
  style: 'mapbox://styles/lovese/ciya7qynz006v2rl940yajywr', //hosted style id
  center: [14.032907135048276, 68.61364646452617], // starting position
  zoom: 2.7, // starting zoom,
  attributionControl: false
});

var chapters = {
  'cb-1': {
    center: [-102.2756374,45.9449108],
  },
  'cb-2': {
    center: [-98.25156673438437,40.75160515850669],
  },
  'cb-3': {
    center: [-165.35335965166905, 70.06500741925603],
  },
  'cb-4': {
    center: [150.47846597498315, -31.216397623097627],
  },
  'cb-5': {
    center: [131.35201521118802, -36.822138393420495],
  },
  'cb-6': {
    center: [14.032907135048276, 68.61364646452617],
  },
  'cb-7': {
    center: [12.401834935632564, 55.630479754891866],
  },
  'cb-8': {
    center: [6.575265599982572, 53.259401645954114],
  },
  'cb-9': {
    center: [-4.6440335746212895, 56.18290330382942],
  },
  'cb-10': {
    center: [14.166268,45.1336358],
  },
};

map.on('load', function() {
  map.resize();
});

map.on('style.load', function (e) {
  map.resize();
  //console.log(e.style.sprite); // Available markers

  map.addSource('markers', {
    "type": "geojson",
    "data": {
      "type": "FeatureCollection",
      "features":
      [{
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [14.032907135048276, 68.61364646452617]
        },
        "properties": {
          "title": "Lovese Drilling",
          "icon": "circle",
          "id": "cb-6"
        }
      }, {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [-102.2756374,45.9449108]
        },
        "properties": {
          "title": "North Dakota Pipeline",
          "icon": "circle",
          "id": "cb-1"
        }
      }, {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [-98.25156673438437,40.75160515850669]
        },
        "properties": {
          "title": "Keystone XL Pipeline",
          "icon": "circle",
          "id": "cb-2"
        }
      }, {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [-165.35335965166905, 70.06500741925603]
        },
        "properties": {
          "title": "Shell's Arctic Drilling",
          "icon": "circle",
          "id": "cb-3"
        }
      }, {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [150.47846597498315, -31.216397623097627]
        },
        "properties": {
          "title": "Leard Blockade",
          "icon": "circle",
          "id": "cb-4"
        }
      }, {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [131.35201521118802, -36.822138393420495]
        },
        "properties": {
          "title": "Great Australian Bight",
          "icon": "circle",
          "id": "cb-5"
        }
      }, {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [12.401834935632564, 55.630479754891866]
        },
        "properties": {
          "title": "Baltic Pipeline",
          "icon": "circle",
          "id": "cb-7"
        }
      }, {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [6.575265599982572, 53.259401645954114]
        },
        "properties": {
          "title": "Groningen Gas Fields",
          "icon": "circle",
          "id": "cb-8"
        }
      }, {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [-4.6440335746212895, 56.18290330382942]
        },
        "properties": {
          "title": "Scotland Fracking",
          "icon": "circle",
          "id": "cb-9"
        }
      }, {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [14.166268, 45.1336358]
        },
        "properties": {
          "title": "Plomin C",
          "icon": "circle",
          "id": "cb-10"
        }
      }
    ]
  }

});


/*
, {
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [-75.8069082, -1.0019231]
  },
  "properties": {
    "title": "Save Yasuní Rainforest",
    "icon": "circle"
  }
}
*/

// Reference: https://www.mapbox.com/mapbox-gl-js/style-spec/#layout_symbol

map.addLayer({
  "id": "markers",
  "source": "markers",
  "type": "symbol",
  "layout": {
    "icon-image": "{icon}-15",
    "text-field": "{title}",
    "icon-size" : 1,
    "text-offset": [0, 0.6],
    "text-anchor": "top",
    "icon-allow-overlap": true
  },
  "paint": {
    "text-color": "#fff"
  },
});
});

/*
var geojson = {
  "type": "FeatureCollection",
  "features":
  [{
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [14.032907135048276, 68.61364646452617]
    },
    "properties": {
      "title": "Lovese Drilling",
      "icon": "circle",
      "iconUrl" : "resources/_Images/_Icons/_Plus-Circle.png",
      "iconSize": [20, 20]
    }
  }, {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [-102.2756374,45.9449108]
    },
    "properties": {
      "title": "North Dakota Pipeline",
      "icon": "circle",
      "iconUrl" : "resources/_Images/_Icons/_Plus-Circle.png",
      "iconSize": [20, 20]
    }
  }, {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [-98.25156673438437,40.75160515850669]
    },
    "properties": {
      "title": "Keystone XL Pipeline",
      "icon": "circle",
      "iconUrl" : "resources/_Images/_Icons/_Plus-Circle.png",
      "iconSize": [20, 20]
    }
  }, {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [-165.35335965166905, 70.06500741925603]
    },
    "properties": {
      "title": "Shell's Arctic Drilling",
      "icon": "circle",
      "iconUrl" : "resources/_Images/_Icons/_Plus-Circle.png",
      "iconSize": [20, 20]
    }
  }, {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [150.47846597498315, -31.216397623097627]
    },
    "properties": {
      "title": "Leard Blockade",
      "icon": "circle",
      "iconUrl" : "resources/_Images/_Icons/_Plus-Circle.png",
      "iconSize": [20, 20]
    }
  }, {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [131.35201521118802, -36.822138393420495]
    },
    "properties": {
      "title": "Great Australian Bight",
      "icon": "circle",
      "iconUrl" : "resources/_Images/_Icons/_Plus-Circle.png",
      "iconSize": [20, 20]
    }
  }, {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [12.401834935632564, 55.630479754891866]
    },
    "properties": {
      "title": "Baltic Pipeline",
      "icon": "circle",
      "iconUrl" : "resources/_Images/_Icons/_Plus-Circle.png",
      "iconSize": [20, 20]
    }
  }, {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [6.575265599982572, 53.259401645954114]
    },
    "properties": {
      "title": "Groningen Gas Fields",
      "icon": "circle",
      "iconUrl" : "resources/_Images/_Icons/_Plus-Circle.png",
      "iconSize": [20, 20]
    }
  }, {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [-4.6440335746212895, 56.18290330382942]
    },
    "properties": {
      "title": "Scotland Fracking",
      "icon": "circle",
      "iconUrl" : "resources/_Images/_Icons/_Plus-Circle.png",
      "iconSize": [20, 20]
    }
  }, {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [14.166268, 45.1336358]
    },
    "properties": {
      "title": "Plomin C",
      "icon": "circle",
      "iconUrl" : "resources/_Images/_Icons/_Plus-Circle.png",
      "iconSize": [20, 20]
    }
  }
  ]
};

geojson.features.forEach(function(marker) {
  // Create a div element for the marker
  var el = document.createElement('div');
  // Add a class called 'marker' to each div
  el.className = 'marker';
  // By default the image for your custom marker will be anchored
  // by its top left corner. Adjust the position accordingly
  el.style.left = '-20px';
  el.style.top = '-20px';
  // Create the custom markers, set their position, and add to map
  new mapboxgl.Marker(el)
    .setLngLat(marker.geometry.coordinates)
    .addTo(map);
});


// add markers to map
geojson.features.forEach(function(marker) {
    // create a DOM element for the marker
    var el = document.createElement('div');
    el.className = 'marker';
    el.style.backgroundImage = 'url('+ marker.properties.iconUrl + ')';
    el.style.width = marker.properties.iconSize[0] + 'px';
    el.style.height = marker.properties.iconSize[1] + 'px';

    el.addEventListener('click', function() {
        window.alert(marker.properties.title);
    });

    // add marker to map
    new mapboxgl.Marker(el, {offset: [-marker.properties.iconSize[0] / 2, -marker.properties.iconSize[1] / 2]})
        .setLngLat(marker.geometry.coordinates)
        .addTo(map);
});
*/

var scrollChange = true;

function scrollToCarbonBattleground (element) {
  scrollChange = false;

  if(!$(element).hasClass("active")) {
    $('section').each(function () {
      $(element).removeClass('active');
    });
  }

  $("#features").animate({scrollTop: $("#features").scrollTop() + $(element).position().top}, 500, function() {
    // Animation complete.
    $(element).addClass('active');
    scrollChange = true;
  });
}

map.on('click', function (e) {
    // Use queryRenderedFeatures to get features at a click event's point
    // Use layer option to avoid getting results from other layers
    var features = map.queryRenderedFeatures(e.point, { layers: ['markers'] });
    // if there are features within the given radius of the click event,
    // fly to the location of the click event
    if (features.length) {
        // Get coordinates from the symbol and center the map on those coordinates
        map.flyTo({center: features[0].geometry.coordinates});
        var element = $('#' + features[0].properties.id);
        scrollToCarbonBattleground(element);
    }
});

map.on('mousemove', function (e) {
    var features = map.queryRenderedFeatures(e.point, { layers: ['markers'] });
    map.getCanvas().style.cursor = features.length ? 'pointer' : '';
});

$(document).ready(function () {
  $("#features").scroll(function (event) {
    var scrollPos = Math.round($(window).scrollTop());
    //console.log(scrollPos);
    $('section.battleground').each(function () {
      var currLink = $(this);

      var $this = $(this);
      var offset = $this.offset();
      var width = $this.width();
      var height = $this.height();

      var centerX = offset.left + width / 1.5;
      var centerY = offset.top + height / 1.5;

      if (currLink.position().top <= scrollPos && currLink.position().top + centerY > scrollPos) {
        if(scrollChange) {
          setActiveChapter(currLink.attr("id"));
          currLink.addClass("active");
        }
      } else {
        currLink.removeClass("active");
      }
    });
  });

  $('section.battleground').on('click', function (e) {
    e.preventDefault();
    scrollToCarbonBattleground($(this));
  });

  var activeChapterName = 'cb-6';
  function setActiveChapter(chapterName) {
    if (chapterName === activeChapterName) return;
    map.flyTo(chapters[chapterName]);
    activeChapterName = chapterName;
  }
});


//map.addControl(new mapboxgl.AttributionControl(), 'top-left');

/*

$("body").on("mousedown", function() {
  var center = map.getCenter().wrap();
  var zoom = map.getZoom();
  console.log(center, zoom);
});
*/
