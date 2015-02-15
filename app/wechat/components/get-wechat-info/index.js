(function() {
	function $(el){
		return document.querySelector(el);
	}
	// ================= wgatejs =================
	WgateJs = {};
	WgateJs.auto_auth=true;
	WgateJs.gate_options={force:1,info:"force"};
	WgateJs.ready=function(){
		var wgateid=WgateJs.getWgateid();
		//alert(wgateid);
		WgateJs.getWgateUser(function(user){
			alert(JSON.stringify(user));
			renderHTML();
			registerEvent();
		});
	}
	var u=(("https:" == document.location.protocol) ? "https" : "http") + "://st.weixingate.com/";
	u=u+'st/425';
	var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0]; g.type='text/javascript';
	g.defer=true; g.async=true; g.src=u; s.parentNode.insertBefore(g,s);
	// ============================================
	function renderHTML(){
		var tpl = '\
		<div class="layout">\
		<div class="compute"></div>\
		<p>网页版薇信登录确认</p>\
		<div class="login">登录</div>\
		<div class="cancel">取消登录</div>\
		</div>';
		$('body').innerHTML = tpl;
	}
	function registerEvent(){
		$('.login').addEventListener('touchend',function(){
			// send online message
			// ...
			$('.layout p').textContent = '你已在浏览器上登录网页薇信';
			this.textContent = '退出网页薇信';
			this.className = 'exit';
			$('.cancel').textContent = '停止手机通知>';
			$('.cancel').classList.add('stop');

			$('.exit').addEventListener('touchend',function(){
				// Fixme !!!
				// 这个confirm第一次选取消的话接下来再选的时候会重复多次弹出
				var r = confirm('真的要退出网页薇信吗？');
				if (r) {
					// send offline message
					// ...
					WeixinJSBridge.invoke('closeWindow',{},function(res){
						alert('成功退出');
					});
				}
			},false);
		},false);
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
	}
})();