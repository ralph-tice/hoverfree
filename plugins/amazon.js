// Copyright (c) 2010 Romain Vallet
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'Amazon',
	version: '0.3',
	prepareImgLinks: function(callback) {
		var res = [];
		hoverZoom.urlReplace(res, 
			'img[src*=.images-amazon.com]:not([src*=g-ecx.images-amazon.com]), img[src*=/img.amazon.], .iv_thumb_image',
			/(\/[^\.]+)[^\/]+\.(\w+)$/,
			'$1.$2'
		);		
		callback($(res));
	}
});