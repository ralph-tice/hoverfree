// Copyright (c) 2010 Romain Vallet
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'MySpace',
	version: '0.1',
	prepareImgLinks: function(callback) {
		var imgs = $('a img[src*=ac-images.myspacecdn.com], a img[src*=images.socialplan.com]');
		var res = [];
		imgs.each(function() {
			var link = $(this).parents('a:eq(0)');
			var src = $(this).attr('src');
			src = src.replace(/\/[sm]_/, '/l_').replace('_t.', '_p.');
			link.data('hoverZoomSrc', [src]);
			res.push(link);
		});
		callback($(res));
	}
});