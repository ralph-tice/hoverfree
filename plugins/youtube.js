// Copyright (c) 2010 Romain Vallet
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'YouTube',
	version: '0.1',
	prepareImgLinks: function(callback) {
		var res = [];
		hoverZoom.srcReplace(res, 
			'a img[src$=/default.jpg]',
			'default.jpg',
			'hqdefault.jpg'
		);
		callback($(res));
	}
});