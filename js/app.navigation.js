"use strict";

// Make sure the app variable exist. It should exist, from app.framework6.js
var app = app || {};

app.navigation = {
    // Possible states of the navigation bar, either visible of hidden
    hidden:  0,
    visible: 1,
    // Current state
    state:   null,
    // Navigation element
    element: null,

    callbacks: {
        'preShow':  [],
        'postShow': [],
        'preHide': [],
        'postHide': [],
    },

    init: function() {
        app.navigation.state   = app.navigation.visible;
        app.navigation.element = $('#navigation');

        app.navigation.createNavigationElements();
    },
    call: function(eventType) {
        if (! $.inArray(eventType, app.navigation.callbacks))
        throw new Error('Unknown event type "' + eventType + '"');

        app.navigation.callbacks[eventType].forEach(function(eventFunction) {
            eventFunction();
        });
    },

    show: function() {
        app.navigation.call('preShow');

        // Show navigation
        app.navigation.element.addClass('visible');

        app.navigation.state = app.navigation.visible;

        app.navigation.call('postShow');
    },
    hide: function() {
        app.navigation.call('preHide');

        // Hide
        app.navigation.element.removeClass('visible');

        app.navigation.state = app.navigation.hidden;

        app.navigation.call('postHide');
    },
    toggle: function() {
        if (app.navigation.state == app.navigation.visible) {
            app.navigation.hide();
        } else {
            app.navigation.show();
        }
    },

    createNavigationElements: function() {
        var interactiveSlots = nav.episodes.length;
        var episodesLength   = 0;
        var episodeWidth     = 80 / nav.episodes.length;
        var interactiveWidth = 20 / interactiveSlots;

        for(var i = 0; i < nav.episodes.length; i++) {
            episodesLength += parseFloat(nav.episodes[i].duration);

            var episode = $('<div></div>',{
                id: 'episode_' + (i+1),
                class: 'col-xs-12 col-sm-2 col-md-2 episode nospacing',
                // attr: {
                //     "data-id" : nav.episodes[i].id,
                //     "onClick" : "app.helpers.updateContent(" + i + ")"
                // },
                //html: "<div style='height:100%; float:left; margin-right:5px;'> \
                // html: "<div style='height:100%; float:left; margin-right:5px; width: 32px;'> \
                //         <img src='../resources/_Graphics/_GFX_001_Player-Controls/_ICN_Player_Play_Embed@2x.png' style='float:left; width:32px; height: auto;'> \
                //       </div> \
                //       <div style='float:left; height:100%; padding-top: 5px; width:50%;'><h1>EP" + nav.episodes[i].id + "<br /><span class='ep-title'>" + nav.episodes[i].title + "</span></h1></div> \
                //       <div id='interactive_" + (i+1)+ "' class='interactive' data-id='"+nav.episodes[i].id+"' style='height: 100%; width:20%;'><span></span></div> \
                //       "

                html: "<div class='row' style='height:100%; margin:0; padding:0;'>\
                  <div class='col-xs-2 visible-xs-block hidden-sm'><div class='arrow arrow_left nav_mobile_left'></div></div> \
                  <div class='hidden-xs hidden-sm visible-md-block col-md-2 visible-lg-block nospacing' style='padding: 10px 0 0 10px;' onClick='app.helpers.updateContent(" + i + ")'><img src='../resources/_Graphics/_GFX_001_Player-Controls/_ICN_Player_Play_Embed@2x.png' style='float:left; width:32px; height: auto;'></div>\
                  <div class='col-xs-5 col-sm-8 col-md-7 nospacing' style='padding:10px 0 0 10px;' onClick='app.helpers.updateContent(" + i + ")'><h1>EP" + nav.episodes[i].id + "<br /><span class='ep-title'>" + nav.episodes[i].title + "</span></h1></div>\
                  <div class='col-xs-3 col-sm-4 col-md-3 nospacing interactive' id='interactive_" + (i+1)+ "' data-id='"+nav.episodes[i].id+"' onClick='app.helpers.loadInteractiveContent(" + nav.episodes[i].id + ")'><span></span></div>\
                  <div class='col-xs-2 visible-xs-block hidden-sm'><div class='arrow arrow_right nav_mobile_right'></div></div> \
                </div>"

                //css: {'width': episodeWidth + "%"}
            }).appendTo("#episodeSelection");

            // var interactive = $('<div></div>',{
            //     id: 'interactive_' + (i+1),
            //     class: 'interactive',
            //     attr: {
            //         "data-id" : nav.episodes[i].id,
            //         "onClick" : "app.helpers.loadInteractiveContent(" + nav.episodes[i].id + ")"
            //     },
            //     html: "<span></span>",
            //     //css: {'width': interactiveWidth + "%"}
            // }).appendTo("#episodeSelection");

            // If the episode is marked as being live, add live classes. Otherwise, disable interactive part.
            if(i <= app.liveEpisodes) {
                $(episode).addClass("live");
                $(episode).find(".interactive").addClass("live");
            }
        }
        $("#episodeSelection").css("width" , "100%");
        $("#episodeScroll").css({"display" : "block", "padding-top" : "60px;"});
    },

    // Change what content we see, based on given hash
    hashNavigation: function(hash) {
      switch(hash) {
        case "ep1":
          // Navigate to the first episode
          app.helpers.updateContent(0);
          break;
        case "ep1-interactive":
          app.helpers.loadInteractiveContent(nav.episodes[0].id);
          break;
        case "ep2":
          app.helpers.updateContent(1);
          break;
        case "ep2-interactive":
          app.helpers.loadInteractiveContent(nav.episodes[1].id);
          break;
        case "ep3":
          app.helpers.updateContent(2);
          break;
        case "ep3-interactive":
          app.helpers.loadInteractiveContent(nav.episodes[2].id);
          break;
        case "ep4":
          app.helpers.updateContent("3");
          break;
        case "ep4-interactive":
          app.helpers.loadInteractiveContent(nav.episodes[3].id);
          break;
        case "ep5":
          app.helpers.updateContent(4);
          break;
        case "ep5-interactive":
          app.helpers.loadInteractiveContent(nav.episodes[4].id);
          break;
        case "ep6":
          app.helpers.updateContent(5);
          break;
        case "ep5-interactive":
          app.helpers.loadInteractiveContent(nav.episodes[5].id);
          break;
        default:
          //Epiosde 1:
          app.helpers.updateContent(0);
          break;
      }
    }
};
