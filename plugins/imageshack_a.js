// Copyright (c) 2010 Romain Vallet
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'ImageShack (a)',
	version: '0.2',
	prepareImgLinks: function(callback) {
		var res = [];
		hoverZoom.urlReplace(res, 
			'a img[src*=imageshack.us]',
			'.th',
			''
		);	
		callback($(res));
	}
});