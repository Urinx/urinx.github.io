(function(){
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
			document.querySelector('body').innerHTML = suppot_template;
		} else{
			document.querySelector('body').innerHTML = not_suppot_template;
		}
	});
})();