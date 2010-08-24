// Copyright (c) 2010 Romain Vallet
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'deviantART',
	version: '0.4',
	prepareImgLinks: function(callback) {
		var res = [];
		$("a img[src^=http://th]").each(function() {
			var _this = $(this);
			var src = _this.attr('src');
			if (!src) return;
			var aSrc = src.split('/');
			aSrc.splice(4, 1);
			src = aSrc.join('/');
			var link = _this.parents('a:eq(0)');
			link.data('hoverZoomSrc', [src]);
			res.push(link);
		});
		return callback($(res));
	}
});