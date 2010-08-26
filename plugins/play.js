// Copyright (c) 2010 Romain Vallet
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'Play.com',
	version: '0.1',
	prepareImgLinks: function(callback) {
		var res = [];
		$("a img[src$=s.jpg], a img[src$=m.jpg]").each(function() {
			var _this = $(this);
			var src = _this.attr('src');
			if (!src) return;
			src = src.replace(/[sm]\.jpg/, 'x.jpg');
			var link = _this.parents('a:eq(0)');
			link.data('hoverZoomSrc', [src]);
			res.push(link);
		});
		return callback($(res));
	}
});