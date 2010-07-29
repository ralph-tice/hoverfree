// Copyright (c) 2010 Romain Vallet
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'IMDb',
	version: '0.2',
	prepareImgLinks: function(callback) {
		var imgs = $("a img[src*='._V1.']");
		var res = [];
		imgs.each(function() {
			var img = $(this);
			var src = img.attr('src');
			if (src) {
				src = src.substr(0, src.indexOf('._V1.')) + src.substr(src.lastIndexOf('.'));
				var link = $(this).parents('a:eq(0)');
				link.data('hoverZoomSrc', [src]);
				res.push(link);
			}
		});

		callback($(res));
	}
});