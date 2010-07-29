// Copyright (c) 2010 Romain Vallet
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'hi5',
	version: '0.1',
	prepareImgLinks: function(callback) {
		var res = [];
		$("a img[src$=-01.jpg]").each(function() {
			var img = $(this);
			var src = img.attr('src');
			if (!src) return;
			src = src.replace('-01.jpg', '-02.jpg');
			var link = $(this).parents('a:eq(0)');
			link.data('hoverZoomSrc', [src]);
			res.push(link);
		});
		callback($(res));
	}
});