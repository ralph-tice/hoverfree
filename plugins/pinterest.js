// Copyright (c) 2011 Romain Vallet <romain.vallet@gmail.com>
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'Pinterest',
	version: '0.1',
	prepareImgLinks: function(callback) {
		var res = [];
		hoverZoom.urlReplace(res,
			'div.pin a img[src*="_b.jpg"]',
			/_b\.jpg/,
			'_c.jpg'
		);
		callback($(res));
	}
});
