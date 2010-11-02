// Copyright (c) 2010 Romain Vallet
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'Tagged',
	version: '0.1',
	prepareImgLinks: function(callback) {
		var res = [];
		hoverZoom.urlReplace(res, 
			'a img, #meetme_imagediv img',
			/\/\d([^\/]+)$/,
			'/0$1'
		);	
		callback($(res));	
	}
});