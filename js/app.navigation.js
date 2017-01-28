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
        if (! app.navigation.element.hasClass('show'))
            app.navigation.element.addClass('show');

        app.navigation.call('postShow');
    },
    hide: function() {
        app.navigation.call('preHide');

        // Hide
        if (app.navigation.element.hasClass('show'))
            app.navigation.element.removeClass('show');

        app.navigation.call('postHide');
    }
};
$(app.navigation.init);
