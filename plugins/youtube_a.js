// Copyright (c) 2011 Romain Vallet <romain.vallet@gmail.com>
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'YouTube',
	version: '0.1',
	prepareImgLinks: function(callback) {
		var res = [],
			repl = 'http://i1.ytimg.com/vi/$1/0.jpg';
		hoverZoom.urlReplace(res, 
			'img[src*="ytimg.com/vi/"]',
			/\/(\d|default)\.jpg/,
			'/0.jpg'
		);
		hoverZoom.urlReplace(res, 
			'a[href*="youtube.com/watch"]',
			/^.*v=([\w-]+).*$/,
			repl
		);
		hoverZoom.urlReplace(res, 
			'a[href*="youtu.be/"]',
			/^.*youtu.be\/([\w-]+).*$/,
			repl
		);
		callback($(res));
	}
});