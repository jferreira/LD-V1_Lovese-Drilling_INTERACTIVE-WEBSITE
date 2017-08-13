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
                class: 'episode',
                attr: {
                    "data-id" : nav.episodes[i].id,
                    "onClick" : "app.helpers.updateContent(" + i + ")"
                },
                html: "<div style='height:100%; float:left; margin-right:5px;'> \
                    <img src='../resources/_Graphics/_GFX_001_Player-Controls/_ICN_Player_Play_Embed@2x.png' style='float:left; width:32px; height: auto;'> \
                  </div> \
                  <div style='height:100%; padding-top: 5px;'><h1>EP" + nav.episodes[i].id + "<br /><span class='ep-title'>" + nav.episodes[i].title + "</span></h1></div>",
                css: {'width': episodeWidth + "%"}
            }).appendTo("#episodeSelection");

            var interactive = $('<div></div>',{
                id: 'interactive_' + (i+1),
                class: 'interactive',
                attr: {
                    "data-id" : nav.episodes[i].id,
                    "onClick" : "app.loadInteractiveContent(" + nav.episodes[i].id + ")"
                },
                html: "<span></span>",
                css: {'width': interactiveWidth + "%"}
            }).appendTo("#episodeSelection");

            // If the episode is marked as being live, add live classes. Otherwise, disable interactive part.
            if(i <= app.liveEpisodes) {
                $(episode).addClass("live");
                $(interactive).addClass("live");
            } else {
                interactive.attr("onClick",false);
            }
        }
        $("#episodeSelection").css("width" , "100%");
    },

    // Change what content we see, based on given hash
    hashNavigation: function(hash) {
      switch(hash) {
        case "ep1":
          // Navigate to the first episode
          app.helpers.updateContent(0);
          break;
        case "ep1-interactive":
          app.loadInteractiveContent(nav.episodes[0].id);
          break;
        case "ep2":
          app.helpers.updateContent(1);
          break;
        case "ep2-interactive":
          app.loadInteractiveContent(nav.episodes[1].id);
          break;
        case "ep3":
          app.helpers.updateContent(2);
          break;
        case "ep3-interactive":
          app.loadInteractiveContent(nav.episodes[2].id);
          break;
        case "ep4":
          app.helpers.updateContent("3");
          break;
        case "ep4-interactive":
          app.loadInteractiveContent(nav.episodes[3].id);
          break;
        case "ep5":
          app.helpers.updateContent(4);
          break;
        case "ep5-interactive":
          app.loadInteractiveContent(nav.episodes[4].id);
          break;
        case "ep6":
          app.helpers.updateContent(5);
          break;
        case "ep5-interactive":
          app.loadInteractiveContent(nav.episodes[5].id);
          break;
        default:
          //Epiosde 1:
          app.helpers.updateContent(0);
          break;
      }
    }
};
