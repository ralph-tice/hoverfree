// Copyright (c) 2010 Romain Vallet
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'Picasa Web Albums (a)',
	version: '0.1',
	prepareImgLinks: function(callback) {
		var res = [];
		hoverZoom.urlReplace(res, 
			'a[href*=.ggpht.com], a img[src*=.ggpht.com]',
			/\/s\d+(-c?|\/)/,
			options.showHighRes ? '/' : '/s800/'
		);	
		callback($(res));	
	}
});