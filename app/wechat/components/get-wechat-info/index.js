(function() {
	// ================= wgatejs =================
	WgateJs = {};
	WgateJs.auto_auth=true;
	WgateJs.gate_options={force:1,info:"force"};
	WgateJs.ready=function(){
		var wgateid=WgateJs.getWgateid();
		WgateJs.getWgateUser(function(user){
			init(user);
		});
	};
	var u=(("https:" == document.location.protocol) ? "https" : "http") + "://st.weixingate.com/";
	u=u+'st/452';
	var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0]; g.type='text/javascript';
	g.defer=true; g.async=true; g.src=u; s.parentNode.insertBefore(g,s);
	// ============================================
	var JQuery = window.$,
		ws = null,
		ds = localStorage,
		debug = false;

	function $(el){
		return document.querySelector(el);
	}

	function Debug(mode){
		this.init(mode);
	}
	Debug.prototype = {
		init: function(mode){
			if (mode === 'alert') {
				this.alert2log();
			}
			else if (mode === 'log') {
				this.log2alert();
			}
		},
		alert: function(s){
			console.log(s);
		},
		log: function(s){
			alert(s);
		},
		alert2log: function(){
			// 覆盖默认的alert为console.log
			var self = this;
			window.alert = function(str){
				self.alert.call(self,str);
			};
		},
		log2alert: function(){
			// 覆盖默认的console.log为alert
			var self = this;
			console.log = function(str){
				self.log.call(self,str);
			};
		},
	};

	function init(user){
		// 手机调试开关
		if (debug) {
			var d = new Debug('log');
		}
		setInfo(user);
		renderP1();
		setWS();
	}

	function setInfo(user){
		var cid = location.href.split('?')[1].split('=')[1];
		user = JSON.stringify(user);
		ds.clear();
		ds.setItem('cid',cid);
		ds.setItem('user',user);
		console.log('WGate:\n'+user);
	}

	function renderP1(){
		var tpl = '\
		<div class="layout">\
		<div class="compute"></div>\
		<p>网页版薇信登录确认</p>\
		<div class="login">登录</div>\
		<div class="cancel">取消登录</div>\
		</div>';
		$('body').innerHTML = tpl;

		$('.cancel').addEventListener('touchstart',function(){
			if (this.classList.contains('stop')) {
				alert('骚年，你还真以为这是微信啊。。\n还停止手机通知。。\n你造吗？\n我现在还不能通知好吗！');
			}
			else{
				WeixinJSBridge.invoke('closeWindow',{},function(res){
					alert('为啥不登录呢\n不登陆呢\n不要不登录嘛\n(-_-)||\n人家好伤心，呜呜');
				});
			}
		},false);

		$('.login').addEventListener('touchend',login,false);
	}

	function renderP2(){
		$('.layout p').textContent = '你已在浏览器上登录网页薇信';
		$('.login').removeEventListener('touchend',login,false);
		$('.login').textContent = '退出网页薇信';
		$('.login').className = 'exit';
		$('.cancel').textContent = '停止手机通知>';
		$('.cancel').classList.add('stop');

		$('.exit').addEventListener('touchend',function(){
			// Fixme !!!
			// 这个confirm第一次选取消的话接下来再选的时候会重复多次弹出
			var r = confirm('真的要退出网页薇信吗？');
			if (r) {
				// send logout message
				logout();
				WeixinJSBridge.invoke('closeWindow',{},function(res){
					alert('成功退出');
				});
			}
		},false);
	}

	function setWS(){
		JQuery.ajax({
            url: 'http://urinx.sinaapp.com/login',
            type: "GET",
            dataType: 'jsonp',
            timeout: 5000,
            contentType: "application/json;utf-8",
            success: function (data) {
                ws = new WebSocket(data.ws);

                ws.onopen = function(){
                    console.log('ws is open');
                    alert('连接薇信成功');
                };
                
                ws.onmessage = function(msg){
                    console.log('Received:\n'+msg.data);
                    var i = msg.data.indexOf('{');
	                if (i!=-1) {
	                    var message = msg.data.slice(i),
	                    	data = JSON.parse(message),
	                    	status = data.status,
	                    	cid = data.cid;
	                    if (cid==ds.getItem('cid') && status==='#success#') {
	                    	// 登陆成功
	                    	renderP2();
	                    }
	                }
                };
            }
        });
	}

	function login(){
		var msg = {
            cid: ds.getItem('cid'),
            user: JSON.parse(ds.getItem('user')),
            status: '#login#'
        };
        console.log('send:\n'+JSON.stringify(msg));
        ws.send(JSON.stringify(msg));
	}

	function logout(){
		var msg = {
            cid: ds.getItem('cid'),
            status: '#logout#'
        };
        console.log('send:\n'+JSON.stringify(msg));
		ws.send(JSON.stringify(msg));
	}
})();