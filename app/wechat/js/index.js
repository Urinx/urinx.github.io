(function() {
	var JQuery = window.$,
		ws = null,
		ds = localStorage;

    function $(el) {
        return document.querySelector(el);
    }

    function qrcode(url) {
        url = url || location.href;
        return 'http://www.liantu.com/api.php?bg=ffffff&fg=000000&gc=000000&el=h&text=' + encodeURIComponent(url);
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
            img = "background-image:url(" + wechat_qrcode_url + ");background-size:contain;font-size:2500%;";
        console.log(w + "\n%c  ", img);
    }

    function bin2hex(bin) {
        var i = 0,
            l = bin.length,
            chr, hex = '';
        for (i; i < l; ++i) {
            chr = bin.charCodeAt(i).toString(16);
            hex += chr.length < 2 ? '0' + chr : chr;
        }
        return hex;
    }

    function canvas_id() {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var txt = 'http://eular.github.io';
        ctx.textBaseline = 'top';
        ctx.font = "14px 'Arial'";
        ctx.fillStyle = '#0ff';
        ctx.fillRect(0, 0, 140, 50);
        ctx.fillStyle = '#00f';
        ctx.fillText(txt, 2, 15);
        ctx.fillStyle = 'rgba(102,204,0,0.7)';
        ctx.fillText(txt, 4, 17);
        var b64 = canvas.toDataURL().replace('data:image/png;base64,', '');
        var bin = atob(b64);
        var crc = bin2hex(bin.slice(-16, -12))+(new Date().getTime()+'').slice(-8);
        console.log('Canvas id: ' + crc);
        return crc;
    }

    function checkSupport() {
        return 'import' in document.createElement('link') && 'content' in document.createElement('template') && 'registerElement' in document;
    }

    function setWS(cb,cb2){
		JQuery.ajax({
            url: 'http://urinx.sinaapp.com/login',
            type: "GET",
            dataType: 'jsonp',
            timeout: 5000,
            contentType: "application/json;utf-8",
            success: function (data) {
                ws = new WebSocket(data.ws);
                ws.onmessage = function(msg){
                    console.log(msg.data);
                    var i = msg.data.indexOf('{');
	                if (i!=-1) {
	                    var message = msg.data.slice(i),
	                    	data = JSON.parse(message),
	                    	cid = data.cid,
	                    	user = data.user,
	                    	status = data.status;
	                    if (cid===ds.getItem('cid')) {
	                    	if (status === '#login#') {
		                    	// 登陆成功
		                    	ds.setItem('login',true);
		                    	ds.setItem('name',user.nickname);
		                    	ds.setItem('user',JSON.stringify(user));

		                    	var msg = {
		                    		cid: cid,
		                    		status: '#success#'
		                    	};
		                    	ws.send(JSON.stringify(msg));

		                    	cb();
		                    }
		                    else if(status === '#logout#'){
		                    	cb2();
		                    	alert('你已经退出登陆');
		                    }
	                    }
	                }
                };
            }
        });
	}

	function init(){
		var qrcode_template = '\
			<div class="wechat">\
			<h1>薇信</h1>\
			<p>让沟通更轻松</p>\
			<div class="qrcode"></div>\
			</div>',
			cid = canvas_id(),
            url = qrcode(location.href + 'components/get-wechat-info/?cid=' + cid);
        $('body').innerHTML = qrcode_template;
        $('.qrcode').style.backgroundImage = 'url(' + url + ')';
        console_ad();
        ds.clear();
        ds.setItem('cid', cid);
	}

    window.addEventListener('load', function() {
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

        if (checkSupport()) {
            init();
            setWS(function(){
            	$('body').innerHTML = suppot_template;
            },function(){
            	init();
            });
        } else {
            $('body').innerHTML = not_suppot_template;
        }
    });
})();
