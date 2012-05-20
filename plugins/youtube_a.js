// Copyright (c) 2012 Romain Vallet <romain.vallet@gmail.com>
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'YouTube',
	version: '0.2',
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
		$('img[data-thumb*="ytimg.com/vi/"]').each(function() {
			var _this = $(this);
			_this.data().hoverZoomSrc = [_this.attr('data-thumb').replace(/\/(\d|default)\.jpg/, '/0.jpg')];
			res.push(_this);
		});
		callback($(res));
	}
});