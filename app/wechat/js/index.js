(function(){
	function qrcode (url) {
		url = url || location.href;
		console.log("%c  ","background-image:url('http://www.liantu.com/api.php?bg=ffffff&fg=000000&gc=000000&el=L&text=" + encodeURIComponent(url) + "');background-size:contain;font-size:2500%;")
	}
	qrcode();
	
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
			</div>';

		var checkSupport = function(){
			return 'import' in document.createElement('link') && 'content' in document.createElement('template') && 'registerElement' in document;
		};
		if (checkSupport()) {
			// document.querySelector('body').innerHTML = suppot_template;
		} else{
			document.querySelector('body').innerHTML = not_suppot_template;
		}
	});
})();