(function(){
	function $(el){
		return document.querySelector(el);
	}

	function qrcode(url) {
		url = url || location.href;
		return 'http://www.liantu.com/api.php?bg=ffffff&fg=000000&gc=000000&el=h&text='+encodeURIComponent(url);
	}

	function console_ad() {
		var wechat_qrcode_url = qrcode('http://weixin.qq.com/r/I5ZXTxzEDEFzrVgs98Mx'),
			w = '\n\
	============ Preface ============== \n\
	那些年只是少数人的那些年，当别人的大学是青春时，鄙人的青春只有大学。\n\
	这辈子都没有过什么优越感，光不自卑就已经用尽全力。\n\
	坚持着，所有光鲜亮丽的背后，都曾熬过无数个不为人知的黑夜。\n\
	人说，不曾拥有和拥有后再失去那是两码事，\n\
	而我，值得你拥有！                                -- 2015.2.14 \n\
	============ About Me ============= \n\
	Github: http://www.github.com/urinx \n\
	Blog: http://urinx.github.io/ \n\
	Email: uri.lqy@gmail.com \n\
	WeChat: google-2 \n\
	Official wechat: urinx \n\
	=================================== \n\
	Scan the following qrcode to catch me:',
			img = "background-image:url("+wechat_qrcode_url+");background-size:contain;font-size:2500%;";
		console.log(w+"\n%c  ",img);
	}
	
	window.addEventListener('load', function(){
		var suppot_template = '\
			<div id="phone">\
			<iframe name="musicPlayer" src="components/music-player/index.html"></iframe>\
			</div>\
			<div id="wp-phone">\
			<iframe name="wpPhone" src="components/wp8-text-messages/index.html"></iframe>\
			</div>',
			not_suppot_template = '\
			<div id="not-support">\
			<iframe name="ios7dialog" src="components/ios7-like-confirm-dialog/index.html"></iframe>\
			</div>',
			qrcode_template = '\
			<div class="wechat">\
			<h1>薇信</h1>\
			<p>让沟通更轻松</p>\
			<div class="qrcode"></div>\
			</div>';

		var checkSupport = function(){
			return 'import' in document.createElement('link') && 'content' in document.createElement('template') && 'registerElement' in document;
		};
		if (checkSupport()) {
			$('body').innerHTML = qrcode_template;
			$('.qrcode').style.backgroundImage = 'url('+qrcode(location.href+'components/get-wechat-info/')+')';
			console_ad();
			// document.querySelector('body').innerHTML = suppot_template;
		} else{
			$('body').innerHTML = not_suppot_template;
		}
	});
})();