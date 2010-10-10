// Copyright (c) 2010 Romain Vallet
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'Last.fm',
	version: '0.1',
	prepareImgLinks: function(callback) {
		var res = [];
		hoverZoom.urlReplace(res, 
			'img[src*=/serve/]',
			/\/serve\/.*\//,
			'/serve/_/',
			':not(.image, .art):eq(0)'
		);	
		callback($(res));	
	}
});