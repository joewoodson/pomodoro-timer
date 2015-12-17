var pomodoro = {

    kitchenTimer: document.createElement('audio'),
    breakSound: document.createElement('audio'),
	initMin: 1,
	min: 1,
	sec: 0,
	timerInterval: '',
	breakLength: 5,
	sessions: 3,
	state: 'stopped',
	i: 1,
	init: function() {
		this.cacheDom();
		this.loadSounds();
		this.bindEvents();
		this.render(this.min,this.sec);
		this.checkMode();
	},
	cacheDom: function() {
		this.$el = $('#pomodoro');
		this.$timer = this.$el.children('p:eq(1)');
		this.$breakText = this.$el.children('p:eq(0)');
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
	loadSounds: function () {
		this.kitchenTimer.src = 'assets/sounds/kitchen-timer.mp3';
	    this.kitchenTimer.load();

	    this.breakSound.src = 'assets/sounds/rossini-la-gazza-ladra-cut.mp3';
	    this.breakSound.load();

	},
	checkMode: function () {
		if (this.$el.prop('mode') === 'work' || this.$el.prop('mode') === 'paused') {
			this.$pause.prop('disabled', false);
			this.$el.find('button').not(this.$pause).not(this.$reset).prop('disabled', true);
		}

		if (this.$el.prop('mode') === 'stopped') {
			this.$el.find('button').prop('disabled', false);
			this.$pause.prop('disabled', true);
		}

	},
	pad: function(str, max) {
		str = str.toString();
		return str.length < max ? this.pad("0" + str, max) : str;
	},
	startTimer: function () {
		this.state = 'running';
		this.$el.prop('mode', 'work');
		this.checkMode();
		this.countDown();
		this.timerInterval = setInterval(this.countDown.bind(this),10);
	},
	checkSettings: function () {
		this.breakLength = settings.breakLength;
		this.sessions = settings.sessions;
	},
	pauseTimer: function () {
		if (this.$el.prop('mode') !== 'paused') {
			this.$el.prop('mode', 'paused');
			this.$pause.find('i').removeClass('fa-pause').addClass('fa-play');
			clearInterval(this.timerInterval);
		} else {
			
			if (this.i % 2 !== 0) {
				this.$el.prop('mode', 'work');	
			} else if (this.i % 2 === 0) {
				this.$el.prop('mode', 'break');
			}

			this.$pause.find('i').removeClass('fa-play').addClass('fa-pause');			
			this.timerInterval = setInterval(this.countDown.bind(this),100);
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
		this.state = 'stopped';
		this.$el.prop('mode', 'stopped');
		this.checkMode();
		this.$pause.find('i').removeClass('fa-play').addClass('fa-pause');	
		this.$breakText.css('visibility','hidden');
		this.$timer.removeClass('gray');		
		clearInterval(this.timerInterval);
		this.min = this.initMin;
		// this.breakLength = settings.breakLength;
		// this.sessions = settings.sessions;
		this.sec = 0;
		this.render(this.min, this.sec);
	},
	countDown: function () {

		if (this.min === 0 && this.sec === 0) {
			this.i ++;
			this.counterZero();
		}

		if (this.sec === -1) {
			this.sec = 59;
			this.min --;
		}

		this.render(this.min, this.sec);

		this.sec--; 


	},
	counterZero: function () {
		clearInterval(this.timerInterval);

		if (this.sessions >= 0 && this.$el.prop('mode') === 'work') {
			this.breakSound.play();
			this.$breakText.css('visibility','initial');
			this.$timer.addClass('gray');
			this.sessions --;
			this.$el.prop('mode', 'break');
			this.min = this.breakLength;
			this.timerInterval = setInterval(this.countDown.bind(this),100);
		} else if (this.sessions > 0 && this.$el.prop('mode') === 'break') {
			this.kitchenTimer.play();
			this.$breakText.css('visibility','hidden');
			this.$timer.removeClass('gray');
			this.$el.prop('mode', 'work');
			this.min = this.initMin;
			this.timerInterval = setInterval(this.countDown.bind(this),100);
		} else {
			this.breakSound.play();
			this.$breakText.css('visibility','hidden');
			this.$timer.removeClass('gray');
			return;
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

		//click main div to close settings panel
		$('#pomodoro').on('click', function() {
			settings.$el.removeClass('open'); 				
		});
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
		if (pomodoro.state === 'stopped') {
			this.$el.toggleClass('open');
		}
		
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

