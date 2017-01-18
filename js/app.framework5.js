/* Bugs:
- When a video is finished, clicking it will start to play it again, but also make it seem like we're pausing it
*/

/* Bugs Fixed:
- Video stops counting down when 27 seconds is left.
- Wrong logic in pause/play based on video clicked, or video play icons clicked
*/

/* To implement:
- Add scaled PNG + holding videos (without tiles)
- Splash page
- Add screen dumps of each video to the masthead background image

- Add video controls to be able to jump within the film
- Add a layer of confirmation when the user moves to another episode, while video playing? "Do you really want to stop watching"
- Add share functionality
	1) When pausing the player
	2) Fade in/out on mouse movement?
	3) Always be present somewhere?
- Add timer (count-down) for the interactive elements, move on to next episode when finished
- Pause/play functionality for the interactive countdown
- Styling the player UI. Add icons, instead of buttons.
- Move the position of the count down timer, make it more visible.
- CSS: break the video title in the nav episode div (responsive text)
- CSS: Responsive break points for the whole site. Scale the video to browser size.
*/

/* Implemented
- Hover to get the playback controllers
- Call to action after video is finished
- Function to remove (or pause) video, and show interactive content in same place
- Video timebar/scroller
- Indicate where the video playing is in the episode slot?
- Drag and drop episode selection
- Scale the video correctly
- Main navigation (top horizontal menu)
- Well designed pop up content for issue/history/action + about
*/

function updateContent(episode) {
	interactiveState = false;
	var episodeId;

	if(episode === undefined || episode === null) {
		episodeId = currNav;
	} else {
		episodeId = episode;
		currNav = episodeId;
	}
	$(".nav-holder *").fadeIn(500);

	// Remove interactive content if it's present
	if($("#content #interactive *").is(":visible")) {
		$("#content #interactive").empty();
		//$("#content #interactive").load("resources/interactive/empty.html");
	}
	if($('#episodeProgress *').is(":hidden")) $('#episodeProgress *').show();

	$("#video").css({
		"background": 'url("'+nav.episodes[currNav].poster+'") no-repeat',
		"background-size": 'cover'
	});

	$("#video video").attr({
		"src": nav.episodes[episodeId].video
		//"poster": nav.episodes[episodeId].poster
		//"preload": "auto"
		//"autoplay": "autoplay"
	});
	$("#titles h1").text(nav.episodes[episodeId].title);
	$("#titles span.subtitle").text(nav.episodes[episodeId].subtitle);
	$("#titles span.description").text(nav.episodes[episodeId].description);
	$("#content *, #titles *").fadeIn(1000);
	$(".timeRemaining").text("0:00");
	$('#btn-play-pause').removeClass('pause').addClass('play');
	$(".avancee").css({width:"0%"});
}

function loadInteractiveContent(id) {
	interactiveState = true;
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
	$("#content #interactive").load(nav.interactive[id-1].html);
	// Function to stop a video if its playing?
}

function twoDigits( n ) {
	return (n <= 9 ? "0" + n : n);
}

function checkVideo() {
	if (video.paused == true) {
		video.play();
		$("#video").css({"background-image":"none", "background-color": "#000"});
	} else {
		video.pause();
		$(".nav-holder *").fadeIn(1000);
	}
	if($("#titles *").is(":visible")) {
		$("#titles *").fadeOut(1000);
		$(".nav-holder *").fadeOut(1000);
	}
}

