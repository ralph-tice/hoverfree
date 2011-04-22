// Copyright (c) 2011 Romain Vallet <romain.vallet@gmail.com>
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'Wordpress',
	version: '0.1',
	prepareImgLinks: function(callback) {
		if ((hoverZoom.pageGenerator && hoverZoom.pageGenerator.indexOf('WordPress') == -1) || $('img[src*="wp-content"]').length == 0) { return; }
		var res = [];
		hoverZoom.urlReplace(res, 
			'img[src*="wp-content"]',
			/-\d+x\d+\./,
			'.'
		);
		callback($(res));
	}
});