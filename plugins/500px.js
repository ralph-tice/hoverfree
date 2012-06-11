// Copyright (c) 2012 Romain Vallet <romain.vallet@gmail.com>
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: '500px',
	version: '0.2',
	prepareImgLinks: function(callback) {
		var res = [];
		hoverZoom.urlReplace(res, 
			'img[src*="/1.jpg"], img[src*="/2.jpg"], img[src*="/3.jpg"]',
			/\/[123]\.jpg/,
			'/4.jpg'
		);		
		callback($(res));	
	}
});