// Copyright (c) 2010 Romain Vallet
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'Twitter',
	version: '0.1',
	prepareImgLinks: function(callback) {
		var res = [];
		hoverZoom.urlReplace(res, 
			'a img[src*=_mini.]:not([src*=default_profile_]), a img[src*=_normal.], a img[src*=_bigger.]',
			/_(mini|normal|bigger)/,
			''
		);	
		callback($(res));
	}
});