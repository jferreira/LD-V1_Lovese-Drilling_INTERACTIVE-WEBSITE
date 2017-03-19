"use strict";

// Make sure the app variable exist. It should exist, from app.framework6.js
var app = app || {};

app.layover = {
    // Possible states of the layover screen, either visible of hidden
    hidden:  0,
    visible: 1,
    // Current state
    state:   null,
    // Navigation element
    element: null,

    callbacks: {
        'preShow':  [],
        'postShow': [],
        'preCycle':  [],
        'postCycle': [],
        'preContent': [],
        'postContent': [],
        'preHide': [],
        'postHide': [],
    },

    init: function() {
        app.layover.state   = app.layover.visible;
        app.layover.element = $('#intro');
    },
    call: function(eventType) {
        if (! $.inArray(eventType, app.layover.callbacks))
            throw new Error('Unknown event type "' + eventType + '"');

        app.layover.callbacks[eventType].forEach(function(eventFunction) {
            eventFunction();
        });
    },
    cycleIntroContent: function(totalTime) {
      app.layover.call('preCycle');
      var sectionTime = (totalTime * 1000) / $(app.layover.element).children().length;

      var mapF = $(app.layover.element).children();
      var $active = mapF.eq(0);

      var $next = $active.next();
      var timer = setInterval(function() {
        $next.addClass("active");
        $active.removeClass("active");
        $active = $next;

        // Do map operations
        $next = (mapF.last().index() == mapF.index($active)) ? $next = mapF.eq(0): $active.next();

        if(mapF.last().index() == mapF.index($active)) {
          console.log("finished");
          clearInterval(timer);
          timer = null;
        }
      }, sectionTime);

      app.layover.call('postCycle');
    },
    updateContent: function(content) {
        app.layover.call('preContent');

        app.layover.element.find('.content').html(content);

        app.layover.call('postContent');
    },
    setClass: function(className) {
        app.layover.element.attr('class', className);
    },
    showSpecificScreen: function(screenIndex) {
      var index = $(app.layover.element).children();
      var $active = index.eq(screenIndex);
      $active.addClass("active").siblings("").removeClass("active");
      app.layover.show();
    },
    show: function() {
        app.layover.call('preShow');

        // Show layover
        app.layover.element.addClass('visible');

        app.layover.state = app.layover.visible;

        app.layover.call('postShow');
    },
    hide: function() {
        app.layover.call('preHide');

        // Hide
        app.layover.element.removeClass('visible');

        app.layover.state = app.layover.hidden;

        app.layover.call('postHide');
    },
    toggle: function() {
        if (app.layover.state == app.layover.visible) {
          app.layover.hide();
        } else {
          app.layover.show();
        }
    }
};
