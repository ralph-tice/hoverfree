// Copyright (c) 2010 Romain Vallet
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'IMDb',
	version: '0.3',
	prepareImgLinks: function(callback) {
		var res = [];
		hoverZoom.urlReplace(res, 
			'a img[src*="._V1."]',
			/\._V1\..*\./,
			options.showHighRes ? '.' : '._V1._SX600_SY600_.'
		);
		callback($(res));
	}
});