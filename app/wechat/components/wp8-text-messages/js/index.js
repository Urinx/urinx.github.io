$(document).ready(function() {
    'use strict';
    var WeChat = function(){
        this.ws = null;
        this.ds = window.localStorage;
        this.$input = $("textarea[name=inputMessage]");
        this.$screen = $(".messages ul");
        this.init();
    };
    WeChat.prototype = {
        init: function(){
            this.checkUser();
            this.getPermission();
            this.setWS();
        },
        checkUser: function(){
            let ds = this.ds;
            if (ds.getItem('login')) {
                // ...
            }
            else{
                let name = prompt('输入你的昵称哟：');
                ds.clear();
                ds.setItem('login', true);
                ds.setItem('name', name);
            }
        },
        getPermission: function(){
            // 申请通知权限
            Notification.requestPermission();
            // 申请地理位置权限
            var geoOptions={
                maximumAge:5*60*1000,
                timeout:10*1000,
                enableHighAccuracy:true
            };
            var geoSuccess=function(position){
                let lat=position.coords.latitude,
                    lon=position.coords.longitude;
                console.log(`(Geolocation) lat:${lat} lon:${lon}`);
            };
            var geoError=function(error){
                let err_map = {
                    0: '未知错误',
                    1: '权限不足',
                    2: '位置错误(位置供应商出错)',
                    3: '超时'
                };
                console.log(`Error occurred. Error code: ${err_map[error.code]}`);
            };
            navigator.geolocation.getCurrentPosition(geoSuccess,geoError,geoOptions);
        },
        registerEvent: function(){
            let self = this;

            $(".send_button").click(function() {
                self.send_message();
            });

            self.$input.keypress(function(e){
                if (e.which == 13) {
                    e.preventDefault();
                    self.send_message();
                }
            });

            // self.$input.bind({
            //     paste: function(e){
            //         debugger;
            //     },
            // });

            self.ws.onopen = function(){
                self.sendStatus('#online#');
            };

            self.ws.onclose = function(){
                self.setWS();
            };

            self.ws.onmessage = function(msg){
                console.log(msg.data);
                var i = msg.data.indexOf('{');
                if (i!=-1) {
                    var message = msg.data.slice(i);
                    self.recieve_message(JSON.parse(message));
                }
            };

            self.ws.onerror = function(e){
                console.log('WebSocket Error: '+e);
            };

            window.onbeforeunload = function(){
                self.sendStatus('#runaway#');
                return "不要离开哟！";
            };

            window.onunload = function(){
                self.sendStatus('#offline#');
                self.ws.close();
            };

            // 切换tag标签事件
            document.addEventListener('visibilitychange', function(e) {
                if (document.hidden) {
                    // window.parent.document
                    document.title = self.ds.getItem('name')+'你在看啥呢';
                    self.sendStatus('#leaveTag#');
                }
                else{
                    document.title = 'WeChat';
                    self.sendStatus('#backTag#');
                }
            }, false);

        },
        setWS: function(){
            var self = this;
            $.ajax({
                url: 'http://urinx.sinaapp.com/new_ws',
                type: "GET",
                dataType: 'jsonp',
                timeout: 5000,
                contentType: "application/json;utf-8",
                success: function (data) {
                    self.ws = new WebSocket(data.ws);
                    self.registerEvent();
                }
            });
        },
        notify: function(t,i,b,tag){
            if (Notification.permission === "granted") {
                var notification = new Notification(t,{
                    icon:i,
                    body:b,
                    tag:tag
                });
            }
            setTimeout(function() {
                notification.close();
            }, 5e3);
        },
        send_message: function(){
            let message = this.$input.val().trim(),
                msg = {
                    name: this.ds.getItem('name'),
                    msg: message,
                };
            if(!message){
                return;
            }
            this.ws.send(JSON.stringify(msg));
            this.$input.val('');
        },
        recieve_message: function(data){
            let date = new Date(),
                hours = date.getHours(),
                minutes = date.getMinutes();
            if(hours < 10) {
               hours = "0" + hours;
            }
            if(minutes < 10) {
               minutes = "0" + minutes;
            }
            data.time = `${hours}:${minutes}`;
            this.renderScreen(data);
        },
        sendStatus: function(status){
            let msg = {
                name: this.ds.getItem('name'),
                msg: status
            };
            this.ws.send(JSON.stringify(msg));
        },
        renderScreen: function(data){
            let name = data.name,
                msg = this.url2link(data.msg),
                time = data.time,
                html = '',
                map = {
                    '#online#': `${name} is online`,
                    '#offline#': `${name} is offline`,
                    '#runaway#': `${name} wanna run away`,
                    '#leaveTag#': `${name} is looking other page`,
                    '#backTag#': `${name} come back here`,
                };
            if (msg in map) {
                html = `<li class="message status"><p>${map[msg]}</p></li>`;
            }
            else {
                var my_msg = `<li class='message sent'><p>`,
                    not_my_msg = `<li class='message recieved'><p>${name}: `;
                html = (name === this.ds.name? my_msg:not_my_msg)+`${msg}</p><time>${time}</time></li>`;
            }
            this.$screen.append(html);

            // 不在当前页时
            if (document.hidden && name != this.ds.name) {
                let t = msg in map ? '系统消息':name,
                    i = 'icon',
                    b = (msg in map ? map[msg]:msg)+'\n'+time,
                    tag = 'msg';
                this.notify(t,i,b,tag);
            };
        },
        url2link: function(str){
            return str.replace(/(^|[^"'(=])((http|https|ftp)\:\/\/[\.\-\_\/a-zA-Z0-9\~\?\%\#\=\@\:\&\;\*\+]+\b[\?\#\/\*]*)/g, '$1<a href="$2" target="_blank">$2</a>');
        },
    };

    var wechat = new WeChat();

});
