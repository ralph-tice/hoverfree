// Copyright (c) 2011 Maciej Nowakowski <macnow@gmail.com>
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'DigArt',
	version: '0.1',
	prepareImgLinks: function(callback) {
		var res = [];
		hoverZoom.urlReplace(res, 
			'img[src^=http://digart.img.digart.pl]',
			/(miniaturki|SQmin)(\d+)/,
			'download'
		);
		callback($(res));
	}
});