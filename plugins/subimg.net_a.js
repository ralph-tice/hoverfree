// Copyright (c) 2010 Romain Vallet
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'Subimg.net (a)',
	version: '0.1',
	prepareImgLinks: function(callback) {
		var res = [],
			filter = 'a[href*=subimg.net/]';
		if (document.location.hostname == 'subimg.net') {
			filter = 'a[href*=?id=]';
		}
		hoverZoom.urlReplace(res, 
			filter,
			/([^\/]+)\?id=(.*)/,
			'$2.$1'
		);
		if (res.length) { callback($(res));	}
	}
});