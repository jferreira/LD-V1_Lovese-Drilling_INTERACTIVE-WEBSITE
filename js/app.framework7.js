"use strict";

var app = {
  currEpisode: 0,
  currInteractive: 0,
  liveEpisodes: 3, // 0=1,1=2,2=3 etc. Second episode is live
  interactiveState: false,
  textPageState: false,
  introSequence1Time: 10,
  introSequence2Time: 10,
  hashUrlMapEpisodes: Array(6),
  hashUrlMapEpisodesInteractive: Array(6),
  hash: 0,

  init: function() {
    app.layover.init();
    //app.showIntroScreen1();

    app.video.init();
    app.navigation.init();

    app.attachObservers();
    app.attachScripts();

    // Better way to do this?
    app.hashUrlMapEpisodes[0] = "ep1";
    app.hashUrlMapEpisodes[1] = "ep2";
    app.hashUrlMapEpisodes[2] = "ep3";
    app.hashUrlMapEpisodes[3] = "ep4";
    app.hashUrlMapEpisodes[4] = "ep5";
    app.hashUrlMapEpisodes[5] = "ep6";
    app.hashUrlMapEpisodesInteractive[0] = "ep1-interactive";
    app.hashUrlMapEpisodesInteractive[1] = "ep2-interactive";
    app.hashUrlMapEpisodesInteractive[2] = "ep3-interactive";
    app.hashUrlMapEpisodesInteractive[3] = "ep4-interactive";
    app.hashUrlMapEpisodesInteractive[4] = "ep5-interactive";
    app.hashUrlMapEpisodesInteractive[5] = "ep6-interactive";

    if (window.location.hash) {
      // If a hash is present - show the specific episode or interactive part
      app.hash = window.location.hash.substring(1); //Puts hash in variable, and removes the # character
      app.navigation.hashNavigation(app.hash);

      if (window.matchMedia('screen and (max-width: 576px)').matches) {
        app.hidePrevious(); // Only do this if screen size is below xxx pixels
      }
    } else {
      app.helpers.updateContent(0);
    }
    //app.helpers.preload(); // Doesn't work
  },
  attachObservers: function() {
    // Navigation
    $(".arrow_left").on("click", app.toPrevious);
    $("#hover-navigation .arrow_show_hide").on("click", app.navigation.toggle);
    $(".arrow_right").on("click", app.toNext);

    $(".nav_mobile_left").on("click", app.showPrevious);
    $(".nav_mobile_right").on("click", app.showNext);

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

    $(window).on('resize', function(){
      if (window.matchMedia('screen and (max-width: 576px)').matches) {
        app.hidePrevious(); // Only do this if screen size is below xxx pixels
      } else if (window.matchMedia('screen and (min-width: 577px)').matches) {
        app.showAll();
      }
    });
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
  //TODO: Find out how we can update the menu on page load, if the hash i larger than episode 1
  showPrevious: function() {
    if (app.currEpisode >= 0) {
      $("#episodeSelection").find(".episode").eq(app.currEpisode).show();
    }
  },
  showNext: function() {
    if (app.currEpisode <= nav.episodes.length - 1) {
      $("#episodeSelection").find(".episode").eq(app.currEpisode-1).hide();
    }
  },
  hidePrevious: function() {
    for(var i = 0; i < app.hash.slice(-1)-1; i++) {
      $("#episodeSelection").find(".episode").eq(i).hide();
    }
  },
  showAll: function() {
    $("#episodeSelection").find(".episode").show();
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
    // Hide the video
    // Overlay sharing possibility

    //app.helpers.loadTextPage(4);
    console.log(app.currEpisode);
    //setTimeout(app.helpers.loadInteractiveContent(nav.episodes[app.currEpisode].id), 5000);
    app.helpers.loadInteractiveContent(nav.episodes[app.currEpisode].id);
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

    loadInteractiveContent: function(id) {
      app.interactiveState = true;
      app.textPageState = false;
      // Remove anything related to the video player
      // Concider removing the whole player layer?
      // app.navigation.hide();

      app.helpers.setHashUrl(1, id - 1);

      $("#video video").attr({
        "src": ""
      });
      $(".timeRemaining").text("");
      $(".avancee").css({
        width: "0%"
      });
      $('.play_pause_button').removeClass('pause').addClass('play');

      //$(".nav-holder *").fadeOut(1000);
      //$('#episodeProgress *').hide();
      $('.play_pause_button').hide();

      $("#content #video, #titles").hide();
      $("#content #interactive").empty();

      // Fetch the external resources. Maybe use the whole ajax method to be able to do a loading bar before the map is finished.
      $("#content #interactive").empty().load(nav.interactive[id - 1].html, function(response, status, xhr) {
        if (status == "error") {
          //Something went wrong, have your error fallback code here
        }
      });

      if (app.navigation.state == app.navigation.visible) {
        app.navigation.state = app.navigation.hidden;
        app.navigation.hide();
      }
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
