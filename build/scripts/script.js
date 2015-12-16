var pomodoro={initMin:1,min:1,sec:0,timerInterval:"",breakLength:5,sessions:3,init:function(){this.cacheDom(),this.bindEvents(),this.render(this.min,this.sec),this.checkStates()},cacheDom:function(){this.$el=$("#pomodoro"),this.$timer=this.$el.children("p"),this.$start=$("#start"),this.$pause=$("#pause"),this.$subtract=$("#subtract"),this.$add=$("#add"),this.$reset=$("#reset")},bindEvents:function(){this.$start.on("click",this.startTimer.bind(this)).on("click",this.checkSettings.bind(this)),this.$pause.on("click",this.pauseTimer.bind(this)),this.$subtract.on("click",this.subtractTime.bind(this)),this.$add.on("click",this.addTime.bind(this)),this.$reset.on("click",this.resetTimer.bind(this))},render:function(t,s){this.$timer.text(this.pad(t,2)+":"+this.pad(s,2))},checkStates:function(){("work"===this.$timer.prop("state")||"paused"===this.$timer.prop("state"))&&(this.$pause.prop("disabled",!1),this.$el.find("button").not(this.$pause).not(this.$reset).prop("disabled",!0)),"stopped"===this.$timer.prop("state")&&(this.$el.find("button").prop("disabled",!1),this.$pause.prop("disabled",!0))},pad:function(t,s){return t=t.toString(),t.length<s?this.pad("0"+t,s):t},startTimer:function(){this.$timer.prop("state","work"),this.checkStates(),this.countDown(),this.timerInterval=setInterval(this.countDown.bind(this),1e3)},checkSettings:function(){this.breakLength=settings.breakLength,this.sessions=settings.sessions},pauseTimer:function(){"paused"!==this.$timer.prop("state")?(this.$timer.prop("state","paused"),this.$pause.find("i").removeClass("fa-pause").addClass("fa-play"),clearInterval(this.timerInterval)):(this.$timer.prop("state","work"),this.$pause.find("i").removeClass("fa-play").addClass("fa-pause"),this.countDown(),this.timerInterval=setInterval(this.countDown.bind(this),1e3))},subtractTime:function(){this.min--,this.initMin--,this.min<1&&(this.min=1),this.render(this.min,this.sec)},addTime:function(){this.min++,this.initMin++,this.render(this.min,this.sec)},resetTimer:function(){this.$timer.prop("state","stopped"),this.checkStates(),clearInterval(this.timerInterval),this.min=25,this.sec=0,this.render(this.min,this.sec)},countDown:function(){0===this.min&&0===this.sec&&this.counterZero(),0===this.sec&&(this.sec=59,this.min--),this.render(this.min,this.sec),this.sec--},counterZero:function(){clearInterval(this.timerInterval),this.sessions>1?(this.sessions--,this.min=this.initMin,this.startTimer()):alert("all done!")}},settings={breakLength:5,sessions:3,init:function(){this.cacheDom(),this.bindEvents(),this.render()},cacheDom:function(){this.$el=$("#settings"),this.$toggleButton=this.$el.children("span"),this.$breakContainter=this.$el.find("span:eq(0)"),this.$sessionContainer=this.$el.find("span:eq(1)"),this.$minus=this.$el.find(".fa-minus"),this.$plus=this.$el.find(".fa-plus")},bindEvents:function(){this.$toggleButton.on("click",this.toggle.bind(this)),this.$minus.on("click",this.subtract.bind(this)),this.$plus.on("click",this.add.bind(this))},render:function(){0===this.breakLength&&(this.breakLength=1),0===this.sessions&&(this.sessions=1),this.$breakContainter.text(this.breakLength),this.$sessionContainer.text(this.sessions)},toggle:function(){this.$el.toggleClass("open")},subtract:function(t){var s=$(t.target).closest("div");s.hasClass("break-duration")?this.breakLength--:this.sessions--,this.render()},add:function(t){var s=$(t.target).closest("div");s.hasClass("break-duration")?this.breakLength++:this.sessions++,this.render()}};settings.init(),pomodoro.init();