$(document).ready(function(){function a(e,t){return e=e.toString(),e.length<t?a("0"+e,t):e}function e(t,d){function l(){return 0==t&&0==d&&"work"===s.attr("data-type")?(clearInterval(timerInterval),c.play(),s.attr("data-type","break"),r(5)):0==t&&0==d&&"break"===s.attr("data-type")&&(clearInterval(timerInterval),u.play(),s.attr("data-type","work").removeClass("gray"),$(".break").css("visibility","hidden"),e(n,i+1)),s.text(a(t,2)+":"+a(d,2)),0==d?(d=59,void t--):(d--,minRem=t,void(secRem=d))}var c=document.createElement("audio");c.src="assets/sounds/rossini-la-gazza-ladra-cut.mp3",c.load();var u=document.createElement("audio");u.src="assets/sounds/kitchen-timer.mp3",u.load();var t=t;if(void 0==d)d=0;else var d=d;l(),timerInterval=setInterval(l,1e3)}function t(){var a=$("#pause");a.data("paused")===!1?(clearInterval(timerInterval),a.data("paused",!0),a.addClass("paused")):0==secRem?(e(minRem,1),a.data("paused",!1),a.removeClass("paused")):(e(minRem,secRem),a.data("paused",!1),a.removeClass("paused"))}function r(a,t){$(".break").css("visibility","visible"),s.addClass("gray"),e(a,t)}var s=$(".timer"),n=25,i=0;s.text(a(n,2)+":"+a(i,2)),$("#add").click(function(){n++,s.text(a(n,2)+":"+a(i,2))}),$("#subtract").click(function(){n--,1>n&&(n=1),s.text(a(n,2)+":"+a(i,2))}),$("#start").click(function(){$("button").not("#pause").attr("disabled","true").addClass("gray"),$("#pause").removeAttr("disabled").removeClass("gray"),e(0,3)}),$("#pause").click(function(){t()})});