$(document).ready( function() {
	currNav = 0;
	video = $("video")[0];
	interactiveState = false;
	var interactiveSlots = nav.episodes.length;
	var episodesLength = 0;
	var newSize = 0;
	for(var i = 0; i < nav.episodes.length; i++) {
		//var episodeWidth = 90 / nav.episodes.length;
		//var interactiveWidth = 30 / interactiveSlots;
		var episodeWidth = 350;
		var interactiveWidth = 100;
		newSize = newSize + episodeWidth + interactiveWidth;

		//var episodeWidth = 1500;
		//var interactiveWidth = 150;
		episodesLength += parseFloat(nav.episodes[i].duration);

		var episode = $('<div></div>',{
		   id: 'episode_' + i,
		   class: 'episode',
		   attr: {
			   "data-id" : nav.episodes[i].id,
			   "onClick" : "updateContent("+i+")"
		   },
		   html: "<h1>EP"+nav.episodes[i].id+"</h1><h3>" + nav.episodes[i].title + "</h3>",
		   css: {
			   'width': episodeWidth + "px"
		   }
		}).appendTo("#episodeSelection");

		var interactive = $('<div></div>',{
		   id: 'interactive_' + i,
		   class: 'interactive',
		   attr: {
			   "data-id" : nav.episodes[i].id,
			   "onClick" : "loadInteractiveContent("+nav.episodes[i].id+")"
		   },
		   html: "<p></p>",
		   css: {
			   'width': interactiveWidth + "px"
		   }
		}).appendTo("#episodeSelection");
	}
	$("#episodeSelection").css("width",newSize);
	//console.log(episodesLength.toFixed(2));

	/*
	*	VIDEO EVENTS
	*/

	$("video").on("timeupdate", function(){
		if(this.readyState > 0) {
			var value = (100 / this.duration) * this.currentTime;

			var minutes = parseInt((this.duration - this.currentTime) / 60, 10);
			var seconds = (this.duration - this.currentTime) % 60;

			seconds = Math.ceil(seconds);
			$(".timeRemaining").text(minutes + ":" + twoDigits(seconds));

			var d = 100 * this.currentTime / this.duration;
			$(".avancee").css({width:d+"%"});
		}
	});

	/* When a video ends */
	video.onended = function(e) {
		//$('[data-remodal-id=contribute]').remodal().open();
    };

	$("#contribute").on("click", function() {
		console.log("modal click");
		$('[data-remodal-id=contribute]').remodal().open();
		//inst.open();
    });

    $("#play").on("click", function() {
		checkVideo();
		$('#btn-play-pause').removeClass('play').addClass('pause');
		$('#navigation').toggleClass('show');
		if($("#play").is(":hidden")) {
			$("#play").fadeIn(1000);
			$('#btn-play-pause').toggleClass('play');
			$('#btn-play-pause').toggleClass('pause');
		}

    });

    $("video").on("click", function() {
		if (video.paused == false) {
			$(".nav-holder *").fadeIn(1000);
			$('#btn-play-pause').removeClass('play').addClass('pause');
			$('#navigation').toggleClass('show');
			if($("#play").is(":hidden")) {
				$("#play").fadeIn(1000);
				$('#btn-play-pause').toggleClass('play');
				$('#btn-play-pause').toggleClass('pause');
			}
			video.pause();
		}
    });

	$('#btn-play-pause').click(function(e) {
		e.preventDefault();
		$('#navigation').toggleClass('show');
		$(this).toggleClass('play');
		$(this).toggleClass('pause');
		checkVideo();

		if($("#play").is(":hidden")) {
			$("#play").fadeIn(1000);
		}

	});

    $("#navPrev").on("click", function() {
		if(currNav > 0) {
			currNav--;
			updateContent();
		}
    });

    $("#navNext").on("click", function() {
		if(currNav <= nav.episodes.length-2) {
			currNav++;
			updateContent();
		}
    });

	$("#mute-video").click( function (){
		if( $("video").prop('muted') ) {
			$("video").prop('muted', false);
		} else {
			$("video").prop('muted', true);
		}
	});

	// Run on page load
	updateContent();

	/* Function for drag and span*/
	var x,y,top,left,down;

	$("#navigation").mousedown(function(e){
		e.preventDefault();
		down=true;
		x=e.pageX;
		y=e.pageY;
		top=$(this).scrollTop();
		left=$(this).scrollLeft();
	});

	$("#navigation").mousemove(function(e){
		if(down){
			//$(this).css('cursor', 'move');
			var newX=e.pageX;
			var newY=e.pageY;

			//console.log(y+", "+newY+", "+top+", "+(top+(newY-y)));

			//$("#navigation").scrollTop(top-newY+y);
			$("#navigation").scrollLeft(left-newX+x);
		}
	});

	$("#navigation").mouseup(function(e){
		e.preventDefault();
		down=false;
	});

	/* Show navigation if the video is currently playing */
	/*
	$("#navigation").hover(function(){
		console.log(interactiveState);
		if (!video.paused) {
			$('#navigation').toggleClass('show');
		}
	});
	*/

	/* Show navigation if the video is currently playing. Includes video + interactive elements */
	$("#navigation").on("mouseenter", function() {
		if (!video.paused || interactiveState) {
			if($('#navigation').hasClass('show')) {
				console.log("has show class");
				$('#navigation').removeClass('show');
			}
		}
	}).on("mouseleave", function() {
		if (!video.paused || interactiveState) {
			if(!$('#navigation').hasClass('show')) {
				$('#navigation').addClass('show');
			}
		}
	});

	/* http://jsfiddle.net/andrewwhitaker/s5mgX/ */
	/*
	var step = 25;
	var scrolling = false;

	// Wire up events for the 'scrollUp' link:
	$("#scrollUp").bind("click", function(event) {
		event.preventDefault();
		// Animates the scrollTop property by the specified
		// step.
		$("#content").animate({
			scrollTop: "-=" + step + "px"
		});
	}).bind("mouseover", function(event) {
		scrolling = true;
		scrollContent("up");
	}).bind("mouseout", function(event) {
		scrolling = false;
	});


	$("#scrollDown").bind("click", function(event) {
		event.preventDefault();
		$("#content").animate({
			scrollTop: "+=" + step + "px"
		});
	}).bind("mouseover", function(event) {
		scrolling = true;
		scrollContent("down");
	}).bind("mouseout", function(event) {
		scrolling = false;
	});

	function scrollContent(direction) {
		var amount = (direction === "up" ? "-=1px" : "+=1px");
		$("#content").animate({
			scrollTop: amount
		}, 1, function() {
			if (scrolling) {
				scrollContent(direction);
			}
		});
	}
*/


    var count  = 40;
    var interval;

    $("#episodeScrollRight, #episodeScrollLeft").on('mouseover', function(e) {

		/*
		var parentOffset = $(this).parent().offset();
		var relX = e.pageX - parentOffset.left;
		var relY = e.pageY - parentOffset.top;

		console.log(e.pageX,parentOffset.left);
		*/

        var div = $('#navigation');
		var direction;
		if($(this).hasClass("scrollLeft")) {
			direction = true;
		} else {
			direction = false;
		}
		console.log(div.scrollLeft(), div.width());
		if(div.scrollLeft() < 20) {
			$('#episodeScrollLeft').hide();
		} else {
			$('#episodeScrollLeft').show()
		}

		if(div.scrollLeft() > div.width()) {
			$('#episodeScrollRight').hide();
		} else {
			$('#episodeScrollRight').show()
		}


        interval = setInterval(function(){
            var pos = div.scrollLeft();
			if(direction) {
				div.scrollLeft(pos - count);
			} else {
				div.scrollLeft(pos + count);
			}

        }, 100);
    }).on('mouseout', function() {
        // Uncomment this line if you want to reset the speed on out
        //count = 0;
        clearInterval(interval);
    });

});
