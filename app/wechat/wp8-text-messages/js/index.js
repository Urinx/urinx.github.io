$(document).ready(function() {
    var WeChat = function(ws_url){
        this.ws = new WebSocket(ws_url);
        this.ds = window.localStorage;
        this.$input = $("textarea[name=inputMessage]");
        this.$screen = $(".messages ul");
        this.init();
    };
    WeChat.prototype = {
        init: function(){
            this.checkUser();
            this.registerEvent();
        },
        checkUser: function(){
            var ds = this.ds;
            if (ds.getItem('login')) {
                // ...
            }
            else{
                var name = prompt('输入你的昵称哟：');
                ds.clear();
                ds.setItem('login', true);
                ds.setItem('name', name);
            }
        },
        registerEvent: function(){
            var self = this;

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
                self.online();
            };

            self.ws.onmessage = function(msg){
                console.log(msg.data);
                var i = msg.data.indexOf('{');
                if (i!=-1) {
                    var message = msg.data.slice(i);
                    self.recieve_message(JSON.parse(message));
                }
            };

            window.onbeforeunload = function(){
                self.runaway();
                return "不要离开哟！";
            };

            window.onunload = function(){
                self.offline();
                self.ws.close();
            };

        },
        send_message: function(){
            var message = this.$input.val().trim(),
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
            var date = new Date(),
                hours = date.getHours(),
                minutes = date.getMinutes();
            if(hours < 10) {
               hours = "0" + hours;
            }
            if(minutes < 10) {
               minutes = "0" + minutes;
            }
            data.time = hours+':'+minutes;
            this.renderScreen(data);
        },
        online: function(){
            var msg = {
                name: this.ds.getItem('name'),
                msg: '#online#'
            };
            this.ws.send(JSON.stringify(msg));
        },
        runaway: function(){
            var msg = {
                name: this.ds.getItem('name'),
                msg: '#runaway#'
            };
            this.ws.send(JSON.stringify(msg));
        },
        offline: function(){
            var msg = {
                name: this.ds.getItem('name'),
                msg: '#offline#'
            };
            this.ws.send(JSON.stringify(msg));
        },
        renderScreen: function(data){
            var name = data.name,
                msg = this.url2link(data.msg),
                time = data.time,
                html = '';
            if (msg === '#online#') {
                html = '<li class="message status"><p>'+name+' is online</p></li>';
            }
            else if (msg === '#offline#') {
                html = '<li class="message status"><p>'+name+' is offline</p></li>';
            }
            else if (msg === '#runaway#') {
                html = '<li class="message status"><p>'+name+' wanna run away</p></li>';
            }
            else {
                var my_msg = "<li class='message sent'><p>",
                    not_my_msg = "<li class='message recieved'><p>"+name+': ';
                html = (name === this.ds.name? my_msg:not_my_msg)+msg+"</p><time>"+time+"</time></li>";
            }
            this.$screen.append(html);
        },
        url2link: function(str){
            return str.replace(/(^|[^"'(=])((http|https|ftp)\:\/\/[\.\-\_\/a-zA-Z0-9\~\?\%\#\=\@\:\&\;\*\+]+\b[\?\#\/\*]*)/g, '$1<a href="$2" target="_blank">$2</a>');
        },
    };

    var wechat = new WeChat('ws://channel.sinaapp.com/com/kxYi_Gyus3OMLQNm0iCd5uCeiSNee9T9_KKcFNJC-T1SX58XcWWQxQq6t2KBNhS1BCRAnXOw5XMQb4Z-1V3N_w');

});
