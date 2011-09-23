// Copyright (c) 2011 Romain Vallet <romain.vallet@gmail.com>
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'Pinterest',
	version: '0.2',
	prepareImgLinks: function(callback) {
		var res = [];
		hoverZoom.urlReplace(res,
			'img[src*="_b.jpg"], img[src*="_t.jpg"]',
			/_[bt]\.jpg/,
			'_c.jpg'
		);
		callback($(res));
	}
});
