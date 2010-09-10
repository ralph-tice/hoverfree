// Copyright (c) 2010 Romain Vallet
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'Flickr (a)',
	version: '0.1',
	prepareImgLinks: function(callback) {
		var res = [];
		$('a img[src*=static.flickr.com]').filter(function() {
			return this.src.match(/_[mst]\./);
		}).each(function() {
			var _this = $(this),
				link = _this.parents('a:eq(0)'),
				src = _this.attr('src');
			src = src.replace(/_[mst]\./, '.');
			link.data('hoverZoomSrc', [src]);
			res.push(link);
		});
		callback($(res));
	}
});