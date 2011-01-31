// Copyright (c) 2011 Romain Vallet
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'Panoramio',
	version: '0.1',
	prepareImgLinks: function(callback) {
		var res = [];
		// not finished
		hoverZoom.urlReplace(res, 
			'img[src*=mw-panoramio]',
			/(square|thumbnail)/,
			'medium'
		);
		hoverZoom.urlReplace(res, 
			'img[src*=mw-panoramio]',
			'medium',
			'large'
		);
		if (options.showHighRes) {
			hoverZoom.urlReplace(res, 
				'img[src*=mw-panoramio]',
				/(.*)(square|thumbnail|medium)/,
				'http://static.panoramio.com/photos/original'
			);
		}
		callback($(res));
	}
});
