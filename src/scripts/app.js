var pomodoro = {
	initMin: 1,
	min: 1,
	sec: 0,
	timerInterval: '',
	breakLength: 5,
	sessions: 3,
	init: function() {
		this.cacheDom();
		this.bindEvents();
		this.render(this.min,this.sec);
		this.checkStates();
	},
	cacheDom: function() {
		this.$el = $('#pomodoro');
		this.$timer = this.$el.children('p');
		this.$start = $('#start');
		this.$pause = $('#pause');
		this.$subtract = $('#subtract');
		this.$add = $('#add');
		this.$reset = $('#reset');
	},
	bindEvents: function() {
		this.$start.on('click', this.startTimer.bind(this))
			.on('click', this.checkSettings.bind(this));
		this.$pause.on('click', this.pauseTimer.bind(this));
		this.$subtract.on('click', this.subtractTime.bind(this));
		this.$add.on('click', this.addTime.bind(this));
		this.$reset.on('click', this.resetTimer.bind(this));
	},
	render: function(minutes, seconds) {
		this.$timer.text(this.pad(minutes,2) + ':' + this.pad(seconds,2));
	},
	checkStates: function () {
		if (this.$timer.prop('state') === 'work' || this.$timer.prop('state') === 'paused') {
			this.$pause.prop('disabled', false);
			this.$el.find('button').not(this.$pause).not(this.$reset).prop('disabled', true);
		}

		if (this.$timer.prop('state') === 'stopped') {
			this.$el.find('button').prop('disabled', false);
			this.$pause.prop('disabled', true);
		}

	},
	pad: function(str, max) {
		str = str.toString();
		return str.length < max ? this.pad("0" + str, max) : str;
	},
	startTimer: function () {
		this.$timer.prop('state', 'work');
		this.checkStates();
		this.countDown();
		this.timerInterval = setInterval(this.countDown.bind(this),1000);
	},
	checkSettings: function () {
		this.breakLength = settings.breakLength;
		this.sessions = settings.sessions;
	},
	pauseTimer: function () {
		if (this.$timer.prop('state') !== 'paused') {
			this.$timer.prop('state', 'paused');
			this.$pause.find('i').removeClass('fa-pause').addClass('fa-play');
			clearInterval(this.timerInterval);
		} else {
			this.$timer.prop('state', 'work');		
			this.$pause.find('i').removeClass('fa-play').addClass('fa-pause');			
			this.countDown();	
			this.timerInterval = setInterval(this.countDown.bind(this),1000);
		}
	},
	subtractTime: function () {
		this.min --;
		this.initMin --;
		// not allowed below 0
		if (this.min < 1) {
			this.min = 1;
		}

		this.render(this.min,this.sec);
		
	},
	addTime: function () {
		this.min ++;
		this.initMin ++;
		this.render(this.min,this.sec);
	},
	resetTimer: function () {
		this.$timer.prop('state', 'stopped');
		this.checkStates();
		clearInterval(this.timerInterval);
		this.min = 25;
		this.sec = 0;
		this.render(this.min, this.sec);
	},
	countDown: function () {

		if (this.min === 0 && this.sec === 0) {
			this.counterZero();
		}

		if (this.sec === 0) {
			this.sec = 59;
			this.min --;
		}

		this.render(this.min, this.sec);

		this.sec--; 


	},
	counterZero: function () {
		clearInterval(this.timerInterval);

		if (this.sessions > 1) {
			this.sessions --;
			this.min = this.initMin;
			this.startTimer();
		} else {
			alert('all done!');
		}

	}

};

