"use strict";

var app = {
  currNav: 0,
  video: $("video")[0],
  interactiveState: false,
  played: false,
  player: 0,
  init: function() {
    app.attachObservers();
    app.attachScripts();
    app.helpers.updateContent();
  },
  attachObservers: function() {

    /* Functions for dragging and spanning the episodes menu */
  	var x,y,top,left,down;

  	$("#navigation").on("mousedown", function(e) {
  		e.preventDefault();
  		down = true;
  		x = e.pageX;
  		y = e.pageY;
  		top = $(this).scrollTop();
  		left = $(this).scrollLeft();
  	});

  	$("#navigation").on("mousemove", function(e) {
  		if(down){
  			var newX = e.pageX;
  			var newY = e.pageY;
  			$("#navigation").scrollLeft(left - newX + x);
  		}
  	});

  	$("#navigation").on("mouseup", function(e) {
  		e.preventDefault();
  		down = false;
  	});

    /* Show navigation if the video is currently playing. Includes video + interactive elements */
  	$("#navigation").on("mouseenter", function() {
  		if (!video.paused || app.interactiveState) {
  			if($('#navigation').hasClass('show')) {
  				$('#navigation').removeClass('show');
  			}
  		}
  	}).on("mouseleave", function() {
  		if (!video.paused || app.interactiveState) {
  			if(!$('#navigation').hasClass('show')) {
  				$('#navigation').addClass('show');
  			}
  		}
  	});

    $(window).on("resize", function() {
      $("#video").fitVids();
    });

  },
  attachScripts: function() {
    $(document).ready(function() {

    	var interactiveSlots = nav.episodes.length;
    	var episodesLength = 0;

    	for(var i = 0; i < nav.episodes.length; i++) {
        var episodeWidth = 80 / nav.episodes.length;
    		var interactiveWidth = 20 / interactiveSlots;

    		episodesLength += parseFloat(nav.episodes[i].duration);

    		var episode = $('<div></div>',{
    		   id: 'episode_' + i,
    		   class: 'episode',
    		   attr: {
    			   "data-id" : nav.episodes[i].id,
    			   "onClick" : "app.helpers.updateContent("+i+")"
    		   },
    		   html: "<h1>EP"+nav.episodes[i].id+"<br />" + nav.episodes[i].title + "</h1>",
    		   css: {'width': episodeWidth + "%"}
    		}).appendTo("#episodeSelection");

    		var interactive = $('<div></div>',{
    		   id: 'interactive_' + i,
    		   class: 'interactive',
    		   attr: {
    			   "data-id" : nav.episodes[i].id,
    			   "onClick" : "app.helpers.loadInteractiveContent("+nav.episodes[i].id+")"
    		   },
    		   html: "",
    		   css: {'width': interactiveWidth + "%"}
    		}).appendTo("#episodeSelection");
    	}

    	$("#episodeSelection").css("width" , "100%");
    });
  },
  helpers: {
    updateContent: function(episode) {
      if(!app.played) {
        var options = {
            id: nav.episodes[app.currNav].vid,
            width: $("#video").width(),
            loop: false
        };

        app.player = new Vimeo.Player('video', options);
        app.played = true;
      }
      $("#video").fitVids();

    	app.interactiveState = false;
    	var episodeId;

    	if(episode === undefined || episode === null) {
    		episodeId = app.currNav;
    	} else {
    		episodeId = episode;
    		app.currNav = episodeId;
    	}
    	$(".nav-holder *").fadeIn(500);

    	// Remove interactive content if it's present
    	if($("#content #interactive *").is(":visible")) {
    		$("#content #interactive").empty();
    	}
    	if($('#episodeProgress *').is(":hidden")) $('#episodeProgress *').show();

    	$("#video").css({
    		"background": 'url("'+nav.episodes[app.currNav].poster+'") no-repeat',
    		"background-size": 'cover',
        "background-position": 'center center'
    	});

      app.player.loadVideo(nav.episodes[app.currNav].vid).then(function(id) {
          // the video successfully loaded
      }).catch(function(error) {});

      app.player.on('play', function() {
          console.log('played the video!');
      });

    	// $("#video video").attr({
    	// 	"src": nav.episodes[episodeId].video
    	// });

    	$("#titles h1").text(nav.episodes[episodeId].title);
    	$("#titles span.subtitle").text(nav.episodes[episodeId].subtitle);
    	$("#titles span.description").text(nav.episodes[episodeId].description);
    	$("#content *, #titles *").fadeIn(1000);
    	$(".timeRemaining").text("0:00");
    	$('#btn-play-pause').removeClass('pause').addClass('play');
    	$(".avancee").css({width:"0%"});
    },

    loadInteractiveContent: function(id) {
    	app.interactiveState = true;
    	// Remove anything related to the video player
    	// Concider removing the whole player layer?
    	$('#navigation').toggleClass('show');

    	$("#video video").attr({"src": ""});
    	$(".timeRemaining").text("");
    	$(".avancee").css({width:"0%"});
    	$('#btn-play-pause').removeClass('pause').addClass('play');

    	$(".nav-holder *").fadeOut(1000);
    	$('#episodeProgress *').hide();

    	$("#content #video, #titles *").hide();
    	$("#content #interactive").empty();

      // Fetch the external resources. Maybe use the whole ajax method to be able to do a loading bar before the map is finished.
      $("#content #interactive").load(nav.interactive[id-1].html, function(response, status, xhr) {
        if(status == "error") {
          //Something went wrong, have your error fallback code here
        }
      });
    },

    checkVideo: function() {
    	if (app.video.paused == true) {
    		app.video.play();
    		$("#video").css({"background-image":"none", "background-color": "#000"});
    	} else {
    		app.video.pause();
    		$(".nav-holder *").fadeIn(1000);
    	}
    	if($("#titles *").is(":visible")) {
    		$("#titles *").fadeOut(1000);
    		$(".nav-holder *").fadeOut(1000);
    	}
    }
  }
}
$(app.init);
