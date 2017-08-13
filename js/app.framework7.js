"use strict";

var app = {
  currEpisode: 0,                // Current episode
  currInteractive: 0,            // Current interaction
  liveEpisodes: 2,               // 0=1,1=2,2=3 etc. Second episode is live
  interactiveState: false,       // True/false are we in an interactive state
  interactiveAutoplay: null,     // null (unknown) / yes / no - are we autoplaying the interaction
  interactiveTimer: null,        // Timer for items in the interaction
  interactiveCurrentParts: null, // Current interaction parts
  interactiveCurrentItem: null,  // Current interaction item
  textPageState: false,          // True/false are we in an text page state
  introSequence1Time: 10,
  introSequence2Time: 10,
  hashUrlMapEpisodes: [
    "ep1", "ep2", "ep3", "ep4", "ep5", "ep6"
  ],
  hashUrlMapEpisodesInteractive: [
    "ep1-interactive", "ep2-interactive", "ep3-interactive", "ep4-interactive", "ep5-interactive", "ep6-interactive"
  ],

  init: function() {
    app.layover.init();
    //app.showIntroScreen1();

    app.video.init();
    app.navigation.init();

    app.attachObservers();
    app.attachScripts();

    if (window.location.hash) {
      // If a hash is present - show the specific episode or interactive part
      var hash = window.location.hash.substring(1); //Puts hash in variable, and removes the # character
      app.navigation.hashNavigation(hash);
    } else {
      app.helpers.updateContent(0);
    }
    //app.helpers.preload(); // Doesn't work
  },
  attachObservers: function() {
    // Navigation
    $("#hover-navigation .arrow_left").on("click", app.toPrevious);
    $("#hover-navigation .arrow_show_hide").on("click", app.navigation.toggle);
    $("#hover-navigation .arrow_right").on("click", app.toNext);

    // Video control
    $(".video-controls").on("click", app.video.start);
    $("video").on("click", app.video.toggle);
    //$('#btn-play-pause').on("click", app.video.toggle);
    $('.play_pause_button').on("click", app.video.toggle);


    // Internal video events
    $("video").on("timeupdate", app.updateTime);

    $('video').on('ended', app.videoEnded);
    $('#seek-bar').on('change', app.videoChange);

    //$('#seek-bar').on('mousedown', app.video.toggle);
    //$('#seek-bar').on('mouseup', app.video.toggle);

    $('#episodeProgress').on("click", app.handleProgressClick);

    // Layover
    $("body").on("click", "[rel=closelayover]", app.closeLayover);
    $("body").on("click", "[rel=nextlayover]", app.showIntroScreen2);

    // Shortcuts
    $("body").on('keydown', function(event) {
      if (event.keyCode == 32) // Spacebar
        app.video.toggle();

      if (event.keyCode == 37) // Left
        app.toPrevious();

      if (event.keyCode == 39) // Right
        app.toNext();

      if (event.keyCode == 38 || event.keyCode == 40) // up / down
        app.navigation.toggle();
    });

    //$("#navPrev").on("click", app.toPrevious);
    //$("#navNext").on("click", app.toNext);

    $("#mute-video").click(function() {
      if ($("video").prop('muted')) {
        $("video").prop('muted', false);
      } else {
        $("video").prop('muted', true);
      }
    });

    /*
    document.getElementById('v').addEventListener('ended',myHandler,false);
    function myHandler(e) {
      // What you want to do after the event
      console.log("video ended", e);
    }

    $('video').on('ended',function(){
      console.log('Video has ended!');
    });
    */
  },
  attachScripts: function() {
    // Always have the arrow down when navigation is visible
    // and up when hidden
    app.navigation.callbacks.preShow.push(function() {
      $("#hover-navigation .arrow_show_hide").removeClass("arrow_up").addClass("arrow_down");
    });
    app.navigation.callbacks.preHide.push(function() {
      $("#hover-navigation .arrow_show_hide").removeClass("arrow_down").addClass("arrow_up");
    });

    // Hide various elements when the video starts playing
    // and show them again when paused
    app.video.callbacks.preStart.push(function() {
      app.navigation.hide();

      $("#video").css({
        "background-image": "none",
        "background-color": "#000"
      });
      $("#titles").hide();
      $(".nav-holder *").fadeOut(1000);

      $('.play_pause_button').removeClass('play').addClass('pause');
      $('video').css("z-index", "1");
    });
    app.video.callbacks.prePause.push(function() {
      app.navigation.show();

      $(".nav-holder *").fadeIn(1000);
      $("#titles, .video-controls").show();

      $(".slide-container").css({
        "background-image": 'none'
      }); // Remove the title slide when video is paused

      $('.play_pause_button').removeClass('pause').addClass('play');
      $('video').css("z-index", "0");
    });
  },
  /**
   * TODO: These two new functions which would include interactive parts
   * Navigate to the previous episode or interactive part.
   */
  /*
  toPrevious: function() {
    if (app.currEpisode > 0) {
      if(app.currEpisode > app.currInteractive) {
        app.helpers.loadInteractiveContent(app.currInteractive+1);
        app.currInteractive--;
        console.log("interactive now: " + app.currInteractive)
      } else {
        app.currEpisode--;
        app.helpers.updateContent();
        console.log("episode now: " + app.currEpisode)
      }
    }
  },
  */
  /**
   * Navigate to the next episode or interactive part.
   * If we are at last viewable content, show prompt to subscribe to newsletter.
   */
  /*
  toNext: function() {
    if (app.currEpisode <= nav.episodes.length-2) {
      if(app.currEpisode == app.currInteractive && app.currEpisode <= app.liveEpisodes) {
        app.helpers.loadInteractiveContent(app.currInteractive+1);
        app.currInteractive++;
        console.log("interactive now: " + app.currInteractive)
      } else {
        app.currEpisode++;
        app.helpers.updateContent();
        console.log("episode now: " + app.currEpisode)
      }
    }
  },
  */
  toPrevious: function() {
    if (app.currEpisode > 0) {
      app.currEpisode--;
      app.helpers.updateContent();
    }
  },
  toNext: function() {
    if (app.currEpisode <= nav.episodes.length - 2) {
      app.currEpisode++;
      app.helpers.updateContent();
    }
  },
  updateTime: function() {
    if (this.readyState > 0) {
      var value = (100 / this.duration) * this.currentTime;

      var minutes = parseInt((this.duration - this.currentTime) / 60, 10);
      var seconds = (this.duration - this.currentTime) % 60;

      seconds = Math.ceil(seconds);
      $(".timeRemaining").text(minutes + ":" + app.helpers.twoDigits(seconds));

      var d = 100 * this.currentTime / this.duration;
      $(".avancee").css({
        width: d + "%"
      });

      $("#seek-bar").val(value);
    }
  },
  handleProgressClick: function(event) {
    // Ignore clicks on other elements in the progress bar
    if ($(event.target).is('button'))
      return;

    var x = event.pageX - $(this).offset().left;
    var percent = x / $(this).width();

    app.video.setTo(percent);
  },
  videoEnded: function() {
    app.loadInteractiveContent(nav.episodes[app.currEpisode].id);
    // Animate the interactive icon of this episode - but the navigation bar isn't showing, so doesn't help
    //$('.interactive[data-id="' + app.currEpisode + '"]').addClass('animated bounceIn');
  },
  videoChange: function() {
    var time = app.video.element.duration * ($("#seek-bar").val() / 100);
    // Update the video time
    app.video.element.currentTime = time;
    console.log("scrub", time);
  },
  helpers: {
    preload: function() {
      for (var i = 1; i < nav.episodes.length; i++) {
        $('<img />').attr('src', nav.episodes[i].poster).appendTo('#preload').css('display', 'none');
        $('<img />').attr('src', nav.episodes[i].slide).appendTo('#preload').css('display', 'none');
      }
    },
    twoDigits: function(n) {
      return (n <= 9 ? "0" + n : n);
    },
    setHashUrl: function(type, content) {
      var hashString = '#';
      if (type == 0) {
        hashString += app.hashUrlMapEpisodes[content];
      } else if (type == 1) {
        hashString += app.hashUrlMapEpisodesInteractive[content];
      }
      window.location.hash = hashString;
    },
    updateContent: function(episode) {
      var episodeId;
      if (episode === undefined || episode === null) {
        episodeId = app.currEpisode;
      } else {
        episodeId = episode;
        app.currEpisode = episodeId;
      }

      app.helpers.setHashUrl(0, episodeId);

      // Show/hide play button
      if (episodeId > app.liveEpisodes) {
        $("img.video-controls").css({
          "width": 0,
          "height": 0
        });
        //$("button.play").attr("disabled", true);
        $(".play_pause_button").hide();
      } else {
        $("img.video-controls").css({
          "width": "50px",
          "height": "auto"
        });
        //$("button.play").attr("disabled", false);
        $(".play_pause_button").show();
      }

      app.interactiveState = false;
      app.textPageState = false;

      app.video.pause();
      $('video').css("z-index", "-1");
      $(".nav-holder *").fadeIn(500);

      // Remove interactive content if it's present
      if ($("#content #interactive *").is(":visible"))
        $("#content #interactive").empty();

      if ($('#episodeProgress *').is(":hidden"))
        $('#episodeProgress *').show();

      $("#video").css({
        "background": 'url("' + nav.episodes[app.currEpisode].poster + '") no-repeat',
        "background-size": 'cover',
        "background-position": 'center center'
      });

      $("video").attr({
        "src": nav.episodes[episodeId].mp4
        //"poster": nav.episodes[episodeId].poster
        //"preload": "auto"
        //"autoplay": "autoplay"
      }).hide(); //hack to fix the load of video before image issue

      $(".slide-container").css({
        "background": 'url("' + nav.episodes[app.currEpisode].slide + '") no-repeat',
        "background-size": 'cover',
        "background-position": 'center center'
      });

      // $("#titles h1").text(nav.episodes[episodeId].title);
      // $("#titles span.subtitle").text(nav.episodes[episodeId].subtitle);
      // $("#titles span.description").text(nav.episodes[episodeId].description);
      $("#content *, #titles").show();
      $(".timeRemaining").text("0:00");
      $('.play_pause_button').removeClass('pause').addClass('play');
      $(".avancee").css({
        width: "0%"
      });
    },
    loadTextPage: function(id) {
      app.textPageState = true;
      app.navigation.hide();

      // Copied from loadInteractiveContent
      $("#video video").attr({
        "src": ""
      });
      $(".timeRemaining").text("");
      $(".avancee").css({
        width: "0%"
      });
      $('.play_pause_button').removeClass('pause').addClass('play');

      //$(".nav-holder *").fadeOut(1000);
      $('#episodeProgress *').hide();

      $("#content #video, #titles").hide();
      $("#content #interactive").empty();

      // Fetch the external resources. Maybe use the whole ajax method to be able to do a loading bar before the map is finished.
      $("#content #interactive").load(nav.textPages[id - 1].html, function(response, status, xhr) {
        if (status == "error") {
          //Something went wrong, have your error fallback code here
        }
      });
    },
    resetVideo: function() {
      $("#video video").attr({"src": ""});
    },
    resetTimer: function() {
      $(".timeRemaining").text("");
      $(".avancee").css({"width": "0%"});
    },
    resetInteractiveContainer: function() {
      $("#content #interactive").empty();
    },
    hidePlayButton: function() {
      $('.play_pause_button').removeClass('pause').addClass('play').hide();
    },
    startInteractionPart: function(parts, partNo) {
      var partName = Object.keys(parts)[partNo];
      var part     = parts[partName];
      
      app.interactionCurrentParts = parts;
      app.interactionCurrentItem  = partNo;

      // Call the function
      eval(part.call)();

      var timeToNext = part.time * 1000;

      // And start the timer for the next interaction
      // if this one is not the last one
      if (partNo != Object.keys(app.interactionCurrentParts).length - 1) {
        app.interactionTimer = setTimeout(function() {
          if (app.interactiveAutoplay !== true)
            return; // Do nothing

          // start the next part
          app.helpers.startInteractionPart(
            app.interactionCurrentParts,
            app.interactionCurrentItem + 1
          );
        }, timeToNext);
      }
    }
  },
  loadInteractiveContent: function(id) {
    app.currInteractive  = id;
    app.interactiveState = true;
    app.textPageState    = false;

    app.helpers.setHashUrl(1, id - 1);
    app.helpers.resetVideo();
    app.helpers.hidePlayButton();
    app.helpers.resetInteractiveContainer();

    $("#content #video, #titles").hide();

    // Fetch the external resources. Maybe use the whole ajax method to be able to do a loading bar before the map is finished.
    // TODO: Handle error callback
    $("#content #interactive").empty().load(nav.interactive[id - 1].html);

    if (app.navigation.state == app.navigation.visible) {
      app.navigation.state = app.navigation.hidden;
      app.navigation.hide();
    }

  },
  startInteractiveTimers: function() {
    var currentInteraction = nav.interactive[app.currInteractive - 1];

    // Timings of the episode
    if ("parts" in currentInteraction) {
      var parts = currentInteraction.parts;

      app.interactiveAutoplay = true;

      // Start the first timer
      app.helpers.startInteractionPart(parts, 0);
    }
  },
  // showIntroScreen1: function() {
  //   /*
  //   app.layover.updateContent(
  //   "<h1 class='brand-heading'>LoVeSe Drilling</h1>"+
  //   "<p class='intro-text'>Across the world, local communities are fighting to stop new coal, oil and gas projects.</p><br />"+
  //   "<p class='intro-text'>This interactive documentary explores how one of the most vulnerable and productive ecosystems in the world could be handed over to the oil industry in 2017."+
  //   "<br /><br />" +
  //   "<p class='intro-text'>After each episode there is an interactive element which you can use to explore the issue.</p>" +
  //   "<button class='btn btn-default btn-lg' rel=\"closelayover\">Start the experience</button>"
  // );
  // */
  //   app.layover.cycleIntroContent(app.introSequence1Time, ".content-first");
  //   app.layover.show();
  // },
  showIntroScreen2: function() {
    $(app.layover.element).children(".content-first").removeClass("active");
    app.layover.cycleIntroContent(app.introSequence2Time, ".content-second");
    //app.layover.show();
  },
  closeLayover: function() {
    app.helpers.updateContent(0);
    app.layover.hide();
  }
}
$(app.init);