var settings = {
	breakLength: 5,
	sessions: 3,
	init: function() {
		this.cacheDom();
		this.bindEvents();
		this.render();
	},
	cacheDom: function() {
		this.$el = $('#settings');
		this.$toggleButton = this.$el.children('span');

		this.$breakContainter = this.$el.find('span:eq(0)');
		this.$sessionContainer = this.$el.find('span:eq(1)');

		this.$minus = this.$el.find('.fa-minus');
		this.$plus = this.$el.find('.fa-plus');
	},
	bindEvents: function() {
		this.$toggleButton.on('click', this.toggle.bind(this));
		this.$minus.on('click', this.subtract.bind(this));
		this.$plus.on('click', this.add.bind(this));
	},
	render: function () {
		if (this.breakLength === 0) {
			this.breakLength = 1;
		}
		if (this.sessions === 0) {
			this.sessions = 1;
		}

		this.$breakContainter.text(this.breakLength);
		this.$sessionContainer.text(this.sessions);
	},
	toggle: function () {
		this.$el.toggleClass('open');
	},
	subtract: function (e) {
		var counter = $(e.target).closest('div');

		if (counter.hasClass('break-duration')) {
			this.breakLength --;
		} else {
			this.sessions --;
		}

		this.render();
	},
	add: function (e) {
		var counter = $(e.target).closest('div');

		if (counter.hasClass('break-duration')) {
			this.breakLength ++;
		} else {
			this.sessions ++;
		}

		this.render();
	}

};



settings.init();
pomodoro.init();




// $(document).ready(function() {

// 	function pad (str, max) {
// 		str = str.toString();
// 		return str.length < max ? pad("0" + str, max) : str;
// 	}

// 	var timer = $('.timer');

// 	// set initial timer to 25:00
// 	var initMin = 25;
// 	var initSec = 0;

// 	timer.text(pad(initMin,2) + ":" + pad(initSec,2));

// 	// click to add minutes
// 	$('#add').click(function() {
// 		initMin ++;
// 		timer.text(pad(initMin,2) + ":" + pad(initSec,2));
// 	});

// 	// click to subtract minutes, minimum of 0
// 	$('#subtract').click(function() {
// 		initMin --;
// 		if (initMin < 1) {
// 			initMin = 1;
// 		}
// 		timer.text(pad(initMin,2) + ":" + pad(initSec,2));
// 	});

// 	$('#start').click(function() {
// 		$('button').not("#pause").attr("disabled","true").addClass("gray");
// 		$('#pause').removeAttr("disabled").removeClass("gray");
// 		countDown(0,3);
// 	});

// 	$('#pause').click(function() {
// 		pause();
// 	});

	


// 	function countDown(minutes, seconds) {

// 		var timerDone = document.createElement('audio');
// 		timerDone.src = 'assets/sounds/rossini-la-gazza-ladra-cut.mp3';
// 		timerDone.load();
// 		var breakDone = document.createElement('audio');
// 		breakDone.src = 'assets/sounds/kitchen-timer.mp3';
// 		breakDone.load();
// 		var minutes = minutes; 
// 		if (seconds == undefined) {
// 			seconds = 0;
// 		} else {
// 		var seconds = seconds; 
// 		}


// 	    function update() {

// 	    	if (minutes == 0 && seconds == 0 && timer.attr("data-type") === "work") {
// 	    		clearInterval(timerInterval);
// 	    		timerDone.play()
// 	    		timer.attr("data-type","break");
// 	    		takeBreak(5);
// 	    	} else if (minutes == 0 && seconds == 0 && timer.attr("data-type") === "break") {
// 	    		clearInterval(timerInterval);
// 	    		breakDone.play();
// 	    		timer.attr("data-type","work").removeClass("gray");
// 				$(".break").css("visibility","hidden");
// 	    		countDown(initMin,initSec+1);
// 	    	}

// 	    	timer.text(pad(minutes,2) + ":" + pad(seconds,2));

// 	    	if (seconds == 0) {
// 	    		seconds = 59;
// 	    		minutes --;
// 	    		return
// 	    	} 
// 	    	seconds --;

// 	    	minRem = minutes;
// 	    	secRem = seconds;

// 	    }

// 	    update();
// 	    timerInterval = setInterval(update,1000);


// 	}

// 	function pause() {
// 		var pause = $('#pause');

// 		if (pause.data("paused") === false) {
// 			clearInterval(timerInterval);
// 			pause.data("paused", true);
// 			pause.addClass("paused");
// 		} else if (secRem == 0) {
// 			countDown(minRem,1);
// 			pause.data("paused", false);
// 			pause.removeClass("paused");
// 		} else {
// 			countDown(minRem,secRem);
// 			pause.data("paused", false);
// 			pause.removeClass("paused");
// 		}

// 	}

// 	function takeBreak(min,sec) {
// 		$('.break').css("visibility","visible");
// 		timer.addClass("gray");
// 		countDown(min,sec);
// 	}


// })