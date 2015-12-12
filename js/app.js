$(document).ready(function() {

	function pad (str, max) {
		str = str.toString();
		return str.length < max ? pad("0" + str, max) : str;
	}

	var timer = $('.timer');

	// set initial timer to 25:00
	var initMin = 25;
	var initSec = 0;

	timer.text(pad(initMin,2) + ":" + pad(initSec,2));

	// click to add minutes
	$('#add').click(function() {
		initMin ++;
		timer.text(pad(initMin,2) + ":" + pad(initSec,2));
	});

	// click to subtract minutes, minimum of 0
	$('#subtract').click(function() {
		initMin --;
		if (initMin < 1) {
			initMin = 1;
		}
		timer.text(pad(initMin,2) + ":" + pad(initSec,2));
	})

	$('#start').click(function() {
		$('button').not("#pause").attr("disabled","true").addClass("gray");
		$('#pause').removeAttr("disabled").removeClass("gray");
		countDown(0,3);
	})

	$('#pause').click(function() {
		pause();
	});

	


	function countDown(minutes, seconds) {

		var timerDone = document.createElement('audio');
		timerDone.src = 'assets/rossini-la-gazza-ladra-cut.mp3';
		timerDone.load();
		var breakDone = document.createElement('audio');
		breakDone.src = 'assets/kitchen-timer.mp3';
		breakDone.load();
		var minutes = minutes; 
		if (seconds == undefined) {
			seconds = 0;
		} else {
		var seconds = seconds; 
		}


	    function update() {

	    	if (minutes == 0 && seconds == 0 && timer.attr("data-type") === "work") {
	    		clearInterval(timerInterval);
	    		timerDone.play()
	    		timer.attr("data-type","break");
	    		takeBreak(5);
	    	} else if (minutes == 0 && seconds == 0 && timer.attr("data-type") === "break") {
	    		clearInterval(timerInterval);
	    		breakDone.play();
	    		timer.attr("data-type","work").removeClass("gray");
				$(".break").css("visibility","hidden");
	    		countDown(initMin,initSec+1);
	    	}

	    	timer.text(pad(minutes,2) + ":" + pad(seconds,2));

	    	if (seconds == 0) {
	    		seconds = 59;
	    		minutes --;
	    		return
	    	} 
	    	seconds --;

	    	minRem = minutes;
	    	secRem = seconds;

	    }

	    update();
	    timerInterval = setInterval(update,1000);


	}

	function pause() {
		var pause = $('#pause');

		if (pause.data("paused") === false) {
			clearInterval(timerInterval);
			pause.data("paused", true);
			pause.addClass("paused");
		} else if (secRem == 0) {
			countDown(minRem,1);
			pause.data("paused", false);
			pause.removeClass("paused");
		} else {
			countDown(minRem,secRem);
			pause.data("paused", false);
			pause.removeClass("paused");
		}

	}

	function takeBreak(min,sec) {
		$('.break').css("visibility","visible");
		timer.addClass("gray");
		countDown(min,sec);
	}


})