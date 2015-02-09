$(document).ready(function() {
	var MusicPlayer = function(){
		this.msecsPerUpdate = 1000/60; // 60fps
		this.duration = 5; // seconds
		this.ds = window.localStorage;
		this.au = document.querySelector('audio');
		this.$progress = $('progress');
		this.timer = null;
		this.musicList = [];
		this.curMusic = {};
		this.init();
	};
	MusicPlayer.prototype = {
		init: function(){
			// Animate player on dom ready
			$('.music-player').css('transform', 'translate(-50%, -50%)');
			this._registerEvent();
			this._initMusic();
		},
		_registerEvent: function(){
			var self = this;

			$('.icon-play').click(function(e) {
				e.preventDefault();
				if (e.target.className === 'icon-play') {
					self.play(-1);
				}
				else if (e.target.className === 'icon-replay') {
					self.play(0);
				}
				else if (e.target.className === 'icon-pause') {
					self.pause();
				}

			});

			// Highlight controls on click
			$('ul.controls li i').click(function() {
				if($(this).hasClass('green')){
					$(this).removeClass('green'); 
				}
				else {
					$(this).addClass('green');
				}
			});

			$('.icon-first').click(function() {
				self.first();
			});
			$('.icon-previous').click(function() {
				self.prev();
			});
			$('.icon-next').click(function() {
				self.next();
			});
			$('.icon-last').click(function() {
				self.last();
			});
			$('ul.controls li i.icon-heart').click(function() {});
			$('ul.controls li i.icon-shuffle').click(function() {});
			$('ul.controls li i.icon-cw').click(function() {});

			// ---------------------Audio-------------------------
			self.au.addEventListener('loadedmetadata', function(){
				// 成功获取资源长度
				var t = parseInt(self.au.duration),
					c = t%60,
					s = c<10?'0'+c:c;
				document.querySelector('.duration').textContent = parseInt(t/60)+':'+s;
				self.duration = self.au.duration;
			});

			self.au.addEventListener('canplaythrough', function(){
				// 可以播放，歌曲全部加载完毕
			});

			self.au.addEventListener('play', function(){
				$('i.icon-play').removeClass('icon-play').addClass('icon-pause');
				$('i.icon-replay').removeClass('icon-replay').addClass('icon-pause');
				$('.album-image-small').addClass('swing');

				var progress = self.$progress,
					m = progress.attr('max'),
					d = parseInt(self.duration),
					ms = self.msecsPerUpdate,
					curTime = document.querySelector('.cur-time');

				self.timer = setInterval(function(){
					var t = parseInt(self.au.currentTime),
						c = t%60,
						s = c<10?'0'+c:c;
					curTime.textContent = parseInt(t/60)+':'+s;
					progress.val(m*t/d);
					// console.log(1);
				}, ms);
			});

			self.au.addEventListener('pause', function(){
				clearInterval(self.timer);
				$('i.icon-pause').removeClass('icon-pause').addClass('icon-play');
				$('.album-image-small').removeClass('swing');
			});

			// 这是个坑，触发ended事件前会触发一次pause事件
			self.au.addEventListener('ended', function(){
				self.$progress.val(self.$progress.attr('max'));
				$('i.icon-play').removeClass('icon-play').addClass('icon-replay');
			});
		},
		_initMusic: function(){
			// misicList获取的操作在这里进行
			this.musicList = window.musicList;
			this._goto(0);
		},
		_setMusic: function(music, i){
			//document.querySelector('img.album-image').src = music.img;
			document.querySelector('track').textContent = music.track;
			document.querySelector('artist').textContent = music.artist;
			document.querySelector('album').textContent = music.album;
			this.au.src = music.src;
			this.curMusic = music;
			this.curMusic.index = i;
		},
		_goto: function(n){
			var cur = this.curMusic.index || 0,
				l = this.musicList.length,
				i = ((cur+n)<0 ? l+cur+n:cur+n )%l,
				music = this.musicList[i];
			this._setMusic(music, i);
		},
		play: function(n){
			if (n==0) {
				this.$progress.val(0);
				this.au.currentTime=0;
			}
			this.au.play();
		},
		pause: function(){
			this.au.pause();
		},
		next: function(){
			this.pause();
			this._goto(1);
			this.play(0);
		},
		prev: function(){
			this.pause();
			this._goto(-1);
			this.play(0);
		},
		first: function(){
			this.pause();
			this._setMusic(this.musicList[0], 0);
			this.play(0);
		},
		last: function(){
			var l = this.musicList.length;
			this.pause();
			this._setMusic(this.musicList[l-1], l-1);
			this.play(0);
		},
	};

	var mPlayer = new MusicPlayer();
});