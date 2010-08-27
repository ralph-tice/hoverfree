// Copyright (c) 2010 Romain Vallet
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'hi5',
	version: '0.2',
	prepareImgLinks: function(callback) {
		var res = [];
		hoverZoom.srcReplace(res, 
			'a img[src$=-01.jpg]',
			'-01.jpg',
			'-02.jpg'
		);			
		callback($(res));
	}
});