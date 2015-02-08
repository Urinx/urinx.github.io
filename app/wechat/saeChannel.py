# -*- coding: utf-8 -*-

template = u'''
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8" />
	<title>SAE Channel Test</title>
</head>

<body>
	<iframe name="iframe" style="display: none;"></iframe>
	<form action="http://urinx.sinaapp.com/" method="post" target="iframe">
		<input type="text" name="msg" /><button type="submit">发送</button>
	</form>
	<pre id="show"></pre>
</body>

<script type="text/javascript">
var ws = new WebSocket('%s');
ws.onmessage = function(msg){
	msg.data == '%s' ? console.log('Start chat!') : document.getElementById('show').innerHTML += '<br /> > ' + msg.data;
}
</script>

</html>
'''

CHANNEL_NAME = 'WeChat'

import sae.channel
import urllib

def app(environ, start_response):
	if environ.get('REQUEST_METHOD', 'GET') == 'GET':
		url = sae.channel.create_channel(CHANNEL_NAME)
		html = (template % (url, CHANNEL_NAME)).encode('utf-8')
		start_response('200 ok', [('content-type', 'text/html')])
		return [html]
		
	length = int(environ.get('CONTENT_LENGTH', 0))
	body = environ['wsgi.input'].read(length)
	msg = urllib.unquote(body.split('=', 1)[1])
	sae.channel.send_message(CHANNEL_NAME, msg)
	start_response('200 ok', [('content-type', 'text/html')])
	return ['ok']

application = sae.create_wsgi_app(app)