// Copyright (c) 2010 Romain Vallet
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'Twitpic',
	version: '0.2',
	prepareImgLinks: function(callback) {
		var res = [];
		hoverZoom.urlReplace(res, 
			'a img[src*=twitpic.com/img]',
			/-(thumb|mini)/,
			'-full'
		);			
		callback($(res));
	}
});