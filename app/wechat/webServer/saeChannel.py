# -*- coding: utf-8 -*-

CHANNEL_NAME = 'WeChat'

import sae.channel
import urllib

def app(environ, start_response):
	if environ.get('REQUEST_METHOD', 'GET') == 'GET':
		start_response('200 ok', [('content-type', 'text/html')])
		route=environ['PATH_INFO'][1:]
		
		if route=='new_ws':
			url = sae.channel.create_channel(CHANNEL_NAME).encode('utf-8')
			if environ['QUERY_STRING']:
				cb = environ['QUERY_STRING'].split('&')[0].split('=')[1]
				return [cb+'({ws:"'+url+'"})']
			else: return [url]
		elif route=='login':
			url = sae.channel.create_channel('login').encode('utf-8')
			if environ['QUERY_STRING']:
				cb = environ['QUERY_STRING'].split('&')[0].split('=')[1]
				return [cb+'({ws:"'+url+'"})']
			else: return [url]
		
	length = int(environ.get('CONTENT_LENGTH', 0))
	body = environ['wsgi.input'].read(length)
	f = body.split('&')[0]
	channel = f.split('=')[1]
	msg = urllib.unquote(body.split('&')[1])
	sae.channel.send_message(channel, msg)
	start_response('200 ok', [('content-type', 'text/html')])
	return ['ok']

application = sae.create_wsgi_app(app)