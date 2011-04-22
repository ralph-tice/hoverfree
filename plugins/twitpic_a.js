// Copyright (c) 2010 Romain Vallet
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'Twitpic (a)',
	version: '0.1',
	prepareImgLinks: function(callback) {
		var res = [];
		hoverZoom.urlReplace(res, 
			'a[href*="twitpic.com"]',
			/twitpic\.com\/([^\/]*)$/,
			'twitpic.com/show/' + (options.showHighRes ? 'full' : 'large') + '/$1'
		);			
		callback($(res));
	}
});
