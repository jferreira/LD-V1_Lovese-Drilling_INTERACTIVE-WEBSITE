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
    }
};
$(app.navigation.init);
