// Copyright (c) 2010 Romain Vallet
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'Gamekult',
	version: '0.2',
	prepareImgLinks: function(callback) {
		var res = [];
		$("a img[src$=_1.jpg]").each(function() {
			var link = $(this).parents('a')[0];
			var src = $(this).attr('src').replace('_1.jpg', '_2.jpg');
			$(link).data('hoverZoomSrc', [src]);
			res.push(link);
		});
		callback($(res));
	}
});