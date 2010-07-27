// Copyright (c) 2010 Romain Vallet
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'Amazon',
	version: '0.1',
	prepareImgLinks: function() {
		var res = [];
		$("a img[src*=.images-amazon.com]:not([src*=g-ecx.images-amazon.com]), a img[src*=/img.amazon.]").each(function() {
			var img = $(this);
			var src = img.attr('src');
			src = src.substr(0, src.indexOf('._')) + src.substr(src.lastIndexOf('.'));
			var link = $(this).parents('a:eq(0)');
			link.data('hoverZoomSrc', [src]);
			res.push(link);
		});
		return $(res);		
	}
});