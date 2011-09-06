// Copyright (c) 2010 Romain Vallet
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'Twitter',
	version: '0.1',
	prepareImgLinks: function(callback) {
		var res = [];
		hoverZoom.urlReplace(res, 
			'img[src*="_mini"]:not([src*="default_profile_"]), img[src*="_normal"]:not([src*="default_profile_"]), img[src*="_bigger"]:not([src*="default_profile_"])',
			/_(mini|normal|bigger)/,
			''
		);	
		callback($(res));
	}
});