// Copyright (c) 2010 Romain Vallet
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'deviantART',
	version: '0.4',
	prepareImgLinks: function(callback) {
		var res = [];
		$("a img[src^=http://th]").each(function() {
			var img = $(this);
			var src = img.attr('src'), srcLo;
			if (!src) { return; }
			var aSrc = src.split('/');
			if (!options.showHighRes) {
				aSrc[4] = 'PRE';
				srcLo = aSrc.join('/');
			}
			aSrc.splice(4, 1);
			src = aSrc.join('/');
			srcs = [src, src, src, src];
			if (!options.showHighRes) {
				srcs = [srcLo, srcLo].concat(srcs);
			}
			var link = img.parents('a:eq(0)');
			// deviantArt tends to refuse to load images sometimes.
			// src is stored several times in hoverZoomSrc so that it may retry several times if loading fails.
			link.data('hoverZoomSrc', srcs);
			res.push(link);
		});
		callback($(res));
	}
});