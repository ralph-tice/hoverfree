// Copyright (c) 2010 Romain Vallet
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'Tumblr',
	version: '0.1',
	prepareImgLinks: function(callback) {
		var res = [];
		$('img[src*=media.tumblr.com]').each(function() {
			var img = $(this),
				url = img.attr('src'),
				//width = parseInt(url.replace(/^.*_([0-9a-z]*)\..*$/, '$1')),
				width = img.width(),
				url = url.replace(/_[0-9a-z]*\.(.*)$/, '_maxwidth.$1'),
				urls = [];
			if (width < 1280) { urls.push(url.replace('maxwidth', '1280')); }
			if (width < 500) { urls.push(url.replace('maxwidth', '500')); }
			if (width < 400) { urls.push(url.replace('maxwidth', '400')); }
			if (width < 250) { urls.push(url.replace('maxwidth', '250')); }
			if (width < 128) { urls.push(url.replace('maxwidth', '128')); }
			if (width < 100) { urls.push(url.replace('maxwidth', '100')); }
			if (urls.length) {
				img.data('hoverZoomSrc', urls);
				res.push(img);
			}
		});
		hoverZoom.urlReplace(res, 
			'a[href*=tumblr.com/photo/]',
			'',
			''
		);		
		callback($(res));
	}
});