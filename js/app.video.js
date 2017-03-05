"use strict";

// Make sure the app variable exist. It should exist, from app.framework6.js
var app = app || {};

app.video = {
    // Possible states of the video, either playing or stopped
    stopped: 0,
    playing: 1,
    // Current state of the video.
    state: null,
    // Video element
    element: null,

    // Function which are called in certain events, like starting / pauzing video
    // Add new callback with:
    // app.video.callbacks.preStart.push(function...);
    callbacks: {
        'preStart':  [],
        'postStart': [],
        'prePause':  [],
        'postPause': []
    },

    init: function() {
        app.video.state   = app.video.stopped;
        app.video.element = $("video")[0];

        app.video.element.load();
    },
    call: function(eventType) {
        if (! $.inArray(eventType, app.video.callbacks))
            throw new Error('Unknown event type "' + eventType + '"');

        app.video.callbacks[eventType].forEach(function(eventFunction) {
            eventFunction();
        });
    },

    start: function() {
        app.video.call('preStart');

        // Start video
        app.video.element.play();

        app.video.state = app.video.playing;

        app.video.call('postStart');
    },
    pause: function() {
        app.video.call('prePause');

        // Pause video
        app.video.element.pause();

        app.video.state = app.video.stopped;

        app.video.call('postPause');
    },
    toggle: function() {
        if (app.video.state == app.video.playing) {
          app.video.pause();
        } else {
          app.video.start();
        }
    },

    setTo: function(percentage) {
        app.video.element.currentTime = percentage * app.video.element.duration;
    }
};